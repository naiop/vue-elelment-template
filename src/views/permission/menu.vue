<template>
  <div class="app-container">
    <aside> <switch-roles /></aside>
    <div class="filter-container">
      <el-input v-model="listQuery.title" size="small" placeholder="Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"> Search</el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate"> Add</el-button>
      <el-button v-waves :loading="downloadLoading" size="mini" class="pan-btn green-btn" type="primary" icon="el-icon-download" @click="handleDownload"> Export</el-button>
    </div>

    <el-table v-loading="listLoading" row-key="id" :data="list" border fit highlight-current-row style="width: 100%;" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}"> <span>{{ row.id }}</span> </template>
      </el-table-column>
      <el-table-column label="Path" width="150px" align="center">
        <template slot-scope="{row}"><span>{{ row.path }}</span></template>
      </el-table-column>
      <el-table-column label="Component" width="110px" align="center">
        <template slot-scope="{row}"><span>{{ row.component }}</span></template>
      </el-table-column>
      <el-table-column label="Hidden" width="110px" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.hidden" active-color="#13ce66" disabled />
        </template>
      </el-table-column>
      <el-table-column label="AlwaysShow" width="110px" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.alwaysShow" active-color="#13ce66" disabled />
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
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleCreate">Add</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">Edit</el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" size="small" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 420px; margin-left:40px;">
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
        <el-form-item label="Meta" prop="meta">
          <el-input v-model="temp.meta" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取消 </el-button>
        <el-button type="primary" size="mini" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import SwitchRoles from './components/SwitchRoles'
import waves from '@/directive/waves' // waves directive 水波纹效果 waves v-directive
import { getAsyncRoutes } from '@/api/menu'

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
      list: null,
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
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
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
    handleMetaView() {
      // TODO meta dialog
    },
    handleDownload(key) {
      // TODO 到处excel
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
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          // createRoutes(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Created Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateRoutes(tempData).then(() => {
          //   const index = this.list.findIndex(v => v.id === this.temp.id)
          //   this.list.splice(index, 1, this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Update Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    }

  }
}
</script>
