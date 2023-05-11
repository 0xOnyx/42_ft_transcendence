#!/bin/bash
cd /app
npm install
npm i -D @sveltejs/adapter-static
npm run build
chmod a+x /app/build