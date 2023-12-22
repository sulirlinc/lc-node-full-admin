const { dao }  = require('../common')
const tableName = 't_ip_whitelist'
module.exports = (() => {
  return {
    async getIpWhitelistById({ id }) {
      return await dao.findByCode({ tableName, data: { id }})
    },
    async addIpAndId({ id, ip }) {
      return await dao.insertData(
          { tableName, primaryKeys: { id }, data: { id, ip }})
    },

    async addIp({ id, ip }) {
      return await dao.client.query({ sql: `update ${tableName} set ip=ip+$1 where id=$2`, queryConfig: [ip, id] })
    }
  }
})()
