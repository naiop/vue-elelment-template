<!-- 这种方式可以根据Roles 展示不同界面 -->
<template>
  <div class="dashboard-container">
    <component :is="currentRole" />

    <!--悬浮小广告样式的提示信息-->
    <div id="thediv" ref="thediv" style="position: absolute; z-index: 111; right: 0; bottom: 0;">
      <a href="http://xxxxxx" target="_blank">
        <img src="@/assets/indicator.png" width="160" border="0">
      </a>
    </div>

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
  },
  methods: {

  }
}
</script>
