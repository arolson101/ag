import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import windowStateKeeper from 'electron-window-state'
import path from 'path'
import url from 'url'
import program from 'commander'

const defaultUrl = url.format({
  pathname: path.join(__dirname, 'index.html'),
  protocol: 'file',
  slashes: true,
})

// prettier-ignore
program
  .option('-u --url <url>', 'main window url to load', defaultUrl)
  .parse(process.argv)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null

// https://github.com/electron/electron/blob/master/docs/tutorial/security.md
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

function createWindow() {
  if (isDev) {
    // this breaks VS Code debugging
    //
    // const devtools = require('electron-devtools-installer');
    // const installExtension = devtools.default;
    //
    // Promise.all(
    //   [devtools.REACT_PERF]
    //   .map(installExtension)
    // )
    // .then((name) => console.log(`Added Extension:  ${name}`))
    // .catch((err) => console.log('An error occurred: ', err));
    //
    // if(!BrowserWindow.getDevToolsExtensions().hasOwnProperty('devtron')) {
    //   BrowserWindow.addDevToolsExtension(require('devtron').path);
    // }
    // if(!BrowserWindow.getDevToolsExtensions().hasOwnProperty('electron-react-devtools')) {
    //   BrowserWindow.addDevToolsExtension(require('electron-react-devtools').path);
    // }
  }

  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,

    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadURL(program.url)

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
