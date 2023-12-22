const { showcaseDAO } = require("../dao");

const save = async ({ data, user }) => {
  data.operatorId = user.user_id
  return await showcaseDAO.save(data)
}

module.exports = (() => {
  return {

    async get({ data }) {
      return await showcaseDAO.find(data)
    },

    async add({ data, user }) {
      return save({ data, user })
    },

    async update({ data, user }) {
      return save({ data, user })
    },
    
    async remove({ data }) {
      return await showcaseDAO.remove(data)
    }
  };
})();
