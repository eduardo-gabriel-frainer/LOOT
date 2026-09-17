npm i

1) crie o banco 

CREATE DATABASE LOOT;

2) crie o .env

DATABASE_URL="mysql://root@localhost:3306/LOOT"

3) rode as migrations

npx prisma migrate deploy
npm run dev

4) Fazer get dos jogos 

npm run job:get_jogos