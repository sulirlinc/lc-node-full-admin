const winston = require("winston");
const timezoned = () => new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

const logger = winston.createLogger({
  transports: require("./transports"),
  format: winston.format.combine(
      winston.format.simple(),
      winston.format.timestamp({ format: timezoned }),
      winston.format.printf(
          info => `[${ info.timestamp }] ${ info.level }: ${ info.message }`
      )
  ),
  exitOnError: false
});

logger.stream = {
  write(message) {
    logger.info(message);
  }
};

module.exports = (() => {
  logger.myOverviewError = logger.error;
  logger.error = e => {
    if (e) {
      if (e.stack) {
        logger.myOverviewError(e.stack, e);
      } else if (e.message) {
        logger.myOverviewError(e.message, e);
      } else {
        logger.myOverviewError(e);
      }
    }
  };
  return logger;
})();
