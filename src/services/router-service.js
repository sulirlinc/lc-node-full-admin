const { routerDAO } = require("../dao");
const { Q } = require("../common");
module.exports = (() => {
  return {

    /**
     * 获取不分页的全部数居
     * @returns {Promise<*>}
     */
    async getAllRouters() {
      return await routerDAO.findAllRouters()
    },

    async add({ data, user }) {
      return await routerDAO.addRouter({ ...data, operatorId: user.userId, createAt: Q.now() })
    },

    async get({ data }) {
      delete data.page
      return routerDAO.find({ data })
    },

    async update({ data, user }) {
      return routerDAO.find({ data })
    }

  };
})();
