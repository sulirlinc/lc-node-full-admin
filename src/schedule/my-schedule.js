const LCSchedule = require('lc-schedule-by-pg')
const config = require("../config")(process.argv.splice(2));
LCSchedule.prototype.trigger = ({ event, method }) => {
  const fun = require(`../${ event }`);
  if (fun instanceof Function) {
    fun()[method]()
  } else if (fun[method] instanceof Function) {
    fun[method]()
  }
}
const lcSchedule = new LCSchedule({
  pgConfig: config.database.pgConfig,
  logger: require('../logger')
});
module.exports = lcSchedule