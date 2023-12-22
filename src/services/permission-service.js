const { permissionDAO } = require("../dao");
const { Q } = require("../common");
module.exports = (() => {
  return {

    async add({ data, user }) {
      return await routerDAO.addRouter({ ...data, operatorId: user.userId, createAt: Q.now() })
    },

    async get({ data }) {
      delete data.page
      return permissionDAO.find({ data })
    },

    async update({ data, user }) {
      return routerDAO.find({ data })
    }

  };
})();
