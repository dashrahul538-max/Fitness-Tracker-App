# Quick Start Guide for Fitness Tracker App

## Prerequisites Installation

Your system doesn't have Node.js installed yet. Here's how to set it up:

### macOS - Install Node.js

**Option 1: Using Homebrew (Recommended)**
1. First, install Homebrew:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install Node.js:
   ```bash
   brew install node
   ```

**Option 2: Using nvm (Node Version Manager)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

**Option 3: Direct Download**
- Visit https://nodejs.org/ and download the LTS version
- Follow the installation wizard

### Verify Installation
```bash
node --version
npm --version
```

## Running the Project

Once Node.js is installed:

### 1. Navigate to the project directory
```bash
cd "/Users/apple/Documents/Fitness Tracker App"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Build the frontend
```bash
npm run build
```

### 4. Start the application
```bash
npm start
```

The app will be available at: **http://localhost:5000**

## Development Mode (Optional)

For development with auto-reload:
```bash
# Terminal 1: Start backend with file watching
npm run dev

# Terminal 2 (optional): Start frontend dev server for faster reload
npx vite --host
```

## Troubleshooting

### If port 5000 is already in use:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with the actual process ID)
kill -9 <PID>
```

### Clear npm cache if installation fails:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Project Features

✅ Complete fitness tracking application
✅ Add/edit/delete activities
✅ Daily and weekly dashboard
✅ SQLite local database
✅ Beautiful responsive UI
✅ Multiple activity types supported

## Next Steps

1. Install Node.js using one of the methods above
2. Follow the "Running the Project" section
3. Open the app in your browser at http://localhost:5000
4. Start logging your fitness activities!

---

**Need help?** Check the README.md file for detailed documentation.
