<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.host" size="small" placeholder="Host" clearable style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.user" size="small" placeholder="user" clearable style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.password" size="small" placeholder="password" clearable style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.port" size="small" placeholder="port" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button v-waves class="filter-item" size="mini" type="primary" icon="el-icon-link" @click="handleFilter"> 连接 </el-button>

      <el-container class="mylayout">
        <el-aside>
          <el-tree ref="tree" v-loading="treeLoading" width="300px" :data="treeData" :props="defaultProps" default-expand-all @node-click="handleNodeClick">
            <span slot-scope="{ data }" class="span-ellipsis">
              <i :class="[data.type==='File'?'el-icon-document':[data.type == 1 ? 'el-icon-folder-opened' : 'el-icon-document']]" />
              <span :title="data.fullName">{{ data.fullName }}</span>
            </span>
          </el-tree>
        </el-aside>

        <el-container>
          <el-header style="height: 50px; text-align: left; font-size: 12px">
            <el-button v-waves class="filter-item" size="mini" type="primary" icon="el-icon-folder-opened" @click="handleBack"> 上级目录 </el-button>
            <label class="label">{{ currentDirectory }}</label>
          </el-header>

          <el-main>
            <el-upload
              ref="upload1"
              class="upload-demo"
              action="/Admin/Ftp/UpLoadFile"
              :disabled="disabledUpload"
              :auto-upload="false"
              :on-change="changeFile"
              :on-exceed="handleExceed"
              :file-list="fileList1"
              :data="fileData"
              list-type="picture"
              drag
              multiple
              :show-file-list="false"
              :limit="1000"
            >

              <i class="el-icon-upload" />
              <div class="el-upload__text" style="margin-top: -10px;line-height: 20px;">
                将文件拖到此处，<em v-if="!disabledUpload">或点击上传(单个文件需小于100M,一次最多上传1000个文件)</em><em v-else>（文件正在上传中，请等待...）</em>
              </div>
            </el-upload>
            <!-- 进度条 -->
            <el-progress v-if="showPercent" :percentage="Number((percentNow*100/percentTotal).toFixed(0))" />

          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // 指令waves 水波纹效果
import { getFtpItems, upLoadFile } from '@/api/file'
import { storageget, storageset } from '@/utils'

export default {
  name: 'Ftp',
  directives: { waves, permission },
  data() {
    return {
      treeLoading: false,
      listQuery: {
        host: '',
        user: '',
        password: '',
        port: '21',
        workingDirectory: ''
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'field'
      },
      currentDirectory: '/',
      iconFile: 'el-icon-document',
      iconfolder: 'el-icon-folder-opened',
      fileList: [],
      formData: undefined, // 单词递归上传的文件
      upFileList: [], // 需要依次上传的待传列表
      percentTotal: 0, // 总上传个数
      percentNow: 0, // 当前上传个数
      showDesc: '', // 结束文案
      showPercent: false, // 显示上传进度条
      time: null, // change事件是否结束 是否可以直接调手动上传事件（目前设置1.5s）
      disabledUpload: false, // 正在上传中 禁止再次选择文件上传
      fileData: {
      }, // 上传参数
      fileList1: []
    }
  },
  computed: {

  },
  created() {
    this.listQuery = storageget('ftp') || this.listQuery
  },
  methods: {
    handleFilter() {
      this.listQuery.workingDirectory = ''
      this.getList()
    },
    getList() {
      this.treeLoading = true
      getFtpItems(this.listQuery).then(response => {
        this.treeData = JSON.parse(response.data)
        this.treeLoading = false
        storageset('ftp', this.listQuery)
      }).catch(() => {
        this.treeData = []
        this.treeLoading = false
      })
    },
    // 返回的ftp 目录, type 0代表文件，1代表文件夹
    handleNodeClick(data) {
      console.log(data)
      this.listQuery.workingDirectory = data.fullName
      this.currentDirectory = data.fullName
      if (data.type === 0) {
        console.log(11)
      } else if (data.type === 1) {
        this.getList()
      }
    },
    handleBack() {
      this.listQuery.workingDirectory = this.currentDirectory.trim().substr(0, this.currentDirectory.trim().lastIndexOf('/'))
      this.currentDirectory = this.listQuery.workingDirectory
      this.getList()
    },
    // 上传文件-----------------------
    // change事件，选择了多少个文件，这个事件就会执行多少次
    changeFile(file, fileList) {
      this.disabledUpload = true

      console.log('changeFile', file, fileList)
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 100M')
      }

      // 符合条件的进入待传列表
      this.upFileList = []
      for (const x of fileList) {
        // (x.name.indexOf('.pdf') > -1)
        if (x.raw && (x.size / 1024 / 1024 < 100)) { // 过滤掉小于100M的
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
      console.log(this.upFileList.length)
      if (this.upFileList.length > 0) {
        this.showPercent = true

        this.formData = new FormData() // new formData对象 FormData对象，添加参数只能通过append('key', value)的形式添加
        this.formData.append('file', this.upFileList[0]) // append增加数据
        this.formData.append('name', this.upFileList[0].name) // append增加数据
        this.formData.append('info', JSON.stringify(this.listQuery))

        const _vm = this
        upLoadFile(this.formData)
          .then(response => {
            // 每次上传当前一个后 不论成功失败就删除当前这个--如果上传失败想继续传当前这个 就把这两行注释掉
            this.percentNow = this.percentNow + 1
            this.upFileList.shift()

            console.log('上传返回', response)
            if (response.data.success) {
              // this.$message({
              //   message: "上传成功",
              //   type: 'success'
              // })

              // 进行递归 上传下一个
              this.submitUpload2()
            } else {
              _vm.$message({
                message: response.data || '上传失败',
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

        return false
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    // 超出限制个数提示
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 100 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
    // 上传文件-----------------------
  }
}
</script>
<style lang="scss">
   .el-header {
      background-color: #eef1f6;
      color: #333;
      line-height: 60px;
    }
    .el-aside {
      color: #333;
      padding: 8px 2px;
    }
    .span-ellipsis1 {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
   }
   .mylayout {
    max-height: calc(100vh - 146px);
    width: 100%;
    position: relative;
    overflow: hidden;
    border: 1px solid #eee;
  }
  .label{
    margin-left: 20px;
   }
   .el-tree {
      background: #eef1f6;
  }

  </style>

