export default function initAMap() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      console.log('已加载的map')
      resolve(window.AMap)
      // initMapUI()
    } else {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src =
        // 'https://webapi.amap.com/maps?v=1.4.15&key=820bae986908e24092c002730ef4a3a3&callback=onAMapLoaded'
        'https://webapi.amap.com/maps?v=1.4.15&key=27159fd847711c965e48088f0a606168&callback=onAMapLoaded'
      // 'https://m.amap.com/maps?v=1.4.15&key=27159fd847711c965e48088f0a606168&callback=onAMapLoaded'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.onAMapLoaded = () => {
      console.log('初始加载的map')
      resolve(window.AMap)
      // initMapUI()
    }
  })
}
//
// function initMapUI() {
//   const mapUI = new Promise(function(resolve, reject) {
//     let hasLoaded2 = document.getElementById('amapUI')
//     if (hasLoaded2) {
//       // 只加载一次
//       return
//     }
//     let script2 = document.createElement('script')
//     script2.type = 'text/javascript'
//     script2.src = 'https://webapi.amap.com/ui/1.0/main.js?v=1.0.11'
//     script2.id = 'amapUI'
//     script2.onerror = reject
//     script2.onload = function() {
//       resolve()
//     }
//     document.head.appendChild(script2)
//   })
//   mapUI.then(() => {
//     console.log('mapUI加载')
//   })
// }
