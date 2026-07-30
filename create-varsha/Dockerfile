# Dockerfile for create-varsha CLI
# A premium Astro + Starlight starter template scaffolder by myndlabs
#
# Usage:
#   docker run --rm -v ${PWD}:/workspace ghcr.io/yethikrishna/create-varsha my-site
#   docker run --rm -v ${PWD}:/workspace ghcr.io/yethikrishna/create-varsha --help

FROM node:20-alpine AS base

LABEL org.opencontainers.image.title="create-varsha"
LABEL org.opencontainers.image.description="Scaffold a new varsha website — a premium Astro + Starlight starter template by myndlabs"
LABEL org.opencontainers.image.authors="Yethikrishna R <hey@myndlabs.tech>"
LABEL org.opencontainers.image.license="MIT"
LABEL org.opencontainers.image.source="https://github.com/yethikrishna/web-ui-template"
LABEL org.opencontainers.image.homepage="https://myndlabs.tech"

# Install git for template cloning
RUN apk add --no-cache git

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY bin/ ./bin/
COPY LICENSE ./LICENSE
COPY README.md ./README.md

# Install the package globally
RUN npm install -g .

# Set working directory to workspace (mounted volume)
WORKDIR /workspace

# Default entrypoint
ENTRYPOINT ["create-varsha"]

# Default command shows help
CMD ["--help"]
