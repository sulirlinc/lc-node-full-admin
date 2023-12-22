const express = require("express");
const logger = require("./logger");
const path = process.argv.splice(2);
const config = require("./config");
const port = config(path).server.port || 8080;
const ip = config(path).server.ip || "127.0.0.1";
(async () => {
  const app = await require("../src")();
  app.use(express.static("build"));
  app.listen(port, ip, () => logger.info({ message: `server is start:${ ip }:${ port }`, saveDB: true, saveFile: true }));
})()