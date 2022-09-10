<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" icon="el-icon-edit" circle @click="handdleRoute('desktop')" />
      <el-button type="success" icon="el-icon-check" circle @click="handdleRoute('register')" />
      <el-button type="info" icon="el-icon-message" circle @click="handdleRoute('three')" />
      <el-button type="warning" icon="el-icon-star-off" circle />
      <el-button type="danger" icon="el-icon-delete" circle />
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

