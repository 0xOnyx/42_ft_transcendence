#!/bin/bash
cd /app
npm install &&
npx prisma migrate deploy &&
npm run start:dev