<template>
  <div class="app-container">
    <switch-roles />
  </div>
</template>
<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import SwitchRoles from './components/SwitchRoles'

export default {
  name: 'DirectivePermission',
  components: { SwitchRoles },
  directives: { permission },
  data() {
    return {
    }
  },
  methods: {
    checkPermission
  }
}
</script>

