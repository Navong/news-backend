## Project Overview

This project contains the backend code for the **News Backend** application. The backend provides essential API endpoints for managing and serving news-related data. It is hosted on a Raspberry Pi, with Docker-based deployment to ensure consistency and reliability.

## Project Structure
```
/home/backend/
├── Dockerfile            # Docker image configuration
├── docker-compose.yml    # Compose file to manage multi-container setup
├── .env.local            # Environment variables for the application
├── src/                  # Source code for the backend
└── README.md             # Project documentation
```

## Deployment Environment
- **Host**: Raspberry Pi (running Linux-based OS)
- **Proxy Manager**: Traefik
- **Containerization**: Docker and Docker Compose

## CI/CD Pipeline
The CI/CD process automates the deployment of the backend from GitHub to the Raspberry Pi. Here's an overview of the steps involved:

### Workflow Trigger
The pipeline is triggered whenever a commit is pushed to the `main` branch of the repository.

### CI/CD Steps

1. **Code Checkout**:
   - The workflow checks out the latest code from the `main` branch.

2. **Docker Build and Push**:
   - Builds a Docker image locally.
   - Tags the image as `your-dockerhub-username/your-image-name:latest`.
   - Pushes the Docker image to Docker Hub.

3. **Raspberry Pi Deployment**:
   - Uses `sshpass` to securely connect to the Raspberry Pi via SSH.
   - Verifies if the project directory (`/home/backend/test`) exists. If not, it clones the Git repository.
   - Creates a `.env.local` file containing environment variables, such as `DATABASE_URL`.
   - Pulls the latest Docker image from Docker Hub.
   - Runs the container using `docker-compose`.

## Prerequisites
### 1. Raspberry Pi Setup
- Install Docker and Docker Compose.
- Configure Traefik for reverse proxy management.
- Ensure SSH access is enabled on the Raspberry Pi.

### 2. GitHub Secrets
The following secrets must be configured in your GitHub repository:
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password
- `RASPBERRY_PI_HOST`: Raspberry Pi’s hostname or IP address
- `RASPBERRY_PI_USER`: Username for Raspberry Pi login
- `RASPBERRY_PI_PASSWORD`: Password for Raspberry Pi login
- `DATABASE_URL`: Database connection string for the backend

## Pipeline Configuration
The CI/CD pipeline is defined in the `.github/workflows/main.yml` file. Below is a high-level overview:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build Docker image
        run: |
          docker build -t your-dockerhub-username/your-image-name:latest .

      - name: Push Docker image to Docker Hub
        run: |
          docker push your-dockerhub-username/your-image-name:latest

      - name: Install sshpass
        run: sudo apt-get update && sudo apt-get install -y sshpass

      - name: Clone Git repository on Raspberry Pi
        run: |
          sshpass -p "${{ secrets.RASPBERRY_PI_PASSWORD }}" ssh -o StrictHostKeyChecking=no ${{ secrets.RASPBERRY_PI_USER }}@${{ secrets.RASPBERRY_PI_HOST }} "
            if [ ! -d '/home/<your-username>/backend/test' ]; then
              git clone https://github.com/<your-username>/news-backend.git /home/<your-username>/backend/test;
            fi
          "

      - name: Create .env.local on Raspberry Pi
        run: |
          echo "DATABASE_URL=${{ secrets.DATABASE_URL }}" > .env.local
          sshpass -p "${{ secrets.RASPBERRY_PI_PASSWORD }}" scp .env.local ${{ secrets.RASPBERRY_PI_USER }}@${{ secrets.RASPBERRY_PI_HOST }}:/home/<your-username>/backend/test

      - name: Pull Docker image and run container on Raspberry Pi
        run: |
          sshpass -p "${{ secrets.RASPBERRY_PI_PASSWORD }}" ssh -o StrictHostKeyChecking=no ${{ secrets.RASPBERRY_PI_USER }}@${{ secrets.RASPBERRY_PI_HOST }} "
            cd /home/<your-username>/backend/test &&
            docker pull your-dockerhub-username/your-image-name:latest &&
            docker-compose --env-file .env.local up -d
          "
```

## What I Learned
Throughout the process of setting up the CI/CD pipeline for deploying the backend API to a Raspberry Pi, I gained valuable knowledge and experience in the following areas:

- **Automating Backend Deployment**: I learned how to automate the entire process, from code changes to deployment, by leveraging GitHub Actions and Docker.
  
- **Docker and Docker Compose**: I got hands-on experience with Docker, including building images and managing containers with Docker Compose. This ensures consistency across different environments (local and production).

- **SSH and Secure Deployment**: By using `sshpass` and SSH for remote connections, I automated the process of pulling and deploying code to the Raspberry Pi without manual intervention.

- **Handling Environment Variables**: I understood the importance of managing sensitive information such as database credentials, and how to handle environment variables securely within the pipeline using GitHub Secrets.

- **Debugging and Troubleshooting**: Encountering issues with SSH connections, Git cloning, and Docker deployment helped me improve my troubleshooting skills. I learned to look into Docker logs, verify network configurations, and ensure everything is running smoothly.

## Usage
1. Push changes to the `main` branch of your GitHub repository.
2. The CI/CD pipeline will automatically:
   - Build and push a Docker image.
   - Deploy the updated backend to your Raspberry Pi.
