#!/bin/bash
cd /app
npm install
npm run build
npx prisma migrate dev --name init
node dist/src/main.js