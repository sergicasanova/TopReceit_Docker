FROM node:20-alpine

# Install pm2
RUN npm install pm2 -g

# Start pm2.json process file
CMD ["pm2-runtime", "start", "pm2.json"]