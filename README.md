# LOOT

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o banco de dados:

   ```sql
   CREATE DATABASE LOOT;
   ```

3. Crie um arquivo `.env` na raiz do projeto:

   ```dotenv
   DATABASE_URL="mysql://root@localhost:3306/LOOT"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="465"
   SMTP_USER="seu-email@gmail.com"
   SMTP_PASSWORD="sua-senha-de-aplicativo"
   SMTP_FROM="LOOT <seu-email@gmail.com>"
   ```

   Configure as variáveis SMTP com os dados do seu provedor. Para Gmail, use uma senha de aplicativo em `SMTP_PASSWORD`.

4. Aplique as migrations e inicie a aplicação:

   ```bash
   npx prisma migrate deploy
   npm run dev
   ```

5. Para atualizar a lista de jogos da Steam:

   ```bash
   npm run job:get_jogos
   ```

6. Para verificar preços e enviar alertas por e-mail:

   ```bash
   npm run job:get_alertas

7. Entrar via ssh na EC2 do next 

cd "$HOME\Downloads"

ssh -i "minha-ec2-chave.pem" ec2-user@13.184.95.128

http://13.184.95.128:3000

8. Entrar via shh na grafana

cd "$HOME\Downloads"

ssh -i "minha-ec2-chave.pem" -L 3001:127.0.0.1:3000 ec2-user@18.117.147.250

LEMBRAR DE COLOCAR MY IP NO INBUD RULES DA EC2 DE MONITORAMENTO

http://localhost:3001

## Implantação

As instruções de AWS para Lambda, Prometheus e Grafana estão em [docs/infraestrutura-aws.md](docs/infraestrutura-aws.md).


