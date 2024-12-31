## Project Overview
[![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=flat&logo=node.js)](https://nodejs.org/)  [![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Automated-2088FF?style=flat&logo=github-actions)](https://github.com/features/actions)  [![Docker](https://img.shields.io/badge/Docker-20.10.8-2496ED?style=flat&logo=docker)](https://www.docker.com/)  [![Traefik](https://img.shields.io/badge/Traefik-2.9-FF7043?style=flat&logo=traefik)](https://traefik.io/)  [![Cron](https://img.shields.io/badge/Cron-Scheduled-important?style=flat&logo=linux)](https://en.wikipedia.org/wiki/Cron) [![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)  

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
   - Verifies if the project directory (`/home/<your-username>/backend/test`) exists. If not, it clones the Git repository.
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
The CI/CD pipeline is defined in the `.github/workflows/main.yml` file. 

## What I Learned
Throughout the process of setting up the CI/CD pipeline for deploying the backend API to a Raspberry Pi, I gained valuable knowledge and experience in the following areas:

- **Automating Backend Deployment**: Leveraged GitHub Actions and Docker to automate the entire deployment process, from code changes to production, streamlining and simplifying the workflow.  

- **Docker and Docker Compose Expertise**: Gained hands-on experience with Docker, including building images and managing containers with Docker Compose, ensuring consistent behavior across both local and production environments.  

- **Automating Secure Deployment**: Automated remote deployment processes by integrating SSH and `sshpass`, allowing for seamless code updates and deployment to the Raspberry Pi without manual intervention.  

- **Secure Environment Management**: Learned to manage environment variables securely using GitHub Secrets to handle sensitive information, such as database credentials, effectively within the pipeline.  

- **Enhanced Debugging Skills**: Improved troubleshooting skills by resolving issues related to SSH connections, Git operations, and Docker deployments, utilizing tools such as Docker logs and network configuration analysis.  

- **Scheduled News Updates**: Set up a cron job to fetch and update fresh news three times daily, ensuring up-to-date content availability.  

## Usage
1. Push changes to the `main` branch of your GitHub repository.
2. The CI/CD pipeline will automatically:
   - Build and push a Docker image.
   - Deploy the updated backend to your Raspberry Pi.

## Troubleshooting
- **SSH Errors**: Ensure the Raspberry Pi username, password, and IP address are correct.
- **Git Clone Issues**: Verify the repository URL and network connectivity.
- **Docker Issues**: Check Docker logs on the Raspberry Pi for detailed error messages.

