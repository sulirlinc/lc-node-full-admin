const { userService, routerService } = require("../services");
const logger = require("../logger");
const base = require(".");
const apps = [
  {
    code: "login",
    display: "用户登录",
    uri: "/passport/login",
    router: {
      manual: true,
      autoPassPermission: true,
      methods: {
        post: {
          verifications: {
            rules: [{
              name: "userName",
              display: "用户名",
              regex: "^[a-z A-Z]+([0-9]+|[a-z A-Z]+){3,15}$",
              message: "必须英文字母开头3到15个字符或者数字类型。",
              required: true
            }]
          },
          callback: async req => await userService.login(req.query)
        }
      }
    }
  }
]
const builder = require("./builder");
module.exports = async (app) => {
  const controllers = apps.concat(await routerService.getAllRouters())
  const routers = []
  logger.info(`=================路由加载====================`)
  let i = 1
  controllers.map(({router, code, display, uri}) => {
    logger.info(`${i++}：显示名称:${display},code:${code},路径:${uri}`)
    app.use("", builder({
      ...router, code, display, uri,
      doAction: (!router.manual ? (require(
          router.serviceActionPath || `../services/${code}-service`)) : null)
    }))
    const { methods } = router
    const methodList = []
    for (const key in methods) {
      methodList.push(key)
    }
    routers.push({
      code, display, uri, methods: methodList
    })
  })
  logger.info(`=================路由加载完成====================`)
  const router = require("express").Router();
  router.route("/routers").get(base({
    checkToken: true,
    callback: async req => {
      return routers;
    }
  }))
  app.use("", router);
}