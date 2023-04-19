#!/bin/bash
cd /app
npm install &&
npx prisma migrate dev --name init &&
npm run start:dev