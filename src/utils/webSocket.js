import { Notification } from 'element-ui'
import global from './global.js'

export default function initWebSocket() {
  if ('WebSocket' in window) {
    const socketUrl = 'ws://47.103.68.175:8849'
    var ws = new WebSocket(socketUrl)
    global.setWs(ws)
    ws.onopen = function() {
      console.log('websocket连接成功')
      Notification({
        title: '成功',
        message: 'websocket连接成功',
        type: 'success'
      })
      // 开启心跳
      heartCheck.start()
    }
    ws.onclose = function() {
      console.log('连接已关闭...')
      // 断线重新连接
      setTimeout(() => {
        this.initWebSocket()
      }, 2000)
    }
    ws.onerror = function() {
      console.log('WebSocket连接发生错误...')
      setTimeout(() => {
        this.initWebSocket()
      }, 2000)
    }
  } else {
    // 浏览器不支持 WebSocket
    console.log('您的浏览器不支持 WebSocket!')
    Notification({
      title: '错误',
      message: '您的浏览器不支持 WebSocket! '
    })
  }
}

// 心跳设置
var heartCheck = {
  timeout: 200, // 每段时间发送一次心跳包 这里设置为20s
  timeoutObj: 200, // 延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）

  start: function() {
    this.timeoutObj = setTimeout(function() {
      if (global.ws && global.ws.readyState === 1) {
        global.ws.send('heartbeat')
      }
    }, this.timeout)
  },

  reset: function() {
    clearTimeout(this.timeoutObj)
    this.start()
  }
}

