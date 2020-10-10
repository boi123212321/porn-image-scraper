"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
exports.default = yargs.options({
    dry: {
        alias: "d",
        type: "boolean",
        default: false,
        description: "Run without download images",
    },
    folder: {
        type: "string",
        default: "images",
        description: "Base folder to store images in",
    },
}).argv;
