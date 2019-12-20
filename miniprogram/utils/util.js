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

module.exports = {
	barcode: barc,
	qrcode: qrc,
  previewImg: previewImg
}