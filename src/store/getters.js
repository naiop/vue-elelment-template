const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews, // TagsView
  cachedViews: state => state.tagsView.cachedViews, // Tagsview
  permission_routes: state => state.permission.routes, // 权限路由
  roles: state => state.user.roles, // 用户roles
  language: state => state.app.language
}
export default getters
