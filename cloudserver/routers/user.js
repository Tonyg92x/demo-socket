"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("../utils");
function users() {
    const router = (0, express_1.Router)();
    router
        .get('/', (req, res, next) => {
        res.json({
            id: 1,
            firstname: 'Matt',
            lastname: 'Morgan',
        });
    })
        .get('/login', (req, res, next) => {
        // check creds
        // encode token
        const tk = 'test';
        res.cookie(utils_1.AT_KEY, tk, {
            httpOnly: true,
            signed: true,
        });
        res.status(200).send(tk);
    })
        .get('/logout', (req, res, next) => {
        res.clearCookie(utils_1.AT_KEY);
        res.status(200).send();
    });
    return router;
}
exports.default = users;
