<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard' // 个人基本信息
import Activity from './components/Activity' // 个人工作todolist
import Account from './components/Account' // 修改个人信息
import { getUser } from '@/api/user'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Account },
  data() {
    return {
      user: {
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
      },
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.handleUser()
  },
  methods: {
    handleUser() {
      getUser({ userName: this.$store.getters.userName }).then(response => {
        response.data.items.forEach((item, index) => {
          this.user = item
          this.user.roles.join(' | ')
        })
      })
    }
  }
}
</script>
