1) crie o banco 

CREATE DATABASE LOOT;

2) crie o .env

DATABASE_URL="mysql://root@localhost:3306/LOOT"

3) rode as migrations

npx prisma migrate deploy