#!/bin/bash
cd /app
npm install
npm run build
node dist/src/main.js