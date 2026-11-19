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