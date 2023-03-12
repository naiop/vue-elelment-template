<template>
  <div class="app-container">
    <aside> <switch-roles /></aside>
    <div class="filter-container">
      <el-input v-model="listQuery.title" size="small" placeholder="Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"> Search</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate"> Add</el-button>
      <el-button v-waves :loading="downloadLoading" size="mini" class="pan-btn green-btn" type="primary" icon="el-icon-download" @click="handleDownload"> Export</el-button>
    </div>

    <el-table v-loading="listLoading" row-key="id" :data="list" border fit highlight-current-row :row-class-name="tableRowClassName" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}"> <span>{{ row.id }}</span> </template>
      </el-table-column>
      <el-table-column label="Path" width="150px" align="center">
        <template slot-scope="{row}"><span>{{ row.path }}</span></template>
      </el-table-column>
      <el-table-column label="Component" width="110px" align="center" :show-overflow-tooltip="true">
        <template slot-scope="{row}"><span>{{ row.component }}</span></template>
      </el-table-column>
      <el-table-column label="Hidden" width="110px" align="center">
        <template slot-scope="{$index,row}">
          <el-switch v-model="row.hidden" active-color="#13ce66" inactive-color="#DCDFE6" @change="changeMenuSwitch($index, row)" />
        </template>
      </el-table-column>
      <el-table-column label="AlwaysShow" width="110px" align="center">
        <template slot-scope="{$index,row}">
          <el-switch v-model="row.alwaysShow" active-color="#13ce66" inactive-color="#DCDFE6" @change="changeMenuSwitch($index, row)" />
        </template>
      </el-table-column>
      <el-table-column label="Name" width="110px" align="center">
        <template slot-scope="{row}"><span>{{ row.name }}</span></template>
      </el-table-column>
      <el-table-column label="Meta" align="center" :show-overflow-tooltip="true">
        <!-- <template slot-scope="{row}"><span>{{ row.meta }}</span></template> -->
        <template slot-scope="{row}">
          <el-button size="mini" type="text" @click="handleMetaView(row.meta)">
            {{ row.meta }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="success" @click="handleCreate">Add</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" size="small" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 420px; margin-left:40px;">
        <el-form-item label="Path" prop="path">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="Component" prop="component">
          <el-input v-model="temp.component" />
        </el-form-item>
        <el-form-item label="Hidden" prop="hidden">
          <el-switch
            v-model="temp.hidden"
            active-color="#13ce66"
          />
        </el-form-item>
        <el-form-item label="AlwaysShow" prop="alwaysShow">
          <el-switch
            v-model="temp.alwaysShow"
            active-color="#13ce66"
          />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <!-- <el-form-item label="Meta" prop="meta">
          <el-input v-model="temp.meta" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取消 </el-button>
        <el-button type="primary" size="mini" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Meta" :visible.sync="metaVisible" :before-close="handleMetaClose">

      <el-table size="small" :data="metaList" border fit highlight-current-row>
        <!-- <el-table-column label="Id" align="center" width="80">
    <template slot-scope="{row}"> <span>{{ row.id }}</span> </template>
  </el-table-column> -->
        <el-table-column label="Title" align="center">
          <template slot-scope="{row}"> <span>{{ row.title }}</span> </template>
        </el-table-column>
        <el-table-column label="Icon" align="center" width="110">
          <template slot-scope="{row}">
            <i :class="row.icon" />
            <svg-icon :icon-class="row.icon" />
            <!-- <span>{{ row.icon }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="noCache" align="center" width="90" :show-overflow-tooltip="true">
          <template slot-scope="{$index,row}">
            <el-switch v-model="row.noCache" active-color="#13ce66" inactive-color="#DCDFE6" @change="changeMetaSwitch($index, row)" />
          </template>
        </el-table-column>
        <el-table-column label="Breadcrumb" align="center" width="110" :show-overflow-tooltip="true">
          <template slot-scope="{$index,row}">
            <el-switch v-model="row.breadcrumb" active-color="#13ce66" inactive-color="#DCDFE6" @change="changeMetaSwitch($index, row)" />
          </template>
        </el-table-column>
        <el-table-column label="AffixTag" align="center" width="80" :show-overflow-tooltip="true">
          <template slot-scope="{$index,row}">
            <el-switch v-model="row.affix" active-color="#13ce66" inactive-color="#DCDFE6" @change="changeMetaSwitch($index, row)" />
          </template>
        </el-table-column>
        <el-table-column label="ActiveMenu" align="center">
          <template slot-scope="{row}"><span>{{ row.activeMenu }}</span></template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import SwitchRoles from './components/SwitchRoles'
import waves from '@/directive/waves' // waves directive 水波纹效果 waves v-directive
import { getAsyncRoutes, updateMeta, updateMenu } from '@/api/menu'
// eslint-disable-next-line no-unused-vars
import { exportExcel, exportFileBlob } from '@/api/menu'

export default {
  name: 'Menu',
  components: { SwitchRoles },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        roles: [],
        key: true
      },
      dialogFormVisible: false, // dialog
      dialogStatus: '', // dialog
      textMap: { // dialog
        update: 'Edit',
        create: 'Create'
      },
      metaVisible: false,
      metaList: [],
      temp: {
        id: 0,
        path: '',
        component: 'Layout',
        name: '',
        hidden: false,
        alwaysShow: false,
        meta: {},
        children: [],
        metaId: 0,
        parentId: 0

      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      getAsyncRoutes(this.listQuery).then(response => {
        this.list = response.data
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleMetaView(data) {
      // TODO meta dialog
      this.metaVisible = true
      this.metaList.push(data)
    },
    handleMetaClose(done) {
      this.metaList = []
      done()
    },
    // base64转blob
    base64ToBlob(code) {
      const raw = window.atob(code)
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array])
    },
    handleDownload() {
      // TODO 导处excel
      exportFileBlob().then(res => {
        console.log(res)
        const aLink = document.createElement('a')
        const evt = document.createEvent('HTMLEvents')
        // initEvent 不加后两个参数在FF下会报错 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent('click', true, true)
        aLink.download = res.headers.filename
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

      // exportExcel(this.listQuery).then(response => {
      //   const count = 1
      //   if (count === 1) {
      //     const data = response.data

      //     const aLink = document.createElement('a')
      //     const blob = this.base64ToBlob(data)
      //     const evt = document.createEvent('HTMLEvents')
      //     // initEvent 不加后两个参数在FF下会报错 事件类型，是否冒泡，是否阻止浏览器的默认行为
      //     evt.initEvent('click', true, true)
      //     aLink.download = 'exportExcel.xlsx'
      //     aLink.href = URL.createObjectURL(blob)
      //     aLink.dispatchEvent(evt)
      //     aLink.click()
      //   }
      // }).catch((e) => {
      //   this.$message({
      //     type: 'info',
      //     message: this.$t(e)
      //   })
      // }).finally(() => {
      //   this.$message({
      //     type: 'info',
      //     message: this.$t('download success')
      //   })
      // })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: '禁止删除',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$notify({
            title: 'Success',
            message: '禁止添加',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
        }
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          this.$notify({
            title: 'Success',
            message: '禁止更新',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
        }
      })
    },
    changeMetaSwitch(index, row) {
      // metaSwitch
      updateMeta([row]).then(() => {
        this.getList()
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    changeMenuSwitch(index, row) {
      // menuSwitch
      updateMenu([row]).then(() => {
        this.getList()
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 表格颜色
    tableRowClassName(val) {
      if (val.row.parentId === 0) {
        return 'success-row'
      } else {
        return 'warning-row'
      }
    }

  }
}
</script>

<style lang="scss">

.el-table .warning-row {
    background:oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }

</style>
