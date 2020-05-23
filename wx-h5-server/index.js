const express = require('express')
const app = express()
const wechatRouter = require('./routes/wechat')

app.use(express.json())
app.use(express.urlencoded({ extends: false }))

app.use('/api/wechat', wechatRouter)


app.listen(5000, () => {
  console.log('server listening to 5000')
})
