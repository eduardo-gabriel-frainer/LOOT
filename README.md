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