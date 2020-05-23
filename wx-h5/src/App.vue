<template>
  <div id="app">
    <img alt="Vue logo" :src="avatarUrl">
    <button @click="getUserInfo">获取用户信息</button>
    <button @click="getUserLocation">获取用户地理位置</button>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import initAMap from './lib/amap'
import util from './util'
import API from './api'
import logo from './assets/logo.png'

export default {
  name: 'App',

  data() {
    return {
      avatarUrl: logo
    }
  },

  mounted() {
    this.checkUserAuth()
  },

  methods: {
    // 检查用户是否授权
    checkUserAuth() {
      const openId = this.$cookie.get('openId')
      if (!openId) {
        window.location.href = API.wechatRedirect
      } else {
        this.getJSSDKConfig()
      }
    },
    // 获取微信配置信息
    getJSSDKConfig() {
      this.$http.get(API.wechatConfig, {
        params: {
          url: window.location.href
        }
      }).then(res => {
        const result = res.data
        console.log('jssdk配置', result)
        if (result.code === 0) {
          const data = result.data
          const {
            appId,
            timestamp,
            nonceStr,
            signature,
            jsApiList
          } = data
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId, // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature,// 必填，签名
            jsApiList // 必填，需要使用的JS接口列表
          })

          wx.ready(() => {
            util.initShareInfo(wx)
          })
        }
      })
    },
    getUserInfo() {
      if (!this.$cookie.get('openId')) return
      this.$http.get(API.getUserInfo).then(res => {
        const result = res.data
        console.log('result', result)
        this.avatarUrl = result.data.headimgurl
      })
    },
    getUserLocation() {
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          console.log('location', res)
          this.getUserLocationCity(res.latitude, res.longitude)
          // wx.openLocation({
          //   latitude: res.latitude, // 纬度，浮点数，范围为90 ~ -90
          //   longitude: res.longitude, // 经度，浮点数，范围为180 ~ -180。
          //   name: '北京市', // 位置名
          //   address: '', // 地址详情说明
          //   scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
          //   infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
          // })
        }
      })
    },
    getUserLocationCity(latitude, longitude) {
      if (!latitude || !longitude) return
      const lnglat = [longitude, latitude]
      initAMap().then(AMap => {
        AMap.plugin('AMap.Geocoder', function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: ''
          })

          geocoder.getAddress(lnglat, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              // result为对应的地理位置详细信息
              alert(JSON.stringify(result))
              console.log(result)
            }
          })
        })
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
