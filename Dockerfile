FROM node:18.17.1-alpine

ARG PB_VERSION=0.21.3

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# uncomment to copy the local pb_migrations dir into the image
COPY ./pb/pb_migrations /pb/pb_migrations

# uncomment to copy the local pb_data dir into the image
COPY ./pb/pb_data /pb/pb_data

# uncomment to copy the local pb_hooks dir into the image
# COPY ./pb_hooks /pb/pb_hooks

# Copy files from local project directory to the Docker container
COPY . /app

# Set the working directory
WORKDIR /app

# Expose port 8090 for PocketBase
EXPOSE 8090

# Expose port 3000 for the application
EXPOSE 3000

# Start PocketBase and install dependencies to run npm start
CMD sh -c "/pb/pocketbase serve --http=0.0.0.0:8090 & npm i && npm start"
