<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.configName" size="small" placeholder="name" clearable style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.userId" size="small" placeholder="userId" clearable style="width: 200px;" class="filter-item" />
      <el-switch v-model="listQuery.active" inactive-text="是否启用" class="filter-item" />
      <el-button v-waves class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="getList"> 查询 </el-button>
      <el-button v-waves class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="handleAddConfig"> 添加 </el-button>
    </div>

    <el-table :data="ConfigList" size="small" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Id" width="60">
        <template slot-scope="{row}">  {{ row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="userId" width="100">
        <template slot-scope="{row}"> {{ row.userId }}</template>
      </el-table-column>
      <el-table-column align="center" label="configName" width="100">
        <template slot-scope="{row}"> {{ row.configName }} </template>
      </el-table-column>
      <el-table-column align="center" label="paramName" width="180">
        <template slot-scope="{row}">  {{ row.paramName }} </template>
      </el-table-column>
      <el-table-column align="center" label="paramValue" width="180">
        <template slot-scope="{row}"> {{ row.paramValue }} </template>
      </el-table-column>
      <el-table-column align="header-center" label="active" :show-overflow-tooltip="true" width="160">
        <!-- <template slot-scope="{row}"> {{ row.active }} </template> -->
        <template slot-scope="{$index,row}">
          <el-switch v-model="row.active" active-color="#13ce66" inactive-color="#DCDFE6" @change="changeSwitch($index, row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)"> 编辑 </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" size="small" :title="dialogType==='edit'?'Edit Config':'New Config'">
      <el-form ref="dataForm" :model="config" size="small" :rules="rules" label-width="110px" label-position="left" style="width: 420px; margin-left:40px;">
        <el-form-item label="name" prop="configName">
          <el-input v-model="config.configName" placeholder="类型名称" />
        </el-form-item>
        <el-form-item label="paramName" prop="paramName">
          <el-input v-model="config.paramName" placeholder="参数名称" />
        </el-form-item>
        <el-form-item label="paramValue" prop="paramValue">
          <el-input v-model="config.paramValue" placeholder="参数值" />
        </el-form-item>
        <el-form-item label="active">
          <el-switch v-model="config.active" active-color="#13ce66" inactive-color="#DCDFE6" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" size="mini" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" size="mini" @click="confirmConfig">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getConfig } from '@/api/config'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

const defaultConfig = {
  id: undefined,
  userId: undefined,
  configName: '',
  paramName: '',
  paramValue: '',
  active: true,
  createUser: '',
  createTime: undefined,
  updateUser: '',
  updateTime: undefined
}

export default {
  name: 'Config',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      total: 0,
      config: Object.assign({}, defaultConfig),
      ConfigList: [],
      dialogVisible: false,
      dialogType: 'new',
      listQuery: {
        page: 1,
        limit: 10,
        configName: 'Roles',
        userId: 0,
        active: true
      },
      rules: {
        configName: [{ required: true, message: 'Name is required', trigger: 'change' }],
        paramName: [{ required: true, message: 'ParamName is required', trigger: 'change' }],
        paramValue: [{ required: true, message: 'ParamValue is required', trigger: 'change' }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      getConfig(this.listQuery).then(res => {
        this.ConfigList = res.data.items
        this.total = res.data.total
      })
    },
    handleAddConfig() {
      this.config = Object.assign({}, defaultConfig)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    changeSwitch(index, row) {

    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.config = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm(this.$t('action.confirmRemove', { 'name': row.name }), 'Warning', {
        confirmButtonText: this.$t('action.confirm'),
        cancelButtonText: this.$t('action.cancel'),
        type: 'warning'
      }).then(async() => {
        // delete TODO
        this.$message({
          type: 'success',
          message: 'Delete succed!'
        })
      }).catch(err => {
        console.error(err)
      })
    },
    async confirmConfig() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {

            // update TODO
          } else {
            // add TODO
          }
          this.dialogVisible = false
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: `
                  <div>Role Key: ${'123'}</div>
                  <div>Role Name: ${'ok'}</div>
                  <div>Description: ${'test'}</div>
                `,
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

