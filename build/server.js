"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conn_1 = __importDefault(require("./config/conn"));
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});
(0, conn_1.default)()
    .then(() => {
    try {
        app.listen(port, () => console.log(`Server listening & database connected on ${port}`));
    }
    catch (e) {
        console.log('Cannot connect to the server');
    }
})
    .catch((e) => {
    console.log('Invalid database connection...! ', +e);
});
