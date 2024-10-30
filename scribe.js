const http = require("node:http");
const fs = require("fs");
const path = require("path");
const winutils = require('node-native-win-utils')
const jimp = require("jimp");

var config = require('./config');
var app_version = 1;

const filename = "log_" + getFilenameTimestamp() + ".txt";
let chatMessageCounter = config.screenshotFrequency;

makeFile();

const server = http.createServer((req, res) => {
    try {
        const message = parseMessage(req);
        if (message) {
            writeFile(message);
        }
    } catch (err) {
        console.error(err);
    }
    res.statusCode = 200;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
        JSON.stringify({
            ManifestFileVersion: "000000000000",
            bIsFileData: false,
            AppID: "000000000000",
            AppNameString: "",
            BuildVersionString: "",
            LaunchExeString: "",
            LaunchCommand: "",
            PrereqIds: [],
            PrereqName: "",
            PrereqPath: "",
            PrereqArgs: "",
            FileManifestList: [],
            ChunkHashList: {},
            ChunkShaList: {},
            DataGroupList: {},
            ChunkFilesizeList: {},
            CustomFields: {},
        })
    );
});

server.listen(config.port, config.hostname, () => {
    console.log(`------------------------------------------------`);
    console.log(`Scribe release ${app_version}`);
    console.log(`Scribe server running at http://${config.hostname}:${config.port}/`);
    console.log(`------------------------------------------------`);
});

function makeFile() {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
        fs.mkdirSync(path.join(__dirname, "logs"));
    }

    const logFilename = path.join(__dirname, "logs", filename, "");

    // If the file already exists, append a newline.
    if (fs.existsSync(logFilename)) {
        fs.writeFileSync(logFilename, `\n\n`, {encoding: "utf8", flag: "a+"});
    }

    fs.writeFileSync(
        logFilename,
        `Starting log at: ${new Date().toLocaleString()}\n`,
        {
            encoding: "utf8",
            flag: "a+",
        }
    );
}

function parseMessage(req) {
    const [urlPath] = req.url.split("?", 1);
    if (urlPath !== "/message") return;

    const query = req.url.slice(urlPath.length + 1);
    const parts = query.split("&");

    let sender = "";
    let message = "";
    for (const currPart of parts) {
        const [paramName] = currPart.split("=", 1);
        const value = currPart.slice(paramName.length + 1);

        switch (paramName) {
            case "message":
                message = decodeURIComponent(value);
                break;
            case "sender":
                sender = decodeURIComponent(value);
        }
    }

    return { sender, message };
}

function writeFile(msg) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const payload = `[${timestamp}] ${msg.sender}: ${msg.message}`;
    console.log(payload)
    fs.appendFileSync(path.join(__dirname, "logs", filename), '\n' + payload, {
        encoding: "utf8",
    });

    chatMessageCounter++;
    if (chatMessageCounter >= config.screenshotFrequency) {
        chatMessageCounter = 0;
        saveScreenshot(now);
    }
}

function saveScreenshot(now) {
    // Save a screenshot
    var screenshotFolder = path.join(__dirname,
        "screenshots",
        computeScreenshotFolderName(now)
    );
    if (!fs.existsSync(screenshotFolder)){
        fs.mkdirSync(screenshotFolder, { recursive: true });
    }
    let screenshotFilename = path.join(screenshotFolder, computeScreenshotFilename(now));
    (async (screenshotFilename) => {
        let screenshotBuffer = winutils.captureWindowN("ConanSandbox ")
        let screenshot = await jimp.Jimp.fromBuffer(screenshotBuffer)
        fs.writeFileSync(screenshotFilename,
            await screenshot.getBuffer('image/jpeg', { quality: config.screenshotQuality })
        );
    })(screenshotFilename);
}

function computeScreenshotFolderName(now) {
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function computeScreenshotFilename(now) {
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");
    return `${hour}-${minute}-${second}.jpg`;
}

function getTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

function getFilenameTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}