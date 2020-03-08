var barcode = require('./barcode');
var qrcode = require('./qrcode');

function convert_length(length) {
	return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height) {
	barcode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height))
}

function qrc(id, code, width, height) {
	qrcode.api.draw(code, {
		ctx: wx.createCanvasContext(id),
		width: convert_length(width),
		height: convert_length(height)
	})
}
// 预览图片
function previewImg(e) {
  var currentUrl = e.currentTarget.dataset.currenturl
  var previewUrls = e.currentTarget.dataset.previewurl
  if (previewUrls instanceof Array) {
    wx.previewImage({
      current: currentUrl, //必须是http图片，本地图片无效
      urls: previewUrls, //必须是http图片，本地图片无效
    })
  }else {
    wx.previewImage({
      current: currentUrl, //必须是http图片，本地图片无效
      urls: [previewUrls], //必须是http图片，本地图片无效
    })
  }
}

function getDistance(dis) {
  if (dis <= 100) {
    return '<100m'
  }
  if (dis <= 1000) {
    return Math.round(dis) + 'm'
  }
  if (dis > 20000) {
    return '>20km'
  }
  return Math.round(dis / 1000) + 'km'
}
/**
 * 是否是已领取福瑞狗的会员，且在有效期内
 */
function isMember() {
  let app = getApp()
  let userInfo = app.globalData.userInfo
  if (userInfo.dog) {
    if (userInfo.dog.lastDate && userInfo.dog.lastDate > new Date()) {
      return true
    }
  }
  return false
}

function getTimeDiff(s, end) {
  return Math.floor((end - s)/1000/60/60/24)
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null

module.exports = {
	barcode: barc,
	qrcode: qrc,
  previewImg: previewImg,
  getDistance: getDistance,
  isMember: isMember,
  getTimeDiff: getTimeDiff,
  formatDate: formatDate,
  formatTime: formatTime,
  info() {
    if (!log) return
    log.info.apply(log, arguments)
  },
  warn() {
    if (!log) return
    log.warn.apply(log, arguments)
  },
  error() {
    if (!log) return
    log.error.apply(log, arguments)
  },
  setFilterMsg(msg) { // 从基础库2.7.3开始支持
    if (!log || !log.setFilterMsg) return
    if (typeof msg !== 'string') return
    log.setFilterMsg(msg)
  },
  addFilterMsg(msg) { // 从基础库2.8.1开始支持
    if (!log || !log.addFilterMsg) return
    if (typeof msg !== 'string') return
    log.addFilterMsg(msg)
  }
}