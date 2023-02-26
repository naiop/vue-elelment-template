<template>
  <div>
    <el-form>
      <el-form-item :label="$t('permission.nickName')">
        <el-input v-model.trim="user.nickName" />
      </el-form-item>
      <el-form-item :label="$t('login.username')">
        <el-input v-model.trim="user.userName" />
      </el-form-item>
      <el-form-item :label="$t('login.password')">
        <el-input v-model.trim="user.password" />
      </el-form-item>
      <el-form-item :label="$t('permission.eMail')">
        <el-input v-model.trim="user.eMail" />
      </el-form-item>
      <el-form-item :label="$t('permission.introduction')">
        <el-input v-model.trim="user.introduction" />
      </el-form-item>
    </el-form>
    <el-row>
      <el-button type="primary" size="mini" @click="submit">Update</el-button>
    </el-row>
  </div>
</template>

<script>
import { updateUser } from '@/api/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: undefined,
          userName: '',
          password: '',
          nickName: '',
          eMail: '',
          active: true,
          roles: [],
          rolesList: '',
          token: {
            id: '',
            userId: '',
            toekn: '',
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
      }
    }
  },
  methods: {
    submit() {
      updateUser(this.user).then(response => {
        this.$message({
          message: response.data.message,
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
