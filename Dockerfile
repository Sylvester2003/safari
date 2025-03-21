FROM rust:latest

RUN apt update && apt install -y curl && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="$HOME/.bun/bin:$PATH"

WORKDIR /app
