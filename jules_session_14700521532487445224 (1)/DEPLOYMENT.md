# DrumExtract Deployment Guide

This guide covers how to deploy the DrumExtract application for production use.

## Overview

DrumExtract is a full-stack web application that separates drum tracks from audio files and converts them to MIDI. The application consists of:

- **Frontend**: React/Vite application for the user interface
- **Backend**: FastAPI Python server for audio processing
- **Processing**: Uses Spleeter for audio separation and Basic Pitch for MIDI conversion

## Prerequisites

- Docker and Docker Compose installed
- At least 4GB of RAM (recommended 8GB for better performance)
- 2GB+ disk space for Docker images and dependencies

## Quick Deployment

### Using the Deployment Script

The easiest way to deploy is using the provided deployment script:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

This script will:
1. Build the production Docker image
2. Start the application
3. Verify the deployment is successful

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build the production image
docker-compose -f docker-compose.prod.yml build

# Start the application
docker-compose -f docker-compose.prod.yml up -d

# Check the application status
docker-compose -f docker-compose.prod.yml ps
```

## Packaging Images for Offline Deployment

If you need to move the container image(s) to an air-gapped or offline host, you can build and export the image to a tar (optionally compressed) file.

There are helper scripts in `scripts/`:

- `scripts/package_containers.sh` — POSIX shell script
- `scripts/package_containers.bat` — Windows batch script

Example (Linux/macOS):

```bash
# build and save compressed image
IMAGE_NAME=yourrepo/drumextract:1.0 GZIP=1 ./scripts/package_containers.sh

# this produces a tar.gz under `dist/` — transfer to target host
docker load -i dist/yourrepo_drumextract_1.0.tar.gz
```

Example (Windows CMD):

```bat
set IMAGE_NAME=yourrepo/drumextract:1.0
set OUTPUT_DIR=dist
set GZIP=1
scripts\package_containers.bat

rem then on the target host:
docker load -i dist\yourrepo_drumextract_1.0.tar.gz
```

Once loaded on the target host, run the production compose file as normal:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Application Access

Once deployed, the application will be available at:

- **Web Interface**: http://localhost:8000
- **API Health Check**: http://localhost:8000/health

## File Structure

```
jules_session_14700521532487445224 (1)/
├── Dockerfile.prod          # Production Dockerfile with multi-stage build
├── docker-compose.prod.yml  # Production Docker Compose configuration
├── deploy.sh               # Automated deployment script
├── main.py                 # FastAPI backend server
├── package.json            # Frontend dependencies
├── vite.config.js          # Frontend build configuration
├── build/                  # Frontend build output (created during build)
└── pipeline.py             # Audio processing pipeline
```

## Configuration

### Environment Variables

The application supports the following environment variables:

- `PYTHONUNBUFFERED=1`: Ensures Python output is immediately visible
- `LOG_LEVEL=info`: Sets the logging level

### Volume Persistence

The application uses Docker volumes to persist processed audio files:

- `drum_data`: Stores uploaded files, processed stems, and MIDI files

To backup this data:

```bash
# Backup the volume
docker run --rm -v drumextract_drum_data:/data -v $(pwd):/backup alpine tar czf /backup/drum_data_backup.tar.gz /data

# Restore the volume
docker run --rm -v drumextract_drum_data:/data -v $(pwd):/backup alpine tar xzf /backup/drum_data_backup.tar.gz -C /
```

## Monitoring

### Health Checks

The application includes health checks that can be monitored:

```bash
# Check application health
curl http://localhost:8000/health

# Check Docker container health
docker inspect --format='{{.State.Health.Status}}' drumextract_api_1
```

### Logs

View application logs:

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# View logs from a specific service
docker-compose -f docker-compose.prod.yml logs api

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f
```

## Scaling

### Single Instance

The default configuration runs a single instance of the application.

### Multiple Instances

To run multiple instances for load balancing:

```yaml
# In docker-compose.prod.yml, add:
services:
  api:
    deploy:
      replicas: 3
```

Note: When scaling to multiple instances, you'll need to configure shared storage for the `drum_data` volume.

## Troubleshooting

### Common Issues

1. **Port 8000 already in use**
   ```bash
   # Stop other services using port 8000
   docker-compose -f docker-compose.prod.yml down
   # Or change the port in docker-compose.prod.yml
   ```

2. **Insufficient memory**
   - Spleeter requires significant memory for audio processing
   - Ensure at least 4GB RAM is available
   - Consider increasing Docker memory limits

3. **Build failures**
   ```bash
   # Clean up and rebuild
   docker-compose -f docker-compose.prod.yml down
   docker system prune -f
   docker-compose -f docker-compose.prod.yml build --no-cache
   ```

### Performance Optimization

1. **Audio Processing**
   - Process shorter audio files for better performance
   - Consider using lower quality settings for faster processing

2. **Docker Resources**
   - Allocate more CPU and memory to Docker
   - Use SSD storage for better I/O performance

3. **Network**
   - Ensure stable internet connection for initial Docker image downloads

## Security Considerations

1. **File Uploads**
   - The application accepts audio file uploads
   - Files are stored temporarily and cleaned up after 1 hour
   - Consider implementing file size limits in production

2. **CORS**
   - The application allows all origins for CORS
   - In production, restrict CORS to your specific domains

3. **Docker Security**
   - Keep Docker and base images updated
   - Use minimal base images
   - Run containers with non-root users when possible

## Development vs Production

### Development Setup

For development, use the original files:

```bash
# Frontend development
npm run dev

# Backend development
uvicorn main:app --reload --port 8000
```

### Production Setup

For production, use the production files:

```bash
# Build and deploy
./deploy.sh
```

## Support

If you encounter issues:

1. Check the logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify health: `curl http://localhost:8000/health`
3. Check Docker resources: `docker system df`
4. Review this documentation

## Updates

To update the application:

1. Pull the latest code
2. Rebuild: `docker-compose -f docker-compose.prod.yml build --no-cache`
3. Restart: `docker-compose -f docker-compose.prod.yml up -d`

## Continuous Integration (CI)

A GitHub Actions workflow is included to build and push the production image when commits are pushed to `main`.

File: [.github/workflows/docker-build-push.yml](.github/workflows/docker-build-push.yml)

Login and image name

- The workflow logs into GitHub Container Registry (GHCR) using `github.actor` and the repository `GITHUB_TOKEN` by default — no extra repository secrets are required for most repositories. If your organization restricts `GITHUB_TOKEN` package permissions, create a Personal Access Token (PAT) with `write:packages` and set `REGISTRY_USERNAME` and `REGISTRY_PASSWORD` as repository secrets.

- Default image name produced by the workflow (auto-lowercased):

```
ghcr.io/ryanrealaf/midi4free
```

Notes:


## Releases (packaged images)

A separate workflow packages the production image into a gzipped tar and attaches it to GitHub Releases.

- Workflow: [.github/workflows/release-pack-image.yml](.github/workflows/release-pack-image.yml)
- Trigger: runs automatically when a GitHub Release is published, or can be run manually via `workflow_dispatch` (requires `tag` input).
- Output: release asset named `<tag>.tar.gz` containing the Docker image produced from `Dockerfile.prod`.

Note: the workflow also uploads the packaged image as a workflow artifact (Actions → run → Artifacts) for faster download without visiting the Release page.

Usage examples:

1) Publish a GitHub Release (via the GitHub UI) — the workflow will run and attach `vX.Y.Z.tar.gz` to the release.

2) Manually run the workflow from Actions -> `Package image and attach to Release` and provide `tag`, `name` and release notes.

After downloading on a target host, load and run:

```bash
# load image
docker load -i v1.0.0.tar.gz

# start services
docker-compose -f docker-compose.prod.yml up -d
```