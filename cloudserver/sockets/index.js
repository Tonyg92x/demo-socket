"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ws_1 = require("ws");
const utils_1 = require("../utils");
const HEARTBEAT_INTERVAL = 1000 * 5; // 5 seconds
const HEARTBEAT_VALUE = 1;
function onSocketPreError(e) {
    console.log(e);
}
function onSocketPostError(e) {
    console.log(e);
}
function ping(ws) {
    ws.send(HEARTBEAT_VALUE, { binary: true });
}
function configure(s) {
    const wss = new ws_1.WebSocketServer({ noServer: true });
    s.on('upgrade', (req, socket, head) => {
        socket.on('error', onSocketPreError);
        // perform auth
        (0, cookie_parser_1.default)(utils_1.COOKIE_SECRET)(req, {}, () => {
            const signedCookies = req.signedCookies;
            let at = signedCookies[utils_1.AT_KEY];
            if (!at && !!req.url) {
                const url = new URL(req.url, `ws://${req.headers.host}`);
                at = url.searchParams.get('at');
            }
            if (!(0, utils_1.validToken)(at)) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }
            wss.handleUpgrade(req, socket, head, (ws) => {
                socket.removeListener('error', onSocketPreError);
                wss.emit('connection', ws, req);
            });
        });
    });
    wss.on('connection', (ws, req) => {
        ws.isAlive = true;
        ws.on('error', onSocketPostError);
        ws.on('message', (msg, isBinary) => {
            if (isBinary && msg[0] === HEARTBEAT_VALUE) {
                // console.log('pong');
                ws.isAlive = true;
            }
            else {
                ws.send('Message envoyé au sender uniquement: ' + msg, { binary: isBinary });
                wss.clients.forEach((client) => {
                    if (client.readyState === ws_1.WebSocket.OPEN) {
                        client.send(msg, { binary: isBinary });
                    }
                });
            }
        });
        ws.on('close', () => {
            console.log('Connection closed');
        });
    });
    const interval = setInterval(() => {
        // console.log('firing interval');
        wss.clients.forEach((client) => {
            if (!client.isAlive) {
                client.terminate();
                return;
            }
            client.isAlive = false;
            ping(client);
        });
    }, HEARTBEAT_INTERVAL);
    wss.on('close', () => {
        clearInterval(interval);
    });
}
exports.default = configure;
