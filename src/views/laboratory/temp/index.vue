<template>
  <div class="temp-container">
    <!-- xxx html 内容  -->
    <img src="@/assets/autumn.png">
  </div>

</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      isShow: true
    }
  },
  // beforeCreate：实例初始化后调用，此时实例刚在内存中创建出来，data和methods还没初始化好
  beforeCreate() {
    console.log('beforeCreate()')
  },
  // 在实例创建完成后被立即同步调用，实例已在内存中创建好，data和methods已初始化好，此时还没开始编译模板。
  created() {
    console.log('created()')
  },
  // 在挂载开始之前被调用，已完成模板编译，还没挂载到页面上。
  beforeMount() {
    console.log('beforeMount()')
  },
  // 实例被挂载后调用，已将编译好的模板挂载到页面指定的容器中显示。
  mounted() {
    console.log('mounted()')
    // 执行异步任务
    this.intervalId = setInterval(() => {
      console.log('-----')
      this.isShow = !this.isShow
    }, 1000)
  },
  // 状态更新前调用，此时data中的值是最新的，但界面上数据还是旧的，还没开始重新渲染DOM节点。
  beforeUpdate() {
    console.log('beforeUpdate()')
  },
  // 状态更新前调用，此时data中的值是最新的，但界面上数据还是旧的，还没开始重新渲染DOM节点。
  updated() {
    console.log('updated()')
  },
  // 实例销毁之前调用。在这一步，实例仍然完全可用。
  beforeDestroy() {
    console.log('beforeDestroy()')
    // 执行收尾的工作
    clearInterval(this.intervalId)
  },
  // 实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。
  destroyed() {
    console.log('destroyed()')
  },
  // 方法
  methods: {
    destroyVue() {
      this.$destroy()// 触发 beforeDestroy 和 destroyed 的钩子。
    }
  }
}
</script>

<style>
  /* global styles */
</style>

<style lang="scss" scoped>
   /* local styles */
.temp-container {  /* name scoped */
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    display: flex;
  img {
    width: 160px;
    margin: 0 auto;
  }
}
  </style>

