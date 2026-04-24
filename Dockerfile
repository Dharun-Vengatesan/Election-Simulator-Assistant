FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Set environment to production for Express optimizations
ENV NODE_ENV=production

# Install app dependencies
COPY --chown=node:node package*.json ./

# Only install production dependencies
RUN npm ci --omit=dev

# Bundle app source
COPY --chown=node:node . .

# Use non-root user for security
USER node

# Expose port
EXPOSE 8080

# Start server
CMD [ "npm", "start" ]
