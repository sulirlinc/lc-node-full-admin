const err = { code: '10000', message: '未知的错误，请联系管理员！' }
const logger = require('../logger')
const doPrerequisites = require('./prerequisites')
module.exports = ({ callback, ...prerequisites }) => {
  return async (req, res, next) => {
    try {
      await (doPrerequisites(prerequisites, { req, res, next }))
      res.json({
        data: await callback(req, res),
        dateTime: +new Date(),
        code: 1,
        successful: true
      })
    } catch (e) {
      const { errorCode, error, isThrow } = e
      if (!errorCode) {
        logger.error(e)
      }
      res.status(400).json({
        code: errorCode ? errorCode.code : err.code,
        dateTime: +new Date(),
        message: e.message || (errorCode ? errorCode.message : err.message),
        successful: false
      })
      if (isThrow) {
        throw error || errorCode
      }
    }
  }
}