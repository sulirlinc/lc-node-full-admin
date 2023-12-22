const CODE_NAMES = {
  INVALID_TOKEN: 'invalid.token',
  ERROR_USER_LOGIN: 'error.login',
  DATABASE_CONNECT_ERROR: 'database.connect.error',
  EXECUTE_SQL_ERROR: 'execute.sql.error',
  PARAM_ERROR: "param.error",
  EXIST_USER: 'exist.user',
  NOT_EXIST_USER: 'not.exist.user',
  LOW_POWER: 'low.power',
  INVALID_DATA: 'invalid.data',
  DATA_IS_EXISTS: 'data.is.exists',
  DATA_NOT_FOUND: 'data.not.found',
  CANNOT_GET_CONFIGURED: 'cannot.get.configured',
  NOT_FOUND_PRIMARY_KEYS: 'not.found.primary.keys',
  CREATE_TABLE_INVALID_CONFIGURATION: 'create.table.invalid.configuration'
}
const MODULE_NAMES = {
  BASE: 'base',
  OTHER: 'other',
  MONITOR: 'monitor',
  OS: 'os',
  USER: 'user',
  DB: 'db',
  SYSTEM_CONFIG: 'system.config'
}
const modules = [
  {
    name: MODULE_NAMES.BASE,
    code: 20000,
    content: [
      { key: CODE_NAMES.INVALID_TOKEN, message: 'Token无效或者已过期。' },
      { key: CODE_NAMES.PARAM_ERROR, message: '参数异常' }
    ]
  },
  {
    name: MODULE_NAMES.MONITOR,
    code: 30000,
    content: []
  },
  {
    name: MODULE_NAMES.OS,
    code: 40000,
    content: []
  },
  {
    name: MODULE_NAMES.USER,
    code: 50000,
    content: [
      { key: CODE_NAMES.ERROR_USER_LOGIN, message: '用户名或密码错误' },
      { key: CODE_NAMES.EXIST_USER, message: '用户名已存在' },
      { key: CODE_NAMES.NOT_EXIST_USER, message: '用户不存在' }      
    ]
  },
  {
    name: MODULE_NAMES.DB,
    code: 60000,
    content: [
      { key: CODE_NAMES.DATABASE_CONNECT_ERROR, message: '数据库连接失败。' },
      { key: CODE_NAMES.EXECUTE_SQL_ERROR, message: '执行sql语句异常。' },
      { key: CODE_NAMES.DATA_IS_EXISTS, message: '当前主键数据已存在。' },
      { key: CODE_NAMES.DATA_NOT_FOUND, message: '数据未找到。' },
      { key: CODE_NAMES.NOT_FOUND_PRIMARY_KEYS, message: '未找到主键配置。' },
      { key: CODE_NAMES.CREATE_TABLE_INVALID_CONFIGURATION, message: '无效的创建表配置。' }

    ]
  },
  {
    name: MODULE_NAMES.OTHER,
    code: 70000,
    content: [
      { key: CODE_NAMES.LOW_POWER, message: '无权限访问。' },
      { key: CODE_NAMES.INVALID_DATA, message: '无效的参数' },
    ]
  },
  {
    name: MODULE_NAMES.SYSTEM_CONFIG,
    code: 80000,
    content: [
      { key: CODE_NAMES.CANNOT_GET_CONFIGURED, message: '未获取到配置信息。' }
    ]
  }
]

module.exports = (() => {
  const codes = {}
  const codeMappingModule = {};
  for (const iterator of modules) {
    codes[iterator.name] = codes[iterator.name] || {}
    if (iterator.content) {
      iterator.content.forEach(element => {
        element.code = ++iterator.code
        const { name } = iterator
        const { key } = element
        codes[name][key] = { ...element }
        codeMappingModule[key] = { name, key }
      })
    }
  }
  return {
    ...codes,
    codeMappingModule,
    CODE_NAMES,
    MODULE_NAMES
  }
})()