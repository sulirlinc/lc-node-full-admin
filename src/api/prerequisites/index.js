const { errorCodes, CODE_NAMES } = require("../../exception");
const logger = require('../../logger')
const { passportService, ipWhitelistService } = require("../../services")
const events = {
  async verifications({ prerequisite, req }) {
    const data = req[prerequisite.paramKey || 'query']
    let errorMessages = ""
    for (const rule of prerequisite.rules) {
      const param = data[rule.name]
      if (rule.required && (!param || param === "")) {
        errorMessages += ";" + rule.display + ":不允许为空"
      } else if (rule.regex && !new RegExp(rule.regex).test(param)) {
        errorMessages += ";" + rule.display + ":" + (rule.message || "参数无效")
      }
    }
    if (errorMessages.length > 1) {
      const message = errorMessages.substr(1)
      logger.debug("参数异常:" + message + "。");
      errorCodes({ codeName: CODE_NAMES.PARAM_ERROR, message, isThrow: false })
    }
  },
  async checkIpWhitelist({ prerequisite, req }) {
    const { key, paramKey = 'query' } = prerequisite
    const id = req.getUserInfo().userId
    await ipWhitelistService.checkIpWhitelist({
      id, ip: req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress
    })
  }
}
const checkPassPermission = ({ req, code, key, autoPassPermission }) => {
  if (!autoPassPermission) {
    passportService.checkin({ req })
    try {
      const permission = req.getUserInfo().permissions.find(value => value.code === code);
      if (!permission || !permission.methods.split(',').find(value => value === key)) {
        throw "无权限";
      }
    } catch (e) {
      errorCodes({ codeName: CODE_NAMES.LOW_POWER });
    }
  }
}
module.exports = async ({ code, key, autoPassPermission, ...prerequisites }, { req, res, next }) => {
  checkPassPermission({ code, key, autoPassPermission, req })
  for (const key in prerequisites) {
    const event = events[key]
    await (event ? event({ prerequisite: prerequisites[key], req, res, next }) : null)
  }
}