# vue-admin-template

> 这是一个极简的 vue admin 管理后台。它只包含了 Element UI & axios & iconfont & permission control & lint，这些搭建后台必要的东西。

目前版本为 `v4.0+` 基于 `vue-cli` 进行构建


## Extra

根据用户角色来动态生成侧边栏和 router，

## Follow

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)



## Build Setup

```bash
# 克隆项目
git clone https://github.com/......

# 进入项目目录
cd vue-admin-template

# 安装依赖
npm install


# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
