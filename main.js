const {app, BrowserWindow, ipcMain} = require('electron');
const Store = require('./store.js');
let win;
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: {width: 800, height: 600},
    config: {gitToken: ''}
  }
});
function createWindow() {
  // Create the browser window.
  let {width, height} = store.get('windowBounds');
  win = new BrowserWindow({
    width: width,
    height: height,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`
  });
  // win.setMenu(null);
  win.loadURL(`file://${__dirname}/dist/index.html`);
  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()
  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
  win.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let {width, height} = win.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', {width, height});
  });
  ipcMain.on('loadConfig', (event, arg) => {

    const config = store.get('config');
    if(config) {
      event.returnValue = config;
    }else
      event.returnValue = {};
  });
  ipcMain.on('saveConfig', (event, arg) => {
    store.set('config', arg);
    event.returnValue = true;
  });
}
// Create window on electron intialization
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
});
