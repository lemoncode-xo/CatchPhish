// Import the necessary Electron modules
const {contextBridge, ipcRenderer} = require('electron');

// Exposed protected methods in the render process
contextBridge.exposeInMainWorld('ipcRenderer', { 
    // Allowed 'ipcRenderer' methods
    
    // From render to main (aka from electron ui to backend)
    parseInput: (uriInput) => {ipcRenderer.send('parse-input', uriInput);},

    // From main to render (aka from electron backend to ui)
    // parseResponse: (listener) => {
    //     ipcRenderer.on('parse-response', listener);
    // },
    parseResponse: () => new Promise((resolve, reject) => {
        ipcRenderer.once('parse-response', (event, data) => {
            if (data.error) reject(data.error);
            else resolve(data);
        });
    })
});
