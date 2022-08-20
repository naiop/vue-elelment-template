<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        account: undefined,
        password: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
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
