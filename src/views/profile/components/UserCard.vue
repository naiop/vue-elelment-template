<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>{{ $t('permission.aboutMe') }}</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <img :src="require('@/assets/avatar/avatar.gif')" title="点击上传头像" class="img-circle img-lg">
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.userName }}</div>
        <div class="user-role text-center text-muted">{{ user.roles }}</div>
      </div>
    </div>

    <div class="user-info">
      <ul class="list-group list-group-striped">
        <li class="list-group-item">
          <svg-icon icon-class="user" />
          <span class="pull-right text-muted">用户名称</span>
          <div class="right">{{ user.userName }}</div>
        </li>
        <li class="list-group-item">
          <svg-icon icon-class="mail" />
          <span class="pull-right text-muted">用户邮箱</span>
          <div class="right">{{ user.eMail }}</div>
        </li>
        <li class="list-group-item">
          <svg-icon icon-class="user" />
          <span class="pull-right text-muted">个人简介</span>
          <div class="right">{{ user.introduction }}</div>
        </li>
        <li class="list-group-item">
          <svg-icon icon-class="time" />
          <span class="pull-right text-muted">创建日期</span>
          <div class="right">{{ user.createTime }}</div>
        </li>
      </ul>
    </div>

  </el-card>
</template>

<script>
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
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.list-group-striped > .list-group-item {
	border-left: 0;
	border-right: 0;
	border-radius: 0;
	padding-left: 0;
	padding-right: 0;
}

.list-group {
	padding-left: 0px;
	list-style: none;
}

.list-group-item {
	border-bottom: 1px solid #e7eaec;
	border-top: 1px solid #e7eaec;
	margin-bottom: -1px;
	padding: 11px 0px;
	font-size: 13px;
}
.pull-right {
    margin-left: 15px;
    margin-top: 10px;
}
.right {
    font-weight: bold;
    margin-top: 10px;
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }
  .text-center {
    text-align: center;
}

  .box-center {
    padding-top: 20px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }
}

.user-info {
  margin-top: 80px;
}
.img-circle {
      cursor: pointer;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      float: left;
      background-color: cadetblue;
}
</style>
