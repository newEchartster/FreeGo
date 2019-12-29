/**
 * 通用请求
 * @param obj 请求对象
 * @param access_token token 过期后重新请求的token
 */
function request(obj, path, access_token) {
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

  wx.request(obj);
}
/**
 * 登录
 * @param openid 用户小程序唯一id
 * @param nickname 微信昵称
 */
function login(openid, nickname) {
  console.log(openid)
  const app = getApp()
  const domain = app.globalData.serverDomain
  let url = domain + 'login?openId=' + openid
  if (nickname) {
    url += nickname
  }
  wx.request({
    url: url,
    method: 'post',
    success(res) {
      app.globalData.access_token = res.data.data.access_token
      app.globalData.logged = true
      // 获取个人资料
      request({
        method: 'get',
        success(re) {
          let data = re.data.data
          if (!data.birthday) {
            data.birthday = '请选择'
          }
          if (!data.address) {
            data.address = '请选择'
          }
          app.globalData.userInfo = data
        },
        fail(r) {
          console.error('[' + r.data.code + ']:' + r.data.message)
        }
      }, 'api/user/info')
    }
  })
}

module.exports = {
  login: login,
  request: request
}