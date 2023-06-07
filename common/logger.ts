import * as log4js from "log4js";
import { configuration } from "./../configs/log4js.configuration";

// log4js initialize
log4js.configure(configuration);

// export logger
export const logger = log4js.getLogger();