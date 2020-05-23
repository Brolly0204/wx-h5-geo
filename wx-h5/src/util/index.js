export default {
  initShareInfo(wx) {
    const shareInfo = {
      title: '乐乐的一天', // 分享标题
      link: 'http://m.brolly.com/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: 'https://static001.geekbang.org/account/avatar/00/15/40/6b/0f4e5b87.jpg', // 分享图标
      success: function () {
        // 用户点击了分享后执行的回调函数
      }
    }

    // 分享好友
    wx.updateAppMessageShareData(shareInfo)
    // 分享朋友圈
    wx.updateTimelineShareData({...shareInfo, title: '文利的一天'})
  }
}
