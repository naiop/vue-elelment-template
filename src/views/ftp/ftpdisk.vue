<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.Customers" size="small" placeholder="Host" clearable style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.Products" size="small" placeholder="user" clearable style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.Customers" size="small" placeholder="password" clearable style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.Customers" size="small" placeholder="port" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"> 连接 </el-button>

      <el-container class="mylayout">
        <el-aside>
          <el-tree ref="tree" v-loading="treeLoading" width="300px" :data="tableData" :props="defaultProps" default-expand-all @node-click="handleNodeClick">
            <span slot-scope="{ data }" class="span-ellipsis">
              <i :class="[data.type==='File'?'el-icon-document':[data.type == 1 ? 'el-icon-folder-opened' : 'el-icon-document']]" />
              <span :title="data.fullName">{{ data.fullName }}</span>
            </span>
          </el-tree>
        </el-aside>

        <el-container>
          <el-header style="height: 50px; text-align: left; font-size: 12px">
            <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-folder-opened" @click="handleBack"> 上级目录 </el-button>
            <label class="label">{{ currentDirectory }}</label>
          </el-header>

          <el-main>
            <img :src="emap_img">
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // 指令waves 水波纹效果
import { getFtpItems } from '@/api/other'

export default {
  name: 'Ftp',
  directives: { waves, permission },
  data() {
    return {
      treeLoading: false,
      Customers_Item: [],
      Products_Item: [],
      listQuery: {
        Customers: '',
        Products: '',
        workingDirectory: ''
      },
      total: 0,
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'field'
      },
      emap_img: '',
      currentDirectory: '/',
      iconFile: 'el-icon-document',
      iconfolder: 'el-icon-folder-opened'
    }
  },
  computed: {

  },
  created() {
  },
  methods: {
    handleFilter() {
      this.listQuery.workingDirectory = ''
      this.getList()
    },
    getList() {
      this.treeLoading = true
      getFtpItems(this.listQuery).then(response => {
        this.tableData = JSON.parse(response.data)
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
    }
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
  img{
    width: auto;
    height:auto;
    max-height: 100%;
    max-width: 100%;
   }
   .el-tree {
      background: #eef1f6;
  }

  </style>

