"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const log4js = __importStar(require("log4js"));
// import release configuration
const log4js_configuration_1 = require("./../configs/log4js.configuration");
// import constants
const constants_1 = require("./../common/constants");
const constants = new constants_1.Constants();
if (constants.DEV_MODE == true) {
    // log4js initialize with debug configuration (only console output)
    log4js.configure({
        appenders: {
            console: {
                type: "console"
            },
        },
        categories: {
            default: {
                // console and file
                appenders: ["console"],
                // output level over error
                level: "trace"
            }
        }
    });
}
else {
    // log4js initialize with release configuration
    log4js.configure(log4js_configuration_1.configuration);
}
// export logger
exports.logger = log4js.getLogger();
//# sourceMappingURL=logger.js.map