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