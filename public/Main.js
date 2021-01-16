const {  app, BrowserWindow } = require('electron');
const path = require('path');

const createWindow = () => {   
    // Create the browser window.     
    win = new BrowserWindow({width: 1200, height: 800});
       
    // and load the index.html of the app.     
    // win.loadFile('index.html');

    // load the url
    // win.loadURL("http:/localhost:3000/");
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    win.setMenu(null);
    // win.webContents.openDevTools()
}      

app.on('ready', createWindow);