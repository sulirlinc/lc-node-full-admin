const { operatorDAO } = require("../dao");

module.exports = (() => {
  return {
    /**
     * 查询操作日志
     */
    async get({ data, user }) {
      return await operatorDAO.findOperatorData(data);
    }
  };
})();
