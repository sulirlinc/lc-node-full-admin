const { getConfig } = require('../cachings')()
const { Q } = require('../common')
module.exports = (() => {
  return {
    async get({ data }) {
      const key = `ui${ Q.toFirstWordUpperCase(data.key) }`;
      const { code } = data
      return await getConfig({ key, code });
    }
  }
})()