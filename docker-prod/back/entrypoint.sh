#!/bin/bash
cd /app
npm install
npm run build
npx prisma migrate deploy
node dist/src/main.js
