const express = require("express");
const router = express.Router();
const base = require(".");
const mappings = {
  post: 'add', put: 'update'
}
module.exports = (data) => {
  const { doAction, methods, uri, code, autoPassPermission } = data
  for (const key in methods) {
    if (methods.hasOwnProperty(key)) {
      router.route(uri)[key](base({
        callback: async req => {
          const serviceFunctionName = methods[key].serviceFunctionName || mappings[key] || key;
          const fun = doAction[serviceFunctionName];
          if (doAction && fun) {
            return await doAction[serviceFunctionName]({
              req,
              data: req.query,
              user: req.getUserInfo ? req.getUserInfo() : null,
              key,
              code
            });
          }
        }, autoPassPermission, ...methods[key], code, key
      }))
    }
  }
  return router;
}