<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.userName" size="small" placeholder="用户名" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button v-waves size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button v-waves v-permission="['developer','admin']" size="mini" class="filter-item" icon="el-icon-document-add" type="primary" @click="handleAdd"> 添加 </el-button>
    </div>

    <el-table v-loading="listLoading" size="small" :data="tableData" border style="width: 100%; margin-top: 20px;" fit highlight-current-row>
      <el-table-column label="Id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="UserName" align="center" width="110">
        <template slot-scope="{$index, row}">
          <!-- <span>{{ row.userName }}</span> -->
          <el-button size="mini" type="text" @click="handleEdit($index, row)">
            <mallki class-name="mallki-text" :text="(row.userName)" />
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-permission="['developer']" label="Password" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="NickName" align="center" width="110" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Mail" align="center" width="120" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.eMail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Active" align="center" width="90" :show-overflow-tooltip="true">
        <template slot-scope="{$index,row}">
          <el-switch v-model="row.active" active-color="#13ce66" inactive-color="#DCDFE6" @change="changeSwitch($index, row)" />
        </template>
      </el-table-column>
      <el-table-column v-permission="['developer']" label="Roles" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <el-tag v-for="item in row.rolesList" :key="item.id" type="success">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Introduction" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['developer']" label="Avatar" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.avatar }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CreateTime" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="UpdateTime" align="center" width="160" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{$index, row}">
          <el-button v-permission="['developer','admin']" icon="el-icon-edit-outline" type="primary" size="mini" @click="handleEdit($index, row)">编辑</el-button>
          <el-button v-permission="['developer','admin']" icon="el-icon-delete" type="danger" size="mini" @click="handleDelete($index, row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" size="small" :title="dialogType==='edit'?'Edit':'New'">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="用户基本信息" size="small" name="Tabs1">
          <el-form ref="dataForm" :rules="rules" :model="entity" size="small" label-width="80px" label-position="left" style="width: 420px; margin-left:40px;">
            <el-form-item prop="nickName" label="昵称">
              <el-input v-model="entity.nickName" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item prop="eMail" label="邮件">
              <el-input v-model="entity.eMail" placeholder="请输入邮箱地址" />
            </el-form-item>
            <el-form-item prop="userName" label="账号">
              <el-input v-model="entity.userName" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="entity.password" type="password" placeholder="请输入密码" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="用户权限信息" name="Tabs2">
          <el-form :model="entity" size="small" label-position="left" label-width="110px" style=" margin-left:50px;">
            <el-select v-model="selectRoles" placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
            <el-button v-waves size="small" style="background-color: #1890ff;color: #fff;" @click="handleAddUserRoles()">{{ $t('table.add') }} </el-button>
            <section>
              <el-table :data="entityRoles" size="mini" border style="width: 100%; margin-top: 20px;" fit highlight-current-row>
                <!-- <el-table-column label="Id" align="center">
                  <template slot-scope="{row}"> <span>{{ row.id }}</span> </template>
                </el-table-column>
                <el-table-column label="UserId" align="center">
                  <template slot-scope="{row}"> <span>{{ row.userId }}</span> </template>
                </el-table-column>-->
                <el-table-column label="Name" align="center">
                  <template slot-scope="{row}"> <span>{{ row.name }}</span> </template>
                </el-table-column>
                <el-table-column label="Description" align="center">
                  <template slot-scope="{row}"> <span>{{ row.description }}</span> </template>
                </el-table-column>
                <el-table-column label="Actions" align="center">
                  <template slot-scope="{row,$index}">
                    <el-button icon="el-icon-delete" type="danger" size="mini" @click="handleDeleteUserRoles(row,$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </section>

          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" size="mini" @click="confirmEntity">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getUser, addUser, updateUser, deleteUser } from '@/api/user'
import Mallki from '@/components/TextHoverEffect/Mallki' // hover text 文字效果

const defaultEntity = {
  id: undefined,
  userName: '',
  password: '',
  nickName: '',
  eMail: '',
  active: '',
  roles: [],
  rolesList: [],
  token: {
    id: undefined,
    userId: undefined,
    token: '',
    createTime: '',
    expireTime: ''
  },
  introduction: '',
  avatar: '',
  remark: '',
  params: '',
  attr1: '',
  createUser: '',
  createTime: '',
  updateUser: '',
  updateTime: ''
}

export default {
  name: 'User',
  components: { Mallki },
  data() {
    return {
      entity: Object.assign({}, defaultEntity),
      entityRoles: [],
      dialogVisible: false, // 弹窗显示bool
      dialogType: 'new',
      total: 0,
      tableData: [],
      listLoading: false,
      activeName: 'Tabs1', // tab
      selectRoles: undefined,
      roles: [{
        id: 1,
        userId: undefined,
        name: 'admin',
        description: '管理员'
      },
      {
        id: 2,
        userId: undefined,
        name: 'developer',
        description: '开发者'
      },
      {
        id: 3,
        userId: undefined,
        name: 'editor',
        description: '操作者'
      },
      {
        id: 4,
        userId: undefined,
        name: 'employee',
        description: '普通用户'
      }],
      listQuery: {
        page: 1,
        limit: 10,
        userName: ''
      },
      rules: {
        nickName: [{ required: true, message: 'Code is required', trigger: 'change' }],
        eMail: [{ required: true, message: 'Code is required', trigger: 'change' }],
        password: [{ required: true, message: 'Code is required', trigger: 'change' }],
        userName: [{ required: true, message: 'Code is required', trigger: 'change' }]
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
      getUser(this.listQuery).then(response => {
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
      // this.dialogVisible = true
      this.entity = Object.assign({}, defaultEntity)
      this.$router.push('/register')
    },
    handleEdit(index, row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.entity = this.deepClone(row)
      this.entityRoles = this.entity.rolesList
    },
    handleAddUserRoles() {
      this.roles.forEach(element => {
        if (element.name === this.selectRoles) {
          this.entityRoles.push({ id: element.id, userId: this.entity.id, name: element.name, description: element.description })
        }
      })
      this.selectRoles = null
    },
    handleDeleteUserRoles(row, index) {
      this.entityRoles.splice(index, 1)
    },
    handleDelete(index, row) {
      this.entity = this.deepClone(row)
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('tips.warning'), {
        confirmButtonText: this.$t('permission.confirm'),
        cancelButtonText: this.$t('permission.cancel'),
        type: 'warning'
      }).then(() => {
        deleteUser(this.entity).then(response => {
          this.tableData.splice(index, 1)
          this.$message({
            type: 'success',
            message: this.$t('tips.actionSuccess')
          })
          this.getList()
        })
      }).catch(() => {
      })
    },
    confirmEntity() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'edit') {
            this.entity.updateTime = new Date()
            this.entity.updateUser = this.$store.getters.userName
            updateUser(this.entity).then(response => {
              this.$notify({
                title: 'Success',
                message: response.data.message,
                type: 'success',
                duration: 2000
              })
              this.dialogVisible = false
            })
            this.getList()
          } else {
            this.entity.createTime = new Date()
            this.entity.createUser = this.$store.getters.userName
            this.entity.updateTime = new Date()
            this.entity.updateUser = this.$store.getters.userName
            addUser(this.entity).then(response => {
              this.$notify({
                title: 'Success',
                message: response.data.message,
                type: 'success',
                duration: 2000
              })
              this.dialogVisible = false
            })
            this.getList()
          }
        }
      })
    },
    // switch 开关更新
    changeSwitch(index, row) {
      this.entity = this.deepClone(row)
      this.entity.updateTime = new Date()
      this.entity.updateUser = this.$store.getters.userName
      updateUser(this.entity).then(response => {
        this.$notify({
          title: 'Success',
          message: response.data.message,
          type: 'success',
          duration: 2000
        })
        this.dialogVisible = false
        this.getList()
      })
    }
  }
}
</script>
