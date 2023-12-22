const logger = require("../logger");
const { dao }  = require('../common')

const tableName = 't_user_permission'
module.exports = (() => {
  return {
    async addPermission({ userId, code, methods }) {
      return await dao.insertData({ tableName, primaryKeys: { userId, code },
         data: { userId, code, methods }})
    },

    async get({ user, data }) {
      return await dao.findByPagination({ tableName, data })
    },

    async getUserPermissions({ userId }) {
      const client = await dao.client();
      const rows = (
        await client.query({
          sql: "select * from t_user_permission where user_id=$1",
          queryConfig: [userId]
        })
      ).rows;
      return { rows }
    },

    async deletePermission({ userId, code }) {
      const client = await dao.client();
      await client.query({
        sql: "delete from t_user_permission where user_id=$1 and code=$2", queryConfig: [userId, code]
      });
    }
  }
})()