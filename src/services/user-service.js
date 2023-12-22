const { userDAO, permissionDAO } = require("../dao");
const { errorCodes, CODE_NAMES } = require("../exception");
const { JWT, key } = require("../common");
const logger = require("../logger");

module.exports = (() => {
  return {
    /**
     * 用户登录
     */
    async login({ userName, password }) {
      const user = await userDAO.findUser({ userName });
      logger.info({ message: "用户登录", user: userName, saveDB: true })
      if (!user) {
        errorCodes({ codeName: CODE_NAMES.NOT_EXIST_USER });
      }
      const { userId, phone } = user;
      const tokenUser = { userId, userName, phone };
      const value = await userDAO.getUserByUserNameAndPassword({
        userName,
        password
      });
      if (!value) {
        errorCodes({ codeName: CODE_NAMES.ERROR_USER_LOGIN });
      }
      const permissions = (await permissionDAO.getUserPermissions({ userId })).rows
      return {
        userToken: JWT.sign({ ...tokenUser, permissions }, key),
        userName
      };
    },

    /**
     * 用户注册
     */
    async register({ data }) {
      const { userName, password } = data
      if (await userDAO.findUser({ userName })) {
        errorCodes({ codeName: CODE_NAMES.EXIST_USER });
      }
      await userDAO.addUser({ userName, password });
    },

    /**
     * 用户信息
     */
    async get({ data }) {
      return await userDAO.findUserInfo(data);
    },

    async save({ data, user }) {
      const { userName, userId, userType } = data
      data.operateUser = user.userName;
      if (userType !== 1 && data.userId) {
        await permissionDAO.deletePermission({ userId, code: 'user' })
      }
      const rtn = await userDAO.saveUserInfo(data);
      if (data.userType == 1) {
        try {
          const dUserId = (await userDAO.findUser({ userName })).userId;
          await permissionDAO.addPermission({ userId: dUserId, code: 'user', methods: 'post,get,delete' })
        } catch (error) {
        }
      }
      return rtn
    },

    async delete({ data }) {
      return await userDAO.removeUserInfo(data);
    }

  };
})();
