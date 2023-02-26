<template>
  <div class="user-activity">
    <div id="app">
      <h2 class="title">TodoList</h2>
      <div class="filter-container">
        <el-input v-model="inputVal" size="small" placeholder="任务信息" clearable style="width: 600px;" class="filter-item" @keyup.enter.native="handleAdd" />
        <el-button size="mini" class="filter-item" icon="el-icon-document-add" type="primary" @click="handleAdd"> 添加 </el-button>
      </div>
      <ul class="uls">
        <li v-for="(todo,index) in list" :key="index">
          <span :class="{'finish':todo.finish}">{{ todo.text }}</span>
          <span :class="{'finish':todo.finish}">{{ todo.time }}</span>
          <div class="but">
            <el-button type="danger" plain size="mini" @click="handleRemove(todo)">{{ $t('permission.delete') }}</el-button>
            <el-button type="success" size="mini" @click="handleDones(todo)">{{ $t('permission.confirm') }}</el-button>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      storage: 'appList',
      inputVal: '',
      time: '',
      flag: false,
      list: []
    }
  },
  watch: {
    // 监听
    list: {
      deep: true,
      // immediate: true,  //刷新加载 立马触发一次handler
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.handleSet(this.storage, newVal)
        } else {
          this.handleSet(this.storage, oldVal)
        }
      }
    }
  },
  mounted: function() {
    this.storage = this.$store.getters.userName
    // 页面初始化
    this.list = this.handleGet(this.storage) || []
  },
  methods: {
    // 添加
    handleAdd() {
      // 非空校验
      if (this.inputVal === '') {
        return
      }
      this.time = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
      this.list.push({ text: this.inputVal, time: this.time, finish: this.flag })
      this.inputVal = ''
      this.time = ''
    },
    // 移除
    handleRemove(todo) {
      this.list.splice(this.list.indexOf(todo), 1)
    },
    // 已完成
    handleDones(todo) {
      this.list[this.list.indexOf(todo)].finish = true
    },
    handleSet(key, val) {
      localStorage.setItem(key, JSON.stringify(val))
    },
    handleGet(key) {
      return JSON.parse(localStorage.getItem(key))
    }
  }

}

</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username{
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

       .finish {
            text-decoration: line-through;
            opacity: .5;
        }

        .uls {
            margin-top: 10px;
        }

        .uls li {
            display: flex;
            margin: 10px 0;
        }

        .uls li span:nth-child(1){
            width: 60%;
        }
        .uls li span:nth-child(2){
            width: 20%;
        }

</style>
