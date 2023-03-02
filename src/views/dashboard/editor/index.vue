<template>
  <div class="container">
    <div class="dashboard-text">name: {{ nickName }}</div>
    <div class="dashboard-text">roles: {{ roles }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  roles: 'roles',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'nickName',
      'avatar',
      'roles'
    ])
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.container {
}
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
