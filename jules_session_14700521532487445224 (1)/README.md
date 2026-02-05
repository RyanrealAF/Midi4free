# DrumExtract Studio

A full-stack web application for extracting drum tracks from audio files and converting them to MIDI.

![CI](https://github.com/RyanrealAF/Midi4free/actions/workflows/docker-build-push.yml/badge.svg)

## Features

- **Audio Separation**: Uses Spleeter to isolate drum tracks from full audio
- **MIDI Conversion**: Converts isolated drum tracks to MIDI using Basic Pitch
- **Real-time Processing**: WebSocket-based progress tracking
- **Interactive UI**: React-based interface with waveform visualization
- **File Management**: Automatic cleanup and persistent storage

## Quick Start

### Using Docker (Recommended)

1. **Build and Deploy**:
   ```bash
   # Windows
   .\deploy.bat
   
   # Linux/macOS
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Access the Application**:
   - Web Interface: http://localhost:8000
   - API Health: http://localhost:8000/health

### Manual Deployment

1. **Build the Frontend**:
   ```bash
   cd jules_session_14700521532487445224 (1)
   npm install
   npm run build
   ```

2. **Build and Run with Docker**:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml up -d
   ```

## File Structure

```
jules_session_14700521532487445224 (1)/
├── 📁 Frontend (React/Vite)
│   ├── App.jsx                    # Main application component
│   ├── WaveformVisualizer.jsx     # Audio visualization
│   ├── MidiPianoRoll.jsx          # MIDI piano roll display
│   ├── useAudioProcessor.js       # Audio processing hooks
│   ├── index.html                 # HTML entry point
│   ├── main.jsx                   # React entry point
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.js             # Build configuration
│   ├── tailwind.config.js         # Styling configuration
│   └── build/                     # Built frontend files
│
├── 📁 Backend (FastAPI)
│   ├── main.py                    # FastAPI server
│   ├── pipeline.py                # Audio processing pipeline
│   ├── requirements.txt           # Python dependencies
│   └── modal_app.py             # Modal application
│
├── 📁 Deployment
│   ├── Dockerfile.prod            # Production Dockerfile
│   ├── docker-compose.prod.yml    # Production compose file
│   ├── deploy.sh                  # Linux/macOS deployment script
│   ├── deploy.bat                 # Windows deployment script
│   ├── .dockerignore              # Docker ignore rules
│   └── DEPLOYMENT.md              # Detailed deployment guide
│
└── 📁 Data
    ├── uploads/                   # Temporary upload storage
    └── outputs/                   # Processed audio and MIDI files
```

## Technical Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Tone.js** - Web Audio API framework
- **@tonejs/midi** - MIDI file handling

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Spleeter** - Audio source separation
- **Basic Pitch** - MIDI conversion
- **NumPy** - Numerical computing

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Multi-stage builds** - Optimized production images

## API Endpoints

### File Upload
- `POST /upload` - Upload audio file for processing
- Returns: Task ID for tracking progress

### WebSocket Processing
- `GET /ws/process/{task_id}` - Real-time processing updates
- Supports: Progress tracking, MIDI conversion commands

### File Downloads
- `GET /download/midi/{task_id}` - Download MIDI file
- `GET /download/drums/{task_id}` - Download isolated drums
- `GET /download/stems/{task_id}/{stem}` - Download other stems

### Status and Health
- `GET /status/{task_id}` - Check processing status
- `GET /health` - Application health check

## Development

### Frontend Development
```bash
cd jules_session_14700521532487445224 (1)
npm run dev
```

### Backend Development
```bash
cd jules_session_14700521532487445224 (1)
uvicorn main:app --reload --port 8000
```

### Full Development Stack
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
uvicorn main:app --reload --port 8000
```

## Production Considerations

### Performance
- Audio processing is CPU-intensive
- Consider using shorter audio files for better performance
- Allocate sufficient memory (4GB+ recommended)

### Storage
- Processed files are stored in Docker volumes
- Automatic cleanup after 1 hour of inactivity
- Configure volume backups for data persistence

### Security
- CORS allows all origins (configure for production)
- File uploads have no size limits (add limits in production)
- Run containers with non-root users when possible

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clean and rebuild
   docker system prune -f
   docker-compose -f docker-compose.prod.yml build --no-cache
   ```

2. **Port Conflicts**
   ```bash
   # Change port in docker-compose.prod.yml
   ports:
     - "8080:8000"  # Use different host port
   ```

3. **Memory Issues**
   - Increase Docker memory allocation
   - Process shorter audio files
   - Monitor system resources

### Logs and Monitoring
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f

# Check container health
docker inspect --format='{{.State.Health.Status}}' drumextract_api_1

# Monitor resource usage
docker stats
```

## License

This project is licensed under the terms specified in the LICENSE file.

## Support

For issues and support, please refer to the [DEPLOYMENT.md](DEPLOYMENT.md) guide or check the application logs.