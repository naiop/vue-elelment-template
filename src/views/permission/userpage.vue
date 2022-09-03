<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.UserName" placeholder="用户名" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button v-permission="['developer','admin']" v-waves class="filter-item" icon="el-icon-document-add" type="primary" @click="handleAdd"> 添加 </el-button>
    </div>

    <el-table v-loading="listLoading" :data="tableData" border style="width: 100%; margin-top: 20px;" fit highlight-current-row>
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="UserName" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.UserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Password" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.Password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="name" align="center" width="110" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="mail" align="center" width="120" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.mail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Active" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.Active }}</span>
        </template>
      </el-table-column>
      <el-table-column label="roles" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.roles }}</span>
        </template>
      </el-table-column>
      <el-table-column label="token" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.token }}</span>
        </template>
      </el-table-column>
      <el-table-column label="introduction" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="avatar" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.avatar }}</span>
        </template>
      </el-table-column>

      <el-table-column label="CreateTime" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.CreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="UpdateTime" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.UpdateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button v-permission="['developer','admin']" icon="el-icon-edit-outline" type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button v-permission="['developer','admin']" icon="el-icon-delete" type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit':'New'">
      <el-form ref="dataForm" :rules="rules" :model="entity" label-width="80px" label-position="left" style="width: 420px; margin-left:40px;">
        <el-form-item label="账号名称" prop="UserName">
          <el-input v-model="entity.UserName" placeholder="UserName" style="width:180px" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="entity.Password" placeholder="Password" style="width:180px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisible=false">确定</el-button>
        <el-button type="primary" @click="confirmEntity">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { deepClone } from '@/utils'
import store from '@/store'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // 指令waves 水波纹效果
// eslint-disable-next-line no-unused-vars
import { GetUser, InsertUser, UpdateUser, DeleteUser } from '@/api/user'

const defaultEntity = {
  Id: undefined,
  UserName: undefined,
  Password: undefined,
  name: undefined,
  mail: undefined,
  Active: undefined,
  roles: undefined,
  token: undefined,
  introduction: undefined,
  avatar: undefined,
  CreateTime: undefined,
  UpdateTime: undefined
}

export default {
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      entity: Object.assign({}, defaultEntity),
      dialogVisible: false, // 弹窗显示bool
      dialogType: 'new',
      total: 0,
      tableData: [],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        UserName: ''
      },
      rules: {
        UserName: [{ required: true, message: 'Code is required', trigger: 'change' }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      GetUser(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdd() {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.entity = Object.assign({}, defaultEntity)
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.entity = deepClone(row)
    },
    async handleDelete(index, row) {
      console.log(row)
      this.entity = deepClone(row)
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('tips.warning'), {
        confirmButtonText: this.$t('action.confirm'),
        cancelButtonText: this.$t('action.cancel'),
        type: 'warning'
      }).then(() => {
        console.log(this.entity)
        // DeleteUser(this.entity).then(response => {
        //   this.tableData.splice(index, 1)
        //   this.$message({
        //     type: 'success',
        //     message: this.$t('tips.actionSuccess')
        //   })
        // })
      }).catch(() => {
      })
    },
    async confirmEntity() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const isEdit = this.dialogType
          if (isEdit === 'edit') {
            this.entity.updateTime = new Date()
            this.entity.updateUser = store.getters.name
            console.log(this.entity)
            // UpdateUser(this.entity).then(() => {
            //   const index = this.tableData.findIndex(v => v.id === this.entity.id)
            //   this.tableData.splice(index, 1, this.entity)
            //   this.$notify({
            //     title: 'Success',
            //     message: this.$t('tips.actionSuccess'),
            //     type: 'success',
            //     duration: 2000
            //   })
            //   this.dialogVisible = false
            // })
          } else {
            this.entity.createTimer = new Date()
            this.entity.createUser = store.getters.name
            this.entity.updateTime = new Date()
            this.entity.updateUser = store.getters.name
            console.log(this.entity)
            // InsertUser(this.entity).then(response => {
            //   this.tableData.unshift(this.entity)
            //   this.entity.id = response.data.key
            //   this.$notify({
            //     title: 'Success',
            //     message: this.$t('tips.actionSuccess'),
            //     type: 'success',
            //     duration: 2000
            //   })
            //   this.dialogVisible = false
            // })
          }
        }
      })
    }
  }
}
</script>
