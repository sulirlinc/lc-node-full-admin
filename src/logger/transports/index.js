const winston = require("winston");
require("winston-daily-rotate-file");
const DailyRotateFile = winston.transports.DailyRotateFile;
const PGWinstonTransport = require('lc-pg-winston-transport');
const { LEVEL } = require('triple-beam');

const config = require("../../config")(process.argv.splice(2));
const fileTransport = new DailyRotateFile({
  filename: `${ config.logger.path }/logs/application-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "10m",
  maxFiles: "90d"
});

DailyRotateFile.prototype.log = function (info, callback) {
  const { saveFile } = info;
  callback = callback || (()=>{})
  if (saveFile || 'error' === info[LEVEL]) {
    delete info['saveFile']
    this.logStream.write(`[${ info.timestamp }] ${ info.level }: ${ info.message }` + this.options.eol);
  }
  this.emit('logged', info);
  callback(null, true);
};

const postgresTransport = new PGWinstonTransport({
  pgConfig: config.database.pgConfig,
  addFields: [ {
    name: 'user',
    type: 'varchar(255)'
  }, {
    name: 'loggerType',
    type: 'varchar(255)'
  }, {
    name: 'stack',
    type: 'text'
  }
  ], defaultSaveDB: false, saveByDayNewTable: true
});
module.exports = [ fileTransport, postgresTransport ]