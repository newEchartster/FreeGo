const util = require('./util.js')
/**
 * 通用请求
 * @param obj 请求对象
 * @param access_token token 过期后重新请求的token
 */
function request(path, obj, access_token) {
  const app = getApp()
  if (access_token) {
    app.globalData.access_token = access_token
  }else {
    access_token = app.globalData.access_token
  }
  if(obj.header) {
    obj.header.authorization = 'Bearer ' + access_token
  }else {
    obj.header = {
      authorization:'Bearer ' + access_token
    }
  }

  const domain = app.globalData.serverDomain
  let url = domain + path
  obj.url = url
  if (!obj.fail) {
    obj.fail = function (r) {
      util.error('服务器请求失败：[' + r.data.code + ']:' + r.data.message)
      util.info('请求url：[' + url + ']')
      util.info('请求参数：[' + obj.data + ']')
      console.error('[' + r.data.code + ']:' + r.data.message)
    }
  }

  wx.request(obj);
}

function getOpenid(appid, appsecret, fn) {
  // 调用云函数
  // wx.cloud.callFunction({
  //   name: 'login',
  //   data: {},
  //   success: res => {
  //     me.globalData.openid = res.result.openid
  //     me.globalData.logged = true
  //     if (typeof fn === 'function') {
  //       fn(me.globalData.openid)
  //     }
  //   },
  //   fail: err => {
  //     console.error('[云函数] [login] 调用失败', err)
  //   }
  // })
  // 非云开发
  wx.login({
    //获取code
    success: function (res) {
      const code = res.code //返回code
      wx.request({
        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + appsecret + '&js_code=' + code + '&grant_type=authorization_code',
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          me.globalData.openid = res.data.openid //返回openid
          if (typeof fn === 'function') {
            fn(me.globalData.openid)
          }
        }
      })
    }
  })
}

/**
 * 登录
 * 1，获取openid
 * 2，根据openid向后台请求登录，返回token
 * 3，获取用户信息
 * 4，执行回调函数
 * 
 * @param appid 
 * @param appsecret 
 * @param nickname 微信昵称
 */
function login(nickname, fn) {
  util.info('开始登录...')
  wx.login({
    //获取code
    success: function (res) {
      util.info('微信登录成功...')
      const code = res.code //返回code
      const app = getApp()
      const domain = app.globalData.serverDomain
      let url = domain + 'login?code=' + code
      if (nickname) {
        url += '&nickname=' + nickname
      }
      util.info('开始请求服务器登录...')
      wx.request({
        url: url,
        method: 'post',
        success(res3) {
          util.info('服务器登录成功...')
          app.globalData.access_token = res3.data.data.access_token
          app.globalData.logged = true
          // 获取个人资料
          request('api/user/info', {
            success(re) {
              util.info('获取用户信息成功...')
              let data = re.data.data
              if (!data.birthday) {
                data.birthday = '请选择'
              }
              if (!data.address) {
                data.address = '请选择'
              }
              app.globalData.userInfo = data
              if (typeof fn === 'function') {
                fn(data)
              }
              util.info('已获取到用户信息，app.globalData.userInfo')
            }
          })
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
          util.info('服务器登录失败...')
          util.info('[' + r.data.code + ']:' + r.data.message)
        }
      })
    }
  })
}

module.exports = {
  login: login,
  request: request,
  getOpenId: getOpenid
}