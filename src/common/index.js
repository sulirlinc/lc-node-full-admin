const {JWT, JWK} = require("jose");
const key = JWK.generateSync("oct");
const {L} = require('lc-js-common')
const config = require('../config')(process.argv.splice(2)).database.pgConfig
const dao = require('lc-pg-dao')({config})
const common = async () => {

  return {
    dao,
    key,
    JWT: {
      ...JWT,
      sign: (data, key) => {
        return JWT.sign(data, key);
      },
      getUserInfo: ({token}) => {
        let user = JWT.decode(token);
        return user
      }
    },
    Q: {
      now: () => L.now(),
      toReplace: L.toReplace,
      toDBField: L.toDBField,
      toLittleHump: L.toLittleHump,
      trim: L.trim,
      toFirstWordUpperCase: L.toFirstWordUpperCase,
      isNullOrEmpty: L.isNullOrEmpty
    }
  };
}
module.exports = common;
