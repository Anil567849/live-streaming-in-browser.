FROM ubuntu:focal

# Update the package list
RUN apt-get update

# Install curl
RUN apt-get install -y curl

# Download and run the Node.js setup script from NodeSource
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -

RUN apt-get update

RUN apt-get upgrade -y

# Install Node.js
RUN apt-get install -y nodejs

# Install ffmpeg
RUN apt-get install -y ffmpeg

# Set working directory
WORKDIR /home/app

COPY index.js index.js
COPY package*.json .
COPY lib/ lib/

RUN npm install

CMD node index.js
