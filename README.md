npm i

1) crie o banco 

CREATE DATABASE LOOT;

2) crie o .env

DATABASE_URL="mysql://root@localhost:3306/LOOT"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="seu-email@gmail.com"
SMTP_PASSWORD="sua-senha-de-aplicativo"
SMTP_FROM="LOOT <seu-email@gmail.com>"

3) rode as migrations

npx prisma migrate deploy
npm run dev

4) Fazer get dos jogos 

npm run job:get_jogos

5) Verificar os preços e enviar alertas por email

npm run job:get_alertas

Configure as variáveis SMTP no `.env` com os dados do seu provedor de email.
Para Gmail, use uma senha de aplicativo em `SMTP_PASSWORD`.





## Conectar as EC2 pelo PowerShell

Use o IP público atual da instância. O endereço abaixo e apenas um exemplo:

```powershell
cd "$HOME\Downloads"
ssh -i "minha-ec2-chave.pem" ec2-user@IP_PUBLICO_DA_EC2_NEXT
```

Nao salve senhas no README ou no repositorio. Altere a senha inicial do Grafana no primeiro acesso.

## Monitoramento com Prometheus e Grafana

A arquitetura usa uma EC2 para a aplicacao Next.js e outra para Prometheus e Grafana:

- **Node Exporter** na EC2 do Next expoe metricas do sistema, como CPU, memoria, disco e rede.
- **Prometheus** na EC2 de monitoramento coleta essas metricas pelo IP privado da EC2 do Next.
- **Grafana** consulta o Prometheus e exibe dashboards.

As duas instancias devem estar em uma rede que permita comunicacao privada entre elas, por exemplo, na mesma VPC.

### Regras de rede

- No security group da EC2 do Next, permita TCP `9100` com origem no security group da EC2 de monitoramento. Nao abra essa porta para a internet.
- No security group da EC2 de monitoramento, permita SSH (`22`) somente a partir do seu IP.
- Prometheus e Grafana estao publicados apenas em `127.0.0.1` na EC2 de monitoramento. Nao abra as portas `9090` ou `3000` para a internet; acesse o Grafana pelo tunel SSH abaixo.

### Instalar o Node Exporter na EC2 do Next

Os comandos abaixo foram usados em Amazon Linux 2023 x86_64. Conecte-se a EC2 do Next e execute:

```bash
sudo useradd --system --no-create-home --shell /sbin/nologin node_exporter
cd /tmp
curl -fLO https://github.com/prometheus/node_exporter/releases/download/v1.13.1/node_exporter-1.13.1.linux-amd64.tar.gz
echo '5c00c5234f1ee45900b25539a5a0ab82146a098c15c16a4ec3bc855b597a6477  node_exporter-1.13.1.linux-amd64.tar.gz' | sha256sum --check
tar xzf node_exporter-1.13.1.linux-amd64.tar.gz
sudo install -o node_exporter -g node_exporter -m 0755 node_exporter-1.13.1.linux-amd64/node_exporter /usr/local/bin/node_exporter

sudo tee /etc/systemd/system/node_exporter.service > /dev/null <<'EOF'
[Unit]
Description=Prometheus Node Exporter
After=network-online.target
Wants=network-online.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now node_exporter
sudo systemctl status node_exporter --no-pager
curl -fsS http://localhost:9100/metrics -o /dev/null
```

### Instalar Prometheus e Grafana na EC2 de monitoramento

Os comandos abaixo tambem foram usados em Amazon Linux 2023 x86_64:

```bash
sudo dnf install -y docker
sudo systemctl enable --now docker

sudo mkdir -p /opt/monitoring/prometheus
sudo tee /opt/monitoring/prometheus/prometheus.yml > /dev/null <<'EOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "next-ec2"
    static_configs:
      - targets: ["172.31.18.94:9100"]
EOF

sudo docker network create monitoring

sudo docker run -d \
  --name prometheus \
  --restart unless-stopped \
  --network monitoring \
  -p 127.0.0.1:9090:9090 \
  -v /opt/monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro,Z \
  -v prometheus_data:/prometheus \
  prom/prometheus:latest \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/prometheus \
  --storage.tsdb.retention.time=15d

sudo docker run -d \
  --name grafana \
  --restart unless-stopped \
  --network monitoring \
  -p 127.0.0.1:3000:3000 \
  -v grafana_data:/var/lib/grafana \
  grafana/grafana:latest

sudo docker ps
curl -fsS http://127.0.0.1:9090/-/healthy
```

Se a EC2 do Next for substituida ou o seu IP privado mudar, atualize o target `172.31.18.94:9100` em `/opt/monitoring/prometheus/prometheus.yml` e reinicie o Prometheus com `sudo docker restart prometheus`. Os volumes nomeados `prometheus_data` e `grafana_data` guardam os dados fora dos containers.

### Acessar e configurar o Grafana

No PowerShell do seu computador, execute o tunel SSH para a EC2 de monitoramento. Substitua o IP pelo **IP publico atual** dessa instancia:

```powershell
cd "$HOME\Downloads"
ssh -i "minha-ec2-chave.pem" -L 3001:127.0.0.1:3000 ec2-user@IP_PUBLICO_DA_EC2_MONITORAMENTO
```

Mantenha a janela do PowerShell aberta e acesse `http://localhost:3001` no navegador. No Grafana:

1. Entre com a conta inicial e defina uma senha nova.
2. Em **Connections > Data sources > Add data source > Prometheus**, configure a URL `http://prometheus:9090` e selecione **Save & test**.
3. Em **Dashboards > New > Import**, importe o dashboard Grafana.com de ID `1860` (**Node Exporter Full**) e escolha a fonte de dados Prometheus.

Esse dashboard mostra metricas da maquina. Metricas de requisicoes e erros do Next.js exigem instrumentacao da aplicacao; metricas de Lambda devem ser consultadas no CloudWatch ou integradas separadamente.

### O que acontece quando uma EC2 e parada

- O IP publico automatico pode mudar ao parar e iniciar uma EC2. Atualize o IP no comando do tunel SSH para acessar o Grafana. Um Elastic IP mantem o endereco publico, mas pode gerar cobranca.
- O IP privado primario da instancia permanece o mesmo ao parar e iniciar a mesma EC2. Assim, o target do Prometheus normalmente nao precisa ser alterado.
- Ao parar a EC2 de monitoramento, Prometheus e Grafana ficam indisponiveis ate ela ser iniciada novamente. Os volumes Docker ficam no armazenamento EBS e os containers voltam a iniciar por causa de `--restart unless-stopped`.



## Executar os alertas em uma AWS Lambda

1. Gere o pacote de deploy:

   ```powershell
   npm run build:lambda:get_alertas
   Compress-Archive -Path .\dist\* -DestinationPath .\loot-alertas.zip -Force
   ```

2. Crie uma função Lambda com runtime **Node.js 22.x**, faça upload de `loot-alertas.zip` e configure o handler como `get_send_email.handler`.
3. Configure `DATABASE_URL` com o endpoint do RDS e as variáveis `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` e `SMTP_FROM` na configuração da Lambda.
4. Coloque a Lambda na VPC do RDS. Permita conexões MySQL (porta 3306) do security group da Lambda ao security group do RDS. As subnets também precisam de saída à internet (por exemplo, via NAT) para acessar a Steam e o SMTP do Gmail.
5. Crie uma agenda no **EventBridge Scheduler** para invocar a função duas vezes ao dia. Escolha o fuso horário e os horários desejados na agenda.

O pacote `dist` contém apenas o handler e as dependências necessárias. Não inclua o `.env` no ZIP. Para uso em produção, armazene as credenciais em um serviço de segredos da AWS.
