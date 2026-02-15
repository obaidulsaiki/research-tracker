const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let backendProcess;

function startBackend() {
    // In production, the backend.jar will be in the resources folder (extraResources)
    // In development, we can point to the backend's target folder
    const devPath = path.join(__dirname, '../backend/target/backend-0.0.1-SNAPSHOT.jar');
    const prodPath = path.join(process.resourcesPath, 'backend.jar');

    const jarPath = fs.existsSync(prodPath) ? prodPath : devPath;

    if (!fs.existsSync(jarPath)) {
        console.error('Backend JAR not found at:', jarPath);
        return;
    }

    console.log('Spawning backend from:', jarPath);
    backendProcess = spawn('java', ['-jar', jarPath], {
        stdio: 'ignore', // Keep it invisible for the user
        windowsHide: true
    });

    backendProcess.on('error', (err) => {
        console.error('Failed to start backend process:', err);
    });
}

function checkBackendHealth(onReady, retries = 30) {
    if (retries <= 0) {
        console.error('Backend failed to start in time.');
        onReady(); // Show window anyway, it will show an error state
        return;
    }

    http.get('http://localhost:8080/api/research', (res) => {
        if (res.statusCode === 200) {
            console.log('Backend is ready!');
            onReady();
        } else {
            setTimeout(() => checkBackendHealth(onReady, retries - 1), 1000);
        }
    }).on('error', () => {
        setTimeout(() => checkBackendHealth(onReady, retries - 1), 1000);
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Research-Tracker",
        icon: "logo.png",
        show: false, // Don't show until ready
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // 1. Determine Frontend Path
    const prodDistPath = path.join(process.resourcesPath, 'frontend/index.html');
    const devDistPath = path.join(__dirname, '../frontend/dist/frontend/browser/index.html');

    // FORCE DEV MODE: If not packaged, always try localhost first
    if (!app.isPackaged) {
        console.log('Running in DEVELOPMENT mode: Loading http://localhost:4200');
        mainWindow.loadURL('http://localhost:4200');

        // Open DevTools automatically in dev mode
        mainWindow.webContents.openDevTools();
    } else {
        // PRODUCTION MODE: Load from resources
        if (fs.existsSync(prodDistPath)) {
            console.log('Running in PRODUCTION mode: Loading from resources');
            mainWindow.loadFile(prodDistPath);
        } else {
            // Fallback for some packaging weirdness
            console.error('Production build not found, falling back to localhost');
            mainWindow.loadURL('http://localhost:4200');
        }
    }

    checkBackendHealth(() => {
        mainWindow.show();
    });

    // Application Menu
    const template = [
        { label: 'File', submenu: [{ role: 'quit' }] },
        { label: 'Edit', submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }] },
        { label: 'View', submenu: [{ role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }, { type: 'separator' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }] },
        { label: 'Help', submenu: [{ label: 'Learn More', click: async () => { await shell.openExternal('https://github.com/obaidulsaiki/research-tracker'); } }] }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    startBackend();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (backendProcess) {
        console.log('Killing backend process...');
        backendProcess.kill();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

