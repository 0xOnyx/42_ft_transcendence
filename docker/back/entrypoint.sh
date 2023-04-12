#!/bin/bash
cd /app
npm install
npx prisma migrate dev
npm run start:dev