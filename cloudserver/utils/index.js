"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validToken = exports.COOKIE_SECRET = exports.AT_KEY = void 0;
exports.AT_KEY = 'at';
exports.COOKIE_SECRET = 'secret';
function validToken(tk) {
    return tk === 'verysecuretokenhehehehehehehehe';
}
exports.validToken = validToken;
