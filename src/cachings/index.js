const { dao } = require('../common')
const { CODE_NAMES } = require('../exception')
const logger = require('../logger')
const { mySchedule } = require("../schedule")
/**
 * 目前把数据映射到内存, 将来应该把数据缓存到redis.
 */
const doMapping = async ({ jsonObject, code, tableName, allowNull }) => {
  jsonObject[code] = jsonObject[code] || await (async () => jsonObject[code] = await dao.findByCode({
        tableName,
        data: { code },
        codeName: !allowNull ? CODE_NAMES.CANNOT_GET_CONFIGURED : null
      }))()
  return jsonObject[code] || []
}
const configs = {
  curdMapping: {
    jsonObject: {},
    tableName: 't_s_mapping_curd_data'
  },
  uiSearch: {
    allowNull: true,
    jsonObject: {},
    tableName: 't_u_search'
  },
  uiSearchButton: {
    allowNull: true,
    jsonObject: {},
    tableName: 't_u_search_button'
  },
  uiForm: {
    allowNull: true,
    jsonObject: {},
    tableName: 't_u_form'
  },
  uiColumn: {
    allowNull: true,
    jsonObject: {},
    tableName: 't_u_column'
  },
  sConstants: {
    allowNull: true,
    jsonObject: {},
    tableName: 't_s_constants'
  },
}
const getConfig = ({ key }) => {
  return configs[key]
}
const interval = 1;

mySchedule.addSchedule({ persistence: true, event: "cachings", method: "remove", timeUnit: "minutes", interval }).then(
    ({ triggerId }) => console.log(`启动内存定时每${ interval }分钟清理机制，triggerId:${ triggerId }。`)).catch(e => logger.error(e))
module.exports = (() => {
  return {
    remove: () => {
      logger.info({ saveFile: true, message: `清空内存数据.`, loggerType: "system" })
      for (const key in configs) {
        configs[key].jsonObject = {}
      }
      return true
    },
    CURD_MAPPING: 'curdMapping',
    UI_SEARCH: 'uiSearch',
    UI_SEARCH_BUTTON: 'uiSearchButton',
    UI_FORM: 'uiForm',
    UI_COLUMN: 'uiColumn',
    getConfig: async ({ key, code }) => await doMapping({ ...getConfig({ key }), code })
  }
})