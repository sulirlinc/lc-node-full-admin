module.exports = (() => {
  return {
    userDAO: require("./user-dao"),
    operatorDAO: require("./operator-dao"),
    showcaseDAO: require("./showcase-dao"),
    permissionDAO: require("./permission-dao"),
    ipWhitelistDAO: require("./ip-whitelist-dao"),
    routerDAO: require("./router-dao")
  }
})();
