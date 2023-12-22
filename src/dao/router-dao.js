const tableName = 't_routers'
const { dao }  = require('../common')
module.exports = (() => {
  return {
    async addRouter({ ...data }) {
      const { code } = data
      return await dao.insertData({ tableName, primaryKeys: { code }, data })
    },
    async findAllRouters() {
      return await dao.findByWhere({ tableName,data: { status: 1 }})
    },
    async find({ data }) {
      return await dao.findByPagination({ tableName, data })
    },
  }
})()
