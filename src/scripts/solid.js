const file = require('solid-file-client');
const auth = require('solid-auth-client');

async function login(credentials) {
    var result;
    if (credentials == null) {
        result = await file.popupLogin().then(webId => {
            return true;
        }, err => {
            return false;
        });
    } else {
        result = await file.login(credentials).then((session) => {
            return true;
        }, err => {
            return false;
        });
    }
    return result;
}

async function loginNoPopup(idProvider) {
    await auth.login(idProvider);
}

async function getSession() {
    return await auth.currentSession();
}

async function logout() {
    return await file.logout().then(success => {
        return true;
    }, err => {
        return false;
    });
}

async function createFolder(url) {
    return await file.createFolder(url).then(success => {
        return true;
    }, err => {
        return false;
    });
}

async function readFolder(url) {
    return await file.readFolder(url).then(folder => {
        return folder;
    }, err => {
        return null;
    });
}

async function deleteFolder(url) {
    return await file.deleteFolder(url).then(success => {
        return true;
    }, err => {
        return false;
    });
}

async function writeFile(url, content) {
    return await file.createFile(url, content).then(fileCreated => {
        return true;
    }, err => {
        return false;
    });
}

async function writeJson(url, content) {
    return await file.createFile(url, content, "text/json").then(fileCreated => {
        return true;
    }, err => {
        return false;
    });
}

async function readFile(url) {
    return await file.readFile(url).then(body => {
        return body;
    }, err => {
        return null;
    });
}

async function deleteFile(url) {
    return await file.deleteFile(url).then(success => {
        return true;
    }, err => {
        return false;
    });
}

module.exports = {
    login: login,
    logout: logout,
    loginNoPopup: loginNoPopup,
    getSession: getSession,
    createFolder: createFolder,
    readFolder: readFolder,
    deleteFolder: deleteFolder,
    createFile: writeFile,
    readFile: readFile,
    deleteFile: deleteFile,
    writeJson: writeJson
}
