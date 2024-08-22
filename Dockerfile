# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Install Capacitor CLI globally
RUN npm install -g cordova \
    && npm install -g vite \
    && npm install -g cordova-icon \
    && npm install -g cordova-splash \
    && npm install -g javascript-obfuscator \
    && npm install -g html-minify \
    && npm install -g eslint \
    && npm install -g eslint-plugin-jquery


# Copy app folder to container
COPY . /app

# Create user with UID 1000:1000 to avoid permission issues
#RUN useradd -u 1000 -U -d /app pepa
RUN useradd -U -d /app pepa


# Change ownership of app folder to new user
RUN chown -R pepa:pepa /app

# Change to new user
USER pepa

# Expose the default Capacitor port
EXPOSE 3000

# Start a shell to allow interactive usage
CMD ["/bin/bash"]