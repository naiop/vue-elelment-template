<template>
  <div class="app-container">
    <!-- xxx html 内容  -->
    <div class="filter-container">
      <el-upload
        ref="upload1"
        class="upload-demo"
        action="/Admin/UploadFile/UpLoadFile"
        :disabled="disabledUpload"
        :auto-upload="false"
        :on-change="changeFile"
        :on-error="fileErr"
        :on-exceed="handleExceed"
        :file-list="fileList1"
        :before-upload="beforeAvatarUpload"
        :on-success="msgSuccessOne"
        :data="fileData"
        list-type="picture"
        drag
        :show-file-list="false"
        :multiple="true"
        :limit="1000"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text" style="margin-top: -10px;line-height: 20px;">
          将文件拖到此处，<em v-if="!disabledUpload">或点击上传(单个文件需小于100M,一次最多上传1000个文件)</em><em v-else>（文件正在上传中，请等待...）</em>
        </div>
      </el-upload>

      <div>
        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">手动点击上传</el-button> -->
        <el-button v-if="showPercent" style="margin-left: 10px;" size="small" type="success" @click="submitAbort">取消后续文件上传</el-button>
      </div>

      <div v-if="showPercent" style="color:orange;">上传过程请勿刷新浏览器和跳转其他页面...</div>
      <!-- 进度条 -->
      <el-progress v-if="showPercent" :percentage="Number((percentNow*100/percentTotal).toFixed(0))" />
    </div>

    <el-table v-loading="listLoading" :data="DataList" size="small" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Id" width="90">
        <template slot-scope="{row}">  {{ row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="UserId">
        <template slot-scope="{row}"> {{ row.userId }}</template>
      </el-table-column>
      <el-table-column align="center" label="FileName">
        <template slot-scope="{row}"> {{ row.fileName }} </template>
      </el-table-column>
      <el-table-column label="UploadTime" align="center" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.uploadTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDownload(scope)"> 下载 </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>

</template>

<script>
import { upLoadFileToDB, getUploadFileList, downloadFileCustom, deleteFile } from '@/api/file'

export default {
  name: 'UploadFile',
  data() {
    return {
      fileNum: '', // 单词递归上传的文件
      upFileList: '', // 需要依次上传的待传列表
      percentTotal: 0, // 总上传个数
      percentNow: 0, // 当前上传个数
      showDesc: '', // 结束文案
      showPercent: false, // 显示上传进度条
      time: null, // change事件是否结束 是否可以直接调手动上传事件（目前设置1.5s）
      disabledUpload: false, // 正在上传中 禁止再次选择文件上传

      fileData: {
      }, // 上传参数

      fileList1: [],
      listLoading: false,
      total: 0,
      DataList: [],
      listQuery: {
        page: 1,
        limit: 10,
        configName: 'Roles',
        userId: 0,
        active: true
      }
    }
  },
  // beforeCreate：实例初始化后调用，此时实例刚在内存中创建出来，data和methods还没初始化好
  beforeCreate() {
    console.log('beforeCreate()')
  },
  // 在实例创建完成后被立即同步调用，实例已在内存中创建好，data和methods已初始化好，此时还没开始编译模板。
  created() {
    console.log('created()')
    this.getList()
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
    },
    async getList() {
      this.listLoading = true
      getUploadFileList(this.listQuery).then(res => {
        this.DataList = res.data.items
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // 超出限制个数提示
    handleExceed(files, fileList) {
      console.log('当前限制一次性最多上传1000个文件', files, fileList)
      this.$message.warning('当前限制一次性最多上传1000个文件')
    },
    changeFile(file, fileList) {
      this.disabledUpload = true

      console.log('changeFile', file, fileList)
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 100M')
        // return false // 这个return无效 故去掉
      }

      // 符合条件的进入待传列表
      this.upFileList = []
      for (const x of fileList) {
        if (x.raw && (x.size / 1024 / 1024 < 100)) { // 过滤掉非pdf 和小于100M的
          this.upFileList.push(x.raw)
          this.percentTotal = this.upFileList.length
          this.percentNow = 0
          this.showPercent = false
          this.showDesc = ''
        }
      }

      clearTimeout(this.time)
      this.time = setTimeout(() => {
        this.time = null
        console.log('防抖 高频触发后n秒内只会执行一次  再次触发重新计时')
        this.fnBegin()// 说明此时change了所有文件了 可以上传了
      }, 1500)
    },
    fnBegin() {
      console.log('此时change了所有文件 开始上传', this.upFileList)
      this.submitUpload2()
    },
    // 正式上传掉后端接口
    submitUpload2() {
      if (this.upFileList.length > 0) {
        this.showPercent = true

        this.fileNum = new FormData() // new formData对象
        this.fileNum.append('file', this.upFileList[0]) // append增加数据
        this.fileNum.append('name', this.upFileList[0].name) // append增加数据

        const _vm = this
        upLoadFileToDB(this.fileNum)
          .then(res2 => {
            // 每次上传当前一个后 不论成功失败就删除当前这个--如果上传失败想继续传当前这个 就把这两行注释掉
            this.percentNow = this.percentNow + 1
            this.upFileList.shift()

            console.log('上传返回', res2)
            if (res2.data.success) {
              // this.$message({
              //   message: "上传成功",
              //   type: 'success'
              // })

              // 进行递归 上传下一个
              this.submitUpload2()
            } else {
              _vm.$message({
                message: res2.data.return_message || '上传失败',
                type: 'error'
              })

              // 进行递归 上传下一个
              this.showDesc = '上传结束，部分文件上传失败'
              this.submitUpload2()
            }
          })
          .catch(error => {
            console.log(error)
            _vm.$message({
              message: error || '上传失败',
              type: 'error'
            })

            // 每次上传当前一个后 不论成功失败就删除当前这个--如果上传失败想继续传当前这个 就把这两行注释掉
            this.percentNow = this.percentNow + 1
            this.upFileList.shift()

            // 进行递归 上传下一个
            this.showDesc = '上传结束，部分文件上传失败'
            this.submitUpload2()
          })
      } else {
        this.disabledUpload = false
        this.showPercent = false
        this.upFileList = [] // 清空待传列表

        this.$refs.upload1.clearFiles()
        this.fileList1 = []

        if ((this.percentNow === this.percentTotal) && this.percentTotal) {
          this.$message.success(this.showDesc ? this.showDesc : '已全部上传成功！')
          this.percentTotal = 0
          this.percentNow = 0
          this.showDesc = ''
        } else if ((this.percentNow === this.percentTotal) && this.percentTotal === 0) {
          this.$message.warning('请先选择文件！')
          this.percentTotal = 0
          this.percentNow = 0
        } else {
          this.$message.success('已部分上传成功，且取消后续文件上传！')
          this.percentTotal = 0
          this.percentNow = 0
        }

        this.getList()
        return false
      }
    },
    // 终止后需上传
    submitAbort() {
      this.showPercent = false
      // .abort()不生效，故自己直接将this.upFileList置空 那么就不会走到递归了 就制止后续的上传了
      this.upFileList = []

      // this.upFileList.forEach(ele => {
      //   this.$refs.upload1.abort(ele)
      // })
      // this.$refs.upload1.abort()
      // this.$message.warning('已取消后续文件上传！')
    },
    fileErr(_err, file, _fileList) {
      this.$message({
        message: file.name + '上传失败',
        type: 'error'
      })
    },

    // 这两个事件不会再触发--因为阻止了自动上传
    beforeAvatarUpload(file) {
      console.log('上传文件前', file)
    },
    msgSuccessOne(_data, file, _fileList) {
      console.log('成功', file)
    },
    handleDelete(scope) {
      deleteFile(scope.row).then(response => {
        this.$message({
          type: 'success',
          message: this.$t('tips.actionSuccess')
        })
        this.getList()
      })
    },
    handleDownload(scope) {
      downloadFileCustom(scope.row).then(res => {
        console.log(res)
        const aLink = document.createElement('a')
        const evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错 事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = decodeURI(res.headers.filename) // 对使用 encodeURI() 方法编码的字符串进行解码
        aLink.href = URL.createObjectURL(res.data)
        aLink.dispatchEvent(evt)
        aLink.click()
      }).catch((e) => {
        this.$message({
          type: 'error',
          message: this.$t(e)
        })
      }).finally(() => {
        this.$message({
          type: 'success',
          message: this.$t('download success')
        })
      })
    }
  }
}
</script>

<style>
/* global styles */
</style>

<style lang="scss" scoped>
     /* local styles */
.temp {  /* name scoped */
 padding: 20px;
}
</style>

