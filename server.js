const PORT = 4300;
var QRCode = require("qrcode");

var fs = require("fs");
var express = require("express");
var cors = require("cors");
var api = express();


var key = fs.readFileSync("./certs/server-key.pem");
var cert = fs.readFileSync("./certs/server-cert.pem");

const url_update_app_content = 'http://localhost:4000/resource/dlc/catching.dlc'

var server = require("https").createServer(
    {
        key: key,
        cert: cert
    },
    api
);

var http = require('http').createServer(api)
http.listen(4000)

// api.use(cors())
api.use(express.static('public'))

api.get("/api/v1/health", (req, res) => {
    res.sendStatus(200)
});

api.get("/api/v1/update", (req, res) => {
    res.json({
        code: 0,
        message: "success",
        data: {
            game_build: "1",
            game_version: "0.5",
            api_version: "1.0",
            url_update: url_update_app_content,
            force_update: false
        }
    });
});
server.listen(PORT);

var io = require("socket.io")(server);
var ipInfo = server.address();
var ip = ipInfo.address;
console.log(`Services start on ${PORT}`);

var devices = [];
var deviceCodes = [];

const APP_Port = 3000;
// const URL_APP = `http://192.168.100.11:${APP_Port}`
const URL_APP = `https://lee-mgame.stackblitz.io`;

io.on("connection", socket => {
    console.log(">> Connected", socket.id);

    socket.on("register", (data, cb) => {
        let qrcode = socket.id + "game@2019";
        qrcode = "test";

        deviceCodes[qrcode] = socket.id;

        let url_scan = URL_APP.concat(`?code=${qrcode}`);
        QRCode.toDataURL(url_scan, (error, url) => {
            if (error) {
                console.log(">> qrcode.error", error);
                cb({
                    message: "Can not generate qrcode at time. Try again",
                    status: false
                });
            }

            cb({ data: url, status: true, message: "success" });
            console.log(">> Register.screen", socket.id);
        });
    });

    socket.on("pair", (data, cb) => {
        for (var i in deviceCodes) {
            if (i === data.code) {
                devices[socket.id] = deviceCodes[i];

                io.to(deviceCodes[i]).emit("pair", {
                    authen: true,
                    device: data.ua,
                    deviceID: socket.id
                });
                console.log(">> Paired, reply request from", deviceCodes[i]);
                delete deviceCodes[i];
                cb({ authen: true });
                break;
            }
        }

        cb({ authen: false, msg: "Wrong authen, not found device pair" });
    });

    socket.on("sensor", msg => {
        let screenID = devices[socket.id];
        io.to(screenID).emit("sensor", msg);
    });

    socket.on("sync-score", (data, cb) => {
        console.log('>> sync score')
        if (typeof (data) !== 'function') {
            let pairID = data.pairID;
            io.to(pairID).emit("sync-score", { score: data.score })
            cb({ error: 0, msg: 'success', data: null })
        }
    });

    socket.on("disconnect", msg => {
        io.emit(devices[socket.id]).to("lost-connect");
        delete devices[socket.id];
        console.log(">> Disconnected", socket.id);
    });

    socket.on("gameover", msg => {
        socket.disconnect(true);
        console.log(">> Gameover");
    });
});
