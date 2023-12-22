const express = require("express");
const app = express();
// const easyMonitor = require('easy-monitor');
// easyMonitor('my-app');
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Token"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});
module.exports = async () => {
  await require("./api/routers")(app)
  return app;
}
