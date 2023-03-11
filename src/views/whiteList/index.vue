<template>
  <div class="app-container">
    <el-row>
      <el-button type="success" icon="el-icon-star-off" @click="handdleRoute('desktop')">desktop</el-button>
      <el-button type="success" icon="el-icon-star-off" @click="handdleRoute('register')">register</el-button>
      <el-button type="success" icon="el-icon-star-off" @click="handdleRoute('three')">three</el-button>

    </el-row>
  </div>
</template>

<script>

export default {
  name: 'WhiteList',
  data() {
    return {
      roles: ''
    }
  },
  computed: {

  },
  methods: {
    handdleRoute(msg) {
      this.$router.push('/' + msg)
    }
  }
}
</script>

