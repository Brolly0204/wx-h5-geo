const express = require('express')
const axios = require('axios')
const createHash = require('create-hash')
const memoryCache = require('memory-cache')
const config = require('../config').wx

const router = express.Router()

router.get('/test', (req, res) => {
  res.json('test router')
})

router.get('/redirect', (req, res) => {
  const { url, scope } = req.query
  memoryCache.put('redirectUri', url)
  const callbackUri = 'http://m.brolly.com/api/wechat/getOpenId'
  const authorizeUri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${callbackUri}&response_type=code&scope=${scope}&state=123#wechat_redirect`

  res.redirect(authorizeUri)
})

router.get('/getOpenId', (req, res) => {
  const code = req.query.code
  const { appId, appSecret } = config
  const token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
  
  if (!code) {
    res.json({
      code: 1001,
      data: '',
      message: '当前未获取到授权code码'
    })
  } else {
    axios.get(token_url).then((resp) => {
      const result = resp.data
      console.log('result', result)

      const expire_time = 1000 * 60 * 60

      memoryCache.put('accessToken', result.access_token, expire_time)
      memoryCache.put('openId', result.openid, expire_time)
      res.cookie('openId', result.openid, {
        maxAge: expire_time
      })
      const redirectUri = memoryCache.get('redirectUri')
      res.redirect(redirectUri)
    }).catch(err => {
      res.json({
        code: 1002,
        data: '',
        message: '当前获取openId失败'
      })
    })
  }
})

router.get('/getUserInfo', (req, res) => {
  const accessToken = memoryCache.get('accessToken')
  const openId = memoryCache.get('openId')
  const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openId}&lang=zh_CN`

  axios.get(userInfoUrl).then(resp => {
    const data = resp.data
    res.json({
      code: 0,
      data,
      message: '获取用户信息成功'
    })
  })
})


const getToken = async () => {
  const tokenUrl = ` https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`
  return axios.get(tokenUrl).then(res => res.data)
}

const getTicket = async (token) => {
  const ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
  return axios.get(ticketUrl).then(res => res.data)
}

// 生成随机字符串
const createNonceStr = () => {
  return Math.random().toString(36).substr(2, 15)
}

// 生成时间戳
const createTimeStamp = () => {
  return new Date().getTime() / 1000 + ''
}

// 签名生成的排序算法
const raw = (args) => {
  const keys = Object.keys(args).sort()
  const result = []
  keys.forEach(key => {
    result.push(`${key}=${args[key]}`)
  })
  // ['a=1', 'b=2'].join('&') => 'a=1&b=2'
  return result.join('&')
}

router.get('/jssdk', async (req, res) => {
  const url = req.query.url
  const tokenData = await getToken()
  console.log('token', tokenData)
  const ticketData = await getTicket(tokenData.access_token)
  console.log('ticket', ticketData)
  const ticket = ticketData.ticket

  if (ticket) {
    const params = {
      noncestr: createNonceStr(),
      jsapi_ticket: ticket,
      timestamp: createTimeStamp(),
      url
    }
    console.log('params', params)
    const str = raw(params)
    console.log('raw str', str)
    // 签名
    const sign = createHash('sha1').update(str).digest('hex')
    console.log('sign', sign)

    res.json({
      code: 0,
      data: {
        appId: config.appId,
        nonceStr: params.noncestr,
        timestamp: params.timestamp,
        signature: sign,
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'openLocation', 'getLocation']
      },
      message: 'jssdk配置'
    })
  } else {
    res.json({
      code: 1,
      message: 'jssdk失败'
    })
  }
})
module.exports = router
