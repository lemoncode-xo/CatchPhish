// electronApp -> Module to control application life.
// electronIpcMain -> Main Iterprocess controller
// electronBrowserWindow -> Module to create native browser window
const electronApp = require('electron').app;
const electronBrowserWindow = require('electron').BrowserWindow;
const electronIpcMain = require('electron').ipcMain;

// Import required Node modules
require('dotenv').config(); // Load API key from .env
const path = require('path');

// Prevent garbage collection
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let urlArg;

function createWindow () {
  //Create the browser window
  mainWindow = new electronBrowserWindow({
    width: 900,
    height: 650,
    minWidth: 850,
    minHeight: 600,
    backgroundColor: '#312450',
    icon: path.join(__dirname, "build/icon.png"),
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2e2e2e', //color: 'rgb(46,46,46)', | color: '#2f3241',
      symbolColor: '#74b1be',
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // allows electron main <--> render communication via api
      sandbox: true,
      nativeWindowOpen: true,
    }
  });

  // and load the index.html of the app.
  urlArg = electronApp.commandLine.getSwitchValue("url");
  mainWindow.loadURL(path.join(__dirname, "./app/app.html?url="+urlArg));
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electronApp.on('ready', createWindow)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here


// -----------------------------------------------------------------------
// Catch-Phish main <-> render functions to recieve and process user input
// -----------------------------------------------------------------------

// get URI inputed by user from render process
electronIpcMain.on('parse-input', async (event, uriInput) => {
  try {
    // IPQuality Score API to check webpage
    const ipqsResponse = await fetch(`https://ipqualityscore.com/api/json/url/${process.env.IPQS_API_KEY}/${encodeURIComponent(uriInput)}`);
    // Check if the response status is not OK (e.g., 404, 500)
    if (!ipqsResponse.ok) {
      throw new Error(`HTTP error! Status: ${ipqsResponse.status}`);
    }
    const ipqsResponseJSON = await ipqsResponse.json(); // Parse JSON if successful
    event.sender.send('parse-response', ipqsResponseJSON);
    // mainWindow.webContents.send('parse-response', ipqsResponseJSON);
  } catch (error) {
    console.error('Fetch error:', error.message);
    event.sender.send('parse-response', { error: "Fetch error: No data to sent due to fetch error." });
  }

  // // IPQuality Score API to check webpage
  // fetchData(`https://ipqualityscore.com/api/json/url/${process.env.IPQS_API_KEY}/${encodeURIComponent(uriInput)}`)
  // .then((ipqsResponse) => {
  //   // console.log(ipqsResponse); // Log fetch response
  //   if (ipqsResponse){
  //     // send JSON response to ui from main to render process
  //     mainWindow.webContents.send('parse-response', ipqsResponse);
  //   } else {
  //     mainWindow.webContents.send(
  //       'parse-response', new Error ("No data to send due to fetch error."));
  //     console.log("No data to send due to fetch error.");
  //   }
  // })
})

// reusable function to make async API requests (abandoned)
// async function fetchData(url) {
//   try {
//     const response = await fetch(url);
    
//     // Check if the response status is not OK (e.g., 404, 500)
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json(); // Parse JSON if successful
    
//     return data;
//   } catch (error) {
//     console.error('Fetch error:', error.message);
//     return null;
//   }
// }