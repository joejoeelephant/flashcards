# Set the base image
FROM node:16-alpine

# Create app directory in Docker
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Copy app from local environment into the container
COPY . .

# Prisma generate
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Bind the port that your app will run on
EXPOSE 3000

# Define the Docker image's behavior at runtime
CMD [ "npm", "start" ]
