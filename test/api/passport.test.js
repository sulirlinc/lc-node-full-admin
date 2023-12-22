/**
 *  控制层登录。
 */
const app = require('../../src')
const chai = require('chai');
const assert = chai.assert;
const jsrsasign = require('jsrsasign')
const password = jsrsasign.CryptoJS.SHA512('111111').toString()
const userName = 'admin'

describe("登录模块-控制层-单元测试", async () => {
  let request = require('supertest')(await app());
  request.post('/passport/login').set('Content-Type',
      'application/x-www-form-urlencoded; charset=utf-8').query({
    userName,
    password
  })
  .expect(200)
  .end((err, res) => {
    let data = JSON.parse(res.text)
    console.log(JSON.stringify(data))
    assert.equal(data.code, 1)
    assert.equal(data.successful, true)
    done()
  })
})
