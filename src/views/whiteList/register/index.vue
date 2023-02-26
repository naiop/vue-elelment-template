<template>
  <div>
    <center><h3>注册</h3>
      <div class="userContent">
        <el-form ref="form" size="small" :model="listQuery" :rules="rules" label-width="80px">
          <el-form-item prop="nickName" label="姓名">
            <el-input v-model="listQuery.nickName" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item prop="eMail" label="邮件">
            <el-input v-model="listQuery.eMail" placeholder="请输入邮箱地址" />
          </el-form-item>
          <el-form-item prop="userName" label="账号">
            <el-input v-model="listQuery.userName" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input v-model="listQuery.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="checkPass" label="确认密码">
            <el-input v-model="checkPass" type="password" placeholder="请再次输入密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit()">{{ $t('table.confirm') }}</el-button>
            <el-button @click="onCancle">{{ $t('table.back') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </center>
  </div>
</template>

<script>
import { addUser } from '@/api/user'
export default {
  data() {
    var validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名)'))
      } else if (value.length <= 3) {
        callback(new Error('用户名请保持4位数以上'))
      }
      callback()
    }
    var validateeMail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱)'))
      } else if (!value.includes('@')) {
        callback(new Error('请输入正确的邮箱地址'))
      }
      callback()
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length <= 5) {
          callback(new Error('用户名请保持6位数以上'))
        }
        if (this.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (this.checkPass !== this.listQuery.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      checkPass: '',
      rolesList: {
        id: 0,
        userId: 0,
        name: 'editor',
        description: '普通用户'
      },
      listQuery: {
        id: 0,
        userName: '',
        password: '',
        nickName: '',
        eMail: '',
        active: true,
        roles: [],
        rolesList: [],
        token: {
          id: 0,
          userId: 0,
          token: '',
          createTime: undefined,
          expireTime: undefined
        },
        introduction: '',
        avatar: 'avatar.gif',
        remark: '',
        params: '',
        attr1: '',
        createUser: 'Register',
        createTime: undefined,
        updateUser: 'Register',
        updateTime: undefined

      },
      rules: {
        nickName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        eMail: [
          { required: true, validator: validateeMail, trigger: 'blur' }
        ],
        userName: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.listQuery.roles.push(this.rolesList.name)
          this.listQuery.rolesList.push(this.rolesList)
          this.listQuery.token.createTime = new Date()
          this.listQuery.token.expireTime = new Date()
          this.listQuery.createTime = new Date()
          this.listQuery.updateTime = new Date()
          addUser(this.listQuery).then(response => {
            if (response.code === 20000) {
              this.$message.success(response.message)
              this.$router.push({ path: '/' })
            }
          }).catch((err) => {
            this.$message.error(err)
          })
        } else {
          this.$message.error('输入信息校验失败')
        }
      })
    },
    onCancle() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style>
	.crumbs-register {
		background-color: #324157;
		height: 50px;
		line-height: 50px;
	}
	.register-title {
		line-height: 50px;
		margin: 0 auto;
	width: 50px;
    font-size: 16px;
	}
	.userContent {
		width: 400px;
		margin: 0 auto;
	}
	.select-sex {
		width: 320px;
	}
</style>

<style lang="scss" scoped>
// a标签样式
	.register-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
	}

</style>
