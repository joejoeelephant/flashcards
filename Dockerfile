# Set the base image
FROM node:16-alpine

# Create app directory in Docker
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install dependencies
RUN npm install

# Prisma setup with SQLite
RUN npx prisma init --datasource-provider sqlite

# Copy the rest of the application into the Docker image
COPY . .

# Prisma generate
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Bind the port that your app will run on
EXPOSE 3000

# Define the Docker image's behavior at runtime
CMD [ "npm", "start" ]
