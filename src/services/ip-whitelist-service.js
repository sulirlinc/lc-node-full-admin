const { ipWhitelistDAO } = require('../dao')
const { errorCodes, CODE_NAMES } = require('../exception')

const ipWhitelistService = (() => {
  return {
    async addIpWhitelist({ id, ip }) {
      if (!(await ipWhitelistDAO.getIpWhitelistById({ id }))) {
        return await ipWhitelistDAO.addIpAndId({ id, ip })
      }
      return await ipWhitelistDAO.addIp({ id, ip })
    },
    async checkIpWhitelist({ id, ip }) {
      if (!id) {
        errorCodes({ codeName: CODE_NAMES.INVALID_DATA, message: 'id is null' })
      }
      const ipWhitelist = (await ipWhitelistDAO.getIpWhitelistById({ id }))
      if (!ipWhitelist || !(ipWhitelist.ip.includes(ip))) {
        errorCodes({ error: `id:${id},ip:${ip}`, moduleName: moduleNames.OTHER, codeName: codeNames.LOW_POWER })
      }
      return await ipWhitelistDAO.checkIp({ id, ip })
    }
  }
})()
module.exports = ipWhitelistService