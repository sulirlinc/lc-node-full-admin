const userService = require("./user-service");
const operatorService = require("./operator-service");

module.exports = {
  userService, operatorService,
  showcaseService: require("./showcase-service"),
  routerService: require("./router-service"),
  passportService: require("./passport-services"),
  omnipotentSingleCURDService: require("./omnipotent-single-curd-service")
};
