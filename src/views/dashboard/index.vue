<!-- 这种方式可以根据Roles 展示不同界面 -->
<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
    this.initWebSocket()// 初始化websocket方法
  },
  methods: {
    initWebSocket() {
      const that = this
      if ('WebSocket' in window) {
        const socketUrl = 'ws://47.103.68.175:8849'
        that.ws = new WebSocket(socketUrl)
        that.global.setWs(that.ws)
        that.ws.onopen = function() {
          console.log('websocket连接成功')
        }

        that.ws.onclose = function() {
          // 关闭 websocket
          console.log('连接已关闭...')
          // 断线重新连接
          setTimeout(() => {
            that.initWebSocket()
          }, 2000)
        }
      } else {
        // 浏览器不支持 WebSocket
        console.log('您的浏览器不支持 WebSocket!')
        this.openNotificationWithIcon('error', '浏览器', '您的浏览器不支持显示消息请更换', 1, 1)
      }
    },
    // 创建websocket连接
    createWebSocket() {
      const that = this
      that.webSocet = null
      that.webSocet = new WebSocket(process.env.VUE_APP_SOCKET_URL)
      // console.log('that.webSocet',that.webSocet);
      if (that.webSocet.readyState === 0 && !that.timeoutnum) {
        that.timer = setInterval(() => {
          if (that.timer_num < 3 && that.webSocet.readyState === 0) {
            that.timer_num++
          } else {
            clearInterval(that.timer)
            that.timer = null
            that.timer_num = 0
            // 只要不成功就连接
            if (that.webSocet.readyState !== 1) {
              that.reconnect()
            }
          }
        }, 1000)
      }
      // 链接成功时
      that.webSocet.onopen = function() {
        // 开启心跳
        that.start()
      }
      // 收到消息时
      that.webSocet.onmessage = (msgInfo) => {
        // console.log('接收到的消息',msgInfo);
        that.UP_WEBSOCKETINFO({ data: msgInfo.data, timer: msgInfo.timeStamp })
        // 收到服务器信息，心跳重置
        that.reset()
      }
      // 连接错误
      that.webSocet.onerror = function() {
        console.log('WebSocket连接发生错误')
        // 重连
        that.reconnect()
      }
      // 监听组件的销毁
      that.$once('hook:beforeDestroy', () => {
        if (that.webSocet.close) {
          that.webSocet.close()
          that.webSocet.onclose = () => {
            console.log('web socket 链接已关闭')
          }
        }
      })
    },
    reconnect() { // 重新连接
      const that = this
      if (that.webSocet && that.webSocet.readyState === 1) {
        clearInterval(that.timeoutnum)
        that.timeoutnum = null
        that.timeNum = 0
        return
      }
      if (!that.timeoutnum) {
        that.timeoutnum = setInterval(function() {
          if (that.webSocet && that.webSocet.readyState === 1) {
            clearInterval(that.timeoutnum)
            that.timeoutnum = null
            that.timeNum = 0
            return
          }
          // 新连接
          that.createWebSocket()
          that.timeNum++
          if (that.timeNum >= 3) {
            clearInterval(that.timeoutnum)
            that.timeoutnum = null
            that.timeNum = 0
          }
        }, 1000)
      }
    },
    reset() { // 重置心跳
      // 清除时间
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      // 重启心跳
      this.start()
    },
    start() { // 开启心跳
      const that = this
      that.timeoutObj && clearTimeout(that.timeoutObj)
      that.serverTimeoutObj && clearTimeout(that.serverTimeoutObj)
      that.timeoutObj = setTimeout(function() {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (that.webSocet && that.webSocet.readyState === 1) { // 如果连接正常
          that.webSocet.send(
            that.userInfo.userId + '-' +
                            that.userInfo.userName + '-' +
                            that.userInfo.token
          )
        } else { // 否则重连
          that.reconnect()
        }
      }, that.timeout)
    }

  }
}
</script>
