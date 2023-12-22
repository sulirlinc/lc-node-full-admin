const { key, JWT } = require('../common')
const { errorCodes, CODE_NAMES } = require('../exception')
module.exports = (() => {
  return {
    checkin({ req }) {
      try {
        const token = req.headers.token;
        JWT.verify(token, key, { complete: true })
        const userInfo = JWT.getUserInfo({ token });
        req.getUserInfo = () => userInfo
      } catch (error) {
        errorCodes({ codeName: CODE_NAMES.INVALID_TOKEN, error })
      }
    }
  }
})()