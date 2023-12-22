const errorCodes = require('./error-codes')
const logger = require('../logger')

module.exports = (() => {
  process.on('unhandledRejection', p => {
    throw p
  })
  process.on('rejectionHandled', p => {
    logger.error(p)
  })
  process.on('uncaughtException', err => {
    if (logger && logger.error) {
      logger.error(err)
    }
  })
  const { CODE_NAMES, codeMappingModule } = errorCodes
  return {
    CODE_NAMES,
    errorCodes: ({ codeName, message, error, isThrow = true }) => {
      const { name } = codeMappingModule[codeName]
      throw { errorCode: errorCodes[name][codeName], message, error, isThrow }
    }
  }
})()
