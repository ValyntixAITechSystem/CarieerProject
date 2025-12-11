import winston from "winston";
import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";
import config from "../config/env.config.js";

const { combine, timestamp, printf } = winston.format;

const transports = [];

const logDir = path.join(process.cwd(), "logs");
if (config.NODE_ENV === "production" && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const cutomFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp, level, message, label, ...meta }) => {
    const labelStr = label ? `${label}` : "";

    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";

    switch (level) {
      case "info":
        return `🟢 ${chalk.gray(timestamp)} [${chalk.green(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.green(
          labelStr
        )}]: ${chalk.greenBright(message)} ${chalk.greenBright(metaStr)}`;
      case "error":
        return `🔴 ${chalk.gray(timestamp)} [${chalk.red(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.red(
          labelStr
        )}]: ${chalk.redBright(message)} ${chalk.redBright(metaStr)}`;
      case "warn":
        return `🟡 ${chalk.gray(timestamp)} [${chalk.yellow(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.yellow(
          labelStr
        )}]: ${chalk.yellowBright(message)} ${chalk.yellowBright(metaStr)}`;
      default:
        return `${chalk.gray(timestamp)} [${chalk.green(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.green(
          labelStr
        )}]: ${chalk.greenBright(message)} ${chalk.greenBright(metaStr)}`;
    }
  })
);

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  transports.push(
    new winston.transports.Console({
      format: cutomFormat,
      level: config.LOG_LEVEL || "info",
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: config.LOG_LEVEL || "info",
    })
  );

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    })
  );

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    })
  );
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: cutomFormat,
  transports,
  silent: config.NODE_ENV === "test",
});

export default logger;
