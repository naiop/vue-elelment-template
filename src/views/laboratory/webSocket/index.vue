<template>
  <div class="dashboard-container">
    <el-button type="primary" icon="el-icon-search" @click="handdleMsg">submit</el-button>
    <el-button type="primary" icon="el-icon-search" @click="handdleRoute">testRoute</el-button>

    <div class="dashboard-text">roles: {{ roles }}</div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  roles: 'roles',
  data() {
    return {
      roles: ''
    }
  },
  computed: {

  },
  methods: {
    handdleMsg(msg) {
      const that = this
      console.log(that.global.ws)
      if (that.global.ws && that.global.ws.readyState === 1) {
        console.log('发送信息', msg)
        that.global.ws.send(msg)
      }
      that.global.ws.onmessage = function(res) {
        console.log('收到服务器内容', res)
        that.roles = res.data
      }
    },
    handdleRoute(msg) {
      this.$router.push('/register')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
