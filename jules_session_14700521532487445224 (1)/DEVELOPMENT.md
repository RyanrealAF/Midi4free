# DrumExtract Frontend Development Guide

This guide explains how to set up and run the frontend development environment for DrumExtract while keeping the backend in Docker.

## Quick Start

### Option 1: Using Development Scripts (Recommended)

**Linux/macOS:**
```bash
# Start both backend and frontend
./dev-start.sh
```

**Windows:**
```cmd
REM Start both backend and frontend
dev-start.bat
```

### Option 2: Manual Setup

1. **Start Backend (Docker)**
   ```bash
   # Start backend services
   npm run dev:backend
   
   # Check if backend is ready
   curl http://localhost:8000/health
   ```

2. **Start Frontend (Local)**
   ```bash
   # Install dependencies (if not already done)
   npm install
   
   # Start development server
   npm run dev
   ```

## Development Workflow

### During Development

- **Frontend**: Runs on `http://localhost:3000` with hot reload
- **Backend**: Runs in Docker on `http://localhost:8000`
- **API Proxy**: Vite automatically proxies API calls to the backend

### Available Commands

```bash
# Development
npm run dev              # Start frontend development server
npm run dev:backend      # Start backend in Docker
npm run dev:frontend     # Alias for npm run dev
npm run dev:stop         # Stop backend services

# Code Quality
npm run lint             # Check code with ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier

# Production
npm run build            # Build frontend for production
npm run preview          # Preview production build locally
```

## Project Structure

```
jules_session_14700521532487445224 (1)/
├── src/                 # Frontend source code
├── build/               # Production build output
├── main.py             # Backend API (runs in Docker)
├── docker-compose.yml  # Docker configuration
├── dev-start.sh        # Development startup script (Linux/macOS)
├── dev-start.bat       # Development startup script (Windows)
├── .eslintrc.json      # ESLint configuration
├── .prettierrc         # Prettier configuration
└── vite.config.js      # Vite configuration with API proxy
```

## Code Quality Tools

### ESLint
- Enforces consistent code style
- Catches common bugs and issues
- Configured for React and TypeScript

### Prettier
- Automatic code formatting
- Consistent code style across the team
- Integrates with most editors

### Vite Configuration
- **Port**: 3000 (frontend)
- **Proxy**: All API calls are proxied to `http://localhost:8000`
- **Hot Reload**: Enabled for fast development

## Troubleshooting

### Backend Not Responding
```bash
# Check if Docker is running
docker info

# Check if backend container is running
docker-compose ps

# View backend logs
docker-compose logs -f
```

### Frontend Not Connecting to Backend
```bash
# Check if backend is responding
curl http://localhost:8000/health

# Check Vite proxy configuration in vite.config.js
```

### Development Server Issues
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Rebuild Docker Image**
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Verify Deployment**
   - Frontend: `http://localhost:8000` (served by backend)
   - API: `http://localhost:8000/api/...`

## Editor Setup

### VS Code Extensions (Recommended)
- ESLint
- Prettier - Code formatter
- Volar (for Vue projects) or React support
- Tailwind CSS IntelliSense

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "prettier.requireConfig": true
}
```

## Git Hooks (Optional)

To automatically format and lint code before commits:

```bash
# Install Husky
npm install --save-dev husky

# Set up pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run format"
```

## Performance Tips

1. **Use Hot Module Replacement**: Vite's HMR is very fast
2. **Component Splitting**: Break large components into smaller ones
3. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
4. **Image Optimization**: Use appropriate image formats and sizes

## Debugging

### Frontend Debugging
- Use browser dev tools
- Vite provides excellent source maps
- Console logging is proxied to backend

### Backend Debugging
- View logs: `docker-compose logs -f`
- Access shell: `docker-compose exec api bash`
- Check volumes: `docker volume ls`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper linting/formatting
4. Test thoroughly
5. Submit a pull request

For more information, see the main [README.md](./README.md).