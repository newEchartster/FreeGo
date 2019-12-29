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
  wx.previewImage({
    current: currentUrl, //必须是http图片，本地图片无效
    urls: previewUrls, //必须是http图片，本地图片无效
  })
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

var log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null

module.exports = {
	barcode: barc,
	qrcode: qrc,
  previewImg: previewImg,
  getDistance: getDistance,
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