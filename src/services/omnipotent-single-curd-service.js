const { dao }  = require('../common')
const { Q } = require("../common");
const cachings = (require('../cachings'))()
const { getConfig } = cachings
const buildPrimaryKey = ({ mappingData, data }) => {
  const primaryKeys = {};
  (mappingData.primaryKey || mappingData.uniqueKeys || "id").split(",").map(value => {
    primaryKeys[value] = data[value]
    delete data[value]
  });
}

function buildOperatorData(mappingData, values, user) {
  if (mappingData.hasOperatorId) {
    values.operatorId = user.userId
  }
  return values
}

module.exports = (() => {
  return {
    async get({ data, user, code }) {
      const mappingData = (await getConfig({ key: cachings.CURD_MAPPING, code }))[0]
      const where = {};
      (await getConfig({ key: cachings.UI_SEARCH, code })).map(value => {
        if (!Q.isNullOrEmpty(data[value.key])) {
          where[value.key] = data[value.key]
        }
      })
      const { limit, offset } = data
      return await dao.findByPagination({ tableName: mappingData.tableName, data: { limit, offset, ...where } })
    },

    async update({ data, user, code }) {
      const mappingData = (await getConfig({ key: cachings.CURD_MAPPING, code }))[0]
      const { tableName } = mappingData
      return await dao.update({
        tableName: tableName,
        primaryKeys: buildPrimaryKey({ mappingData, data }), data: buildOperatorData(mappingData, { ...data, operatorId: user.userId, updateAt: Q.now() }, user)
      })
    },

    async delete({ data, user, code }) {
      const { captcha, ...primaryKeys } = data
      const mappingData = (await getConfig({ key: cachings.CURD_MAPPING, code }))[0]
      const { tableName } = mappingData
      return await dao.deleteData({ tableName, primaryKeys: buildPrimaryKey({ mappingData, primaryKeys }) })
    },

    async add({ data, user, code }) {
      const mappingData = (await getConfig({ key: cachings.CURD_MAPPING, code }))[0]
      const { tableName } = mappingData
      return await dao.insertData({
        tableName,
        primaryKeys: buildPrimaryKey({ mappingData, data: { ...data } }), data: buildOperatorData(mappingData, { ...data, createAt: Q.now() }, user)
      })
    },

    async create({ data, user }) {
      const { captcha, ...createData } = data
      return await dao.createTable(createData)
    },

    async findByWhere({ data, user, code }) {
      const { tableName } = (await getConfig({ key: cachings.CURD_MAPPING, code }))[0]
      return await dao.findByWhere({ tableName, data })
    },
  };
})();
