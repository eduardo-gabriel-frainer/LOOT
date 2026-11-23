# Infraestrutura AWS

Este documento descreve a execução dos jobs em AWS Lambda e o monitoramento das EC2 com Prometheus e Grafana.

## Prometheus e Grafana em EC2

Arquitetura:

- A EC2 do Next.js executa o Node Exporter, que expõe métricas do sistema na porta `9100`.
- A EC2 de monitoramento executa Prometheus e Grafana em containers Docker.
- Prometheus coleta as métricas pelo IP privado da EC2 do Next.js.
- Grafana consulta Prometheus e exibe os dashboards.

As instâncias precisam ter comunicação privada entre si, por exemplo, estando na mesma VPC.

### Regras de rede

- No security group da EC2 do Next.js, permita TCP `9100` com origem no security group da EC2 de monitoramento. Não abra essa porta para a internet.
- No security group da EC2 de monitoramento, permita SSH (`22`) somente a partir do seu IP.
- Os containers publicam as portas `3000` (Grafana) e `9090` (Prometheus) somente em `127.0.0.1`. Não abra essas portas para a internet; use o túnel SSH abaixo.

### Conectar às EC2 pelo PowerShell

Use a chave `.pem` associada às instâncias, o IP público atual da EC2 e o usuário `ec2-user` (Amazon Linux 2023):

```powershell
ssh -i "$HOME\Downloads\minha-ec2-chave.pem" ec2-user@IP_PUBLICO_DA_EC2_NEXT
```

Para entrar na EC2 de monitoramento:

```powershell
ssh -i "$HOME\Downloads\minha-ec2-chave.pem" ec2-user@IP_PUBLICO_DA_EC2_MONITORAMENTO
```

Substitua cada placeholder pelo IP público atual da instância correspondente. O security group da instância precisa permitir SSH (`22`) a partir do seu IP.

### Instalar Node Exporter na EC2 do Next.js

Os comandos abaixo foram usados em Amazon Linux 2023 x86_64. Conecte-se à EC2 do Next.js e execute:

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

Os comandos abaixo também foram usados em Amazon Linux 2023 x86_64:

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

No arquivo `prometheus.yml`, substitua `172.31.18.94` pelo IP privado atual da EC2 do Next.js, se for diferente. Se esse IP mudar, atualize o target e reinicie o Prometheus:

```bash
sudo docker restart prometheus
```

Os volumes nomeados `prometheus_data` e `grafana_data` mantêm os dados fora dos containers.

### Acessar e configurar o Grafana

No PowerShell do seu computador, substitua o endereço pelo IP público atual da EC2 de monitoramento:

```powershell
cd "$HOME\Downloads"
ssh -i "minha-ec2-chave.pem" -L 3001:127.0.0.1:3000 ec2-user@IP_PUBLICO_DA_EC2_MONITORAMENTO
```

Mantenha a janela do PowerShell aberta e acesse `http://localhost:3001` no navegador. No Grafana:

1. Entre com a conta inicial e defina uma senha nova.
2. Em **Connections > Data sources > Add data source > Prometheus**, configure a URL `http://prometheus:9090` e selecione **Save & test**.
3. Em **Dashboards > New > Import**, importe o dashboard Grafana.com de ID `1860` (**Node Exporter Full**) e escolha a fonte de dados Prometheus.

Esse dashboard mostra métricas da máquina. Métricas de requisições e erros do Next.js exigem instrumentação da aplicação; métricas de Lambda devem ser consultadas no CloudWatch ou integradas separadamente.

### Parar e iniciar as EC2

- O IP público automático pode mudar ao parar e iniciar uma EC2. Atualize o IP no comando do túnel SSH para acessar o Grafana. Um Elastic IP mantém o endereço público, mas pode gerar cobrança.
- O IP privado primário permanece o mesmo ao parar e iniciar a mesma EC2. Assim, o target do Prometheus normalmente não precisa ser alterado.
- Ao parar a EC2 de monitoramento, Prometheus e Grafana ficam indisponíveis até ela ser iniciada novamente. Os volumes Docker ficam no EBS e os containers voltam a iniciar por causa de `--restart unless-stopped`.

## Executar os alertas em AWS Lambda

1. Gere o pacote de deploy:

   ```powershell
   npm run build:lambda:get_alertas
   Compress-Archive -Path .\dist\* -DestinationPath .\loot-alertas.zip -Force
   ```

2. Crie uma função Lambda com runtime **Node.js 22.x**, envie `loot-alertas.zip` e configure o handler como `get_send_email.handler`.
3. Configure `DATABASE_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` e `SMTP_FROM` na configuração da Lambda. Para produção, armazene credenciais no AWS Secrets Manager.
4. Coloque a Lambda na VPC do banco RDS. Permita conexões MySQL (porta `3306`) do security group da Lambda ao security group do RDS. As subnets também precisam de saída à internet, por exemplo, via NAT, para acessar a Steam e o SMTP.
5. Crie uma agenda no **EventBridge Scheduler** para invocar a função duas vezes ao dia e configure o fuso horário e os horários desejados.

O pacote `dist` contém o handler e as dependências necessárias, não o banco de dados nem o arquivo `.env`. A Lambda precisa de acesso de rede ao banco e às credenciais configuradas no ambiente ou no serviço de segredos.
