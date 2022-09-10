<template>
  <div>
    <center><h3>注册</h3>
      <div class="userContent">
        <el-form ref="form" :model="listQuery" :rules="rules" label-width="80px">
          <el-form-item prop="name" label="姓名">
            <el-input v-model="listQuery.name" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item prop="username" label="账号名称">
            <el-input v-model="listQuery.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input v-model="listQuery.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="checkPass" label="确认密码">
            <el-input v-model="listQuery.checkPass" type="password" placeholder="请再次输入密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit()">确定</el-button>
            <el-button @click="onCancle">返回登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </center>
  </div>
</template>

<script>
import { register } from '@/api/user'
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length <= 5) {
          callback(new Error('用户名请保持6位数以上'))
        }
        if (this.listQuery.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.listQuery.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      listQuery: {
        name: '',
        username: '',
        password: '',
        checkPass: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        username: [
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
          register(this.listQuery).then(response => {
            if (response.data === '注册成功') {
              this.$message(response.data)
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
      this.listQuery.name = ''
      this.listQuery.username = ''
      this.listQuery.password = ''
      this.listQuery.checkPass = ''
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
