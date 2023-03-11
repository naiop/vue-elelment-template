<!-- need packages
  "vuedraggable": "^2.24.3",
"kuan-vue-flip-clock": "^1.0.1"
-->

<template>
  <div id="app-main" class="app-main">
    <!-- <iframe id="background" src="https://naiop.github.io/threejs/frame/examples/bg.html" /> -->
    <!-- 全屏 -->
    <div class="btn-fullscreen" @click="handleFullScreen">
      <el-tooltip
        effect="dark"
        :content="fullscreen ? `取消全屏` : `全屏`"
        placement="bottom"
      >
        <i class="el-icon-rank" />
      </el-tooltip>
    </div>
    <!-- 右键菜单 -->
    <div v-if="rightMenu" ref="app-rightMenu" class="menu" :style="{ left: left + 'px', top: top + 'px', width: '120px' }">
      <ul>
        <li class="hover">
          <div class="item">
            <i class="el-icon-s-grid" />
            <span class="label">布局</span>
          </div>
          <div class="app-size">
            <span class="size" @click="menuClick({ currentAppGridList }, '42')">4X2</span>
            <span class="size" @click="menuClick({ currentAppGridList }, '22')">2X2</span>
            <span class="size" @click="menuClick({ currentAppGridList }, '11')">1X1</span>
          </div>
        </li>
        <li class="hover" @click="menuClick({ currentAppGridList }, 'edit')">
          <div class="item">
            <i class="el-icon-edit" />
            <span class="label">编辑</span>
          </div>
        </li>
        <li class="hover" @click="menuClick({ currentAppGridList }, 'del')">
          <div class="item">
            <i class="el-icon-delete" />
            <span class="label">删除</span>
          </div>
        </li>
      </ul>
    </div>
    <!-- 时钟 -->
    <div class="clock-container">
      <flip-clock />
    </div>
    <!-- gridApp -->
    <div class="app-body">
      <draggable animation="300" group="people" class="app-grid" :list="defaultArray" @change="log">
        <template v-for="(item, index) in defaultArray">
          <div v-if="item.title !== '文件夹'" :key="index" class="app-item" :class="item.size" @contextmenu.prevent.stop="menuHandle($event, item)">
            <div class="app-icon" :style="item.bg_color | ColorFilter" @click="urlToHandle($event, item)">
              <span class="website-app text">{{ item.icon_text }}</span>
            </div>
            <div class="app-title">{{ item.title }}</div>
          </div>
          <div v-else-if="item.title === '文件夹'" :key="index" :class="item.size" style="background-color: aquamarine;">
            <draggable class="app-grid-folder" :list="defaultArray2" group="people" @change="log">
              <div v-for="(item2, index1) in defaultArray2" :key="index1">
                <div class="app-item" :class="item2.size" @contextmenu.prevent.stop="menuHandle($event, item2)">
                  <div class="app-icon" :style="item2.bg_color | ColorFilter" @click="urlToHandle($event, item)">
                    <span class="website-app text">{{ item2.icon_text }}</span>
                  </div>
                  <div class="app-title">{{ item2.title }}</div>
                </div>
              </div>
            </draggable>
          </div>
        </template>
      </draggable>
    </div>
    <!-- bottom -->
    <div style="display: flex; justify-content: center">
      <div class="app-bottom" />
    </div>
  </div>
</template>

<script>
import FlipClock from 'kuan-vue-flip-clock'
import draggable from 'vuedraggable' // 引入vuedraggable

export default {
  components: { draggable, FlipClock },
  filters: {
    // color 过滤
    ColorFilter(status) {
      var color = '#' + Math.random().toString(16).slice(-6)
      var style = 'background-color:' + color
      return style
    }
  },
  data() {
    return {
      openAddDialog: false,
      fullscreen: false,
      rightMenu: false,
      left: '',
      top: '',
      enabled: true,
      currentAppGridList: [],
      defaultArray2: [
        {
          id: '21',
          type: 'icon',
          size: 'icon-1X1',
          title: 'BOSS',
          url: 'https://www.zhipin.com',
          icon: '/website/1663055034446.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 90,
          position: 21,
          bg_color: null,
          status: null,
          desc: '让求职者与Boss直接开聊、加快面试、即时反馈。',
          icon_type: 'logo'
        }
      ],
      defaultArray: [
        {
          id: '1',
          type: 'box',
          size: 'icon-4X2',
          title: '文章收纳盒',
          url: 'undefined',
          icon: '',
          create_time: '2022-09-13 20:10:12',
          update_time: '2022-09-13 20:10:12',
          original_id: 1,
          position: 0,
          bg_color: 'background-color:#154280',
          status: 0,
          desc:
            '临时使用的多个网址，添加进收纳盒，方便快速使用，避免因打开网址过多而丢失',
          icon_type: 'bg_color'
        },
        {
          id: '2',
          type: 'folder',
          size: 'icon-2X2',
          title: '文件夹',
          url: null,
          icon: null,
          create_time: '2022-10-10 12:53:14',
          update_time: '2022-10-10 12:53:14',
          original_id: 16,
          position: 2,
          bg_color: 'background-color:#FBBF24',
          status: 1,
          desc: '常用网站可以利用文件夹进行分类管理',
          icon_type: 'bg_color',
          children: []
        },
        {
          id: '3',
          type: 'screensaver',
          size: 'icon-2X1',
          title: '屏保',
          url: null,
          icon: '',
          create_time: '2022-10-10 12:53:28',
          update_time: '2022-10-10 12:53:28',
          original_id: 6,
          position: 3,
          bg_color: 'background-color:#15803D',
          status: 0,
          desc:
            '离开电脑不想让被人看到你的电脑屏幕，一键打开个性化屏保小应用，支持自定义文字内容，自定义背景，让你的屏幕隐私安全且高大上',
          icon_type: 'bg_color'
        },
        {
          id: '4',
          type: 'sticker',
          size: 'icon-1X1',
          title: '贴纸',
          url: null,
          icon: '/app/1665377471432.svg',
          create_time: '2022-10-10 17:59:01',
          update_time: '2022-10-10 17:59:01',
          original_id: 2,
          position: 4,
          bg_color: null,
          status: 0,
          desc:
            '有想要做的事情，担心忘记，随时打开便签，快速记录，可以拖到页面任何位置，方便提醒，再也不用花钱买纸质便签啦。',
          icon_type: 'icon'
        },
        {
          id: '5',
          type: 'set',
          size: 'icon-1X1',
          title: '设置',
          url: null,
          icon: '/app/1665377497026.svg',
          create_time: '2022-10-10 17:59:07',
          update_time: '2022-10-10 17:59:07',
          original_id: 5,
          position: 5,
          bg_color: null,
          status: 0,
          desc: '系统设置',
          icon_type: 'icon'
        },
        {
          id: '6',
          type: 'market',
          size: 'icon-1X1',
          title: '应用市场',
          url: null,
          icon: '/app/1665377514117.svg',
          create_time: '2022-10-10 17:59:07',
          update_time: '2022-10-10 17:59:07',
          original_id: 7,
          position: 6,
          bg_color: null,
          status: 0,
          desc:
            '各种使用的小工具，各种常用的网站,都在这里，有了它就再也不愁找不到想要的网站，想要的工具，大大提高工作效率，更主要的是，可以一键添加到桌面。',
          icon_type: 'icon'
        },
        {
          id: '7',
          type: 'bookmark',
          size: 'icon-1X1',
          title: '书签管理',
          url: null,
          icon: '/app/1665377553008.svg',
          create_time: '2022-10-10 17:59:07',
          update_time: '2022-10-10 17:59:07',
          original_id: 9,
          position: 7,
          bg_color: null,
          status: 1,
          desc:
            '书签管理应用可以快速导入，浏览器书签并对其进行重新分类整理，统一在桌面显示，方便快速查找使用，可以大大提高使用效率。',
          icon_type: 'icon'
        },
        {
          id: '8',
          type: 'add',
          size: 'icon-1X1',
          title: '新增网站',
          url: null,
          icon: '/app/1665377570145.svg',
          create_time: '2022-10-10 17:59:07',
          update_time: '2022-10-10 17:59:07',
          original_id: 17,
          position: 8,
          bg_color: null,
          status: 0,
          desc: '添加自己想要的网站，随时记录',
          icon_type: 'icon'
        },
        {
          id: '9',
          type: 'icon',
          size: 'icon-1X1',
          title: '百度',
          url: 'https://www.baidu.com/',
          icon: '/website/1665381372629.svg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 1,
          position: 9,
          bg_color: null,
          status: null,
          desc: '全球最大的中文搜索网站',
          icon_type: 'logo'
        },
        {
          id: '10',
          type: 'icon',
          size: 'icon-1X1',
          title: '语雀',
          url: 'https://www.yuque.com',
          icon: '/website/1663064585280.png',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 6,
          position: 10,
          bg_color: null,
          status: null,
          desc:
            '十万阿里人都在用的笔记与文档知识库，面向企业、组织或个人，提供全新的体系化知识管理，打造轻松流畅的工作协同。',
          icon_type: 'logo'
        },
        {
          id: '11',
          type: 'icon',
          size: 'icon-1X1',
          title: 'Vue.js',
          url: 'https://cn.vuejs.org',
          icon: 'https://cn.vuejs.org/logo.svg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 10,
          position: 11,
          bg_color: null,
          status: null,
          desc: '渐进式 JavaScript 框架 | Vue.js',
          icon_type: 'logo'
        },
        {
          id: '12',
          type: 'icon',
          size: 'icon-1X1',
          title: '京东',
          url: 'https://www.jd.com',
          icon: '/website/1663054896745.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 29,
          position: 12,
          bg_color: null,
          status: null,
          desc:
            '专业的综合网上购物商城，为您提供正品低价的购物选择、优质便捷的服务体验。',
          icon_type: 'logo'
        },
        {
          id: '13',
          type: 'icon',
          size: 'icon-1X1',
          title: '腾讯视频',
          url: 'https://v.qq.com/',
          icon: '/website/1663054921187.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 31,
          position: 13,
          bg_color: null,
          status: null,
          desc:
            '致力于打造中国领先的在线视频媒体平台，以丰富的内容、极致的观看体验、便捷的登录方式、24小时多平台无缝应用体验以及快捷分享的产品特性，主要满足用户在线观看视频的需求。',
          icon_type: 'logo'
        },
        {
          id: '14',
          type: 'icon',
          size: 'icon-1X1',
          title: '芒果TV',
          url: 'https://www.mgtv.com',
          icon: '/website/1663054934958.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 33,
          position: 14,
          bg_color: null,
          status: null,
          desc: '大家都在看的在线视频网站-热门综艺最新电影电视剧在线观看',
          icon_type: 'logo'
        },
        {
          id: '15',
          type: 'icon',
          size: 'icon-1X1',
          title: '西瓜视频',
          url: 'https://www.ixigua.com/',
          icon: '/website/1663054971875.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 47,
          position: 15,
          bg_color: null,
          status: null,
          desc:
            '国内领先的中视频平台，它源源不断地为不同人群提供优质内容，让人们看到更丰富和有深度的世界，收获轻松的获得感，点亮对生活的好奇心。',
          icon_type: 'logo'
        },
        {
          id: '16',
          type: 'icon',
          size: 'icon-1X1',
          title: 'QQ音乐',
          url: 'https://y.qq.com/',
          icon: '/website/1663054984410.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 49,
          position: 16,
          bg_color: null,
          status: null,
          desc: '千万正版音乐海量无损曲库新歌热歌天天畅听的高品质音乐平台！',
          icon_type: 'logo'
        },
        {
          id: '17',
          type: 'icon',
          size: 'icon-1X1',
          title: 'CSDN',
          url: 'https://www.csdn.net/',
          icon: '/website/1663055086278.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 58,
          position: 17,
          bg_color: null,
          status: null,
          desc: '全球知名中文IT技术交流平台',
          icon_type: 'logo'
        },
        {
          id: '18',
          type: 'icon',
          size: 'icon-1X1',
          title: '极客时间',
          url: 'https://time.geekbang.org/',
          icon: '/website/1663055015540.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 79,
          position: 18,
          bg_color: null,
          status: null,
          desc:
            '致力于为用户提供前沿的IT技术、产品、运营资讯、摄影跑步等知识服务。',
          icon_type: 'logo'
        },
        {
          id: '19',
          type: 'icon',
          size: 'icon-1X1',
          title: '菜鸟教程',
          url: 'https://www.runoob.com/',
          icon: '/website/1663057479817.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 82,
          position: 19,
          bg_color: null,
          status: null,
          desc:
            '提供了编程的基础技术教程, 介绍了HTML、CSS、Javascript、Python，Java，Ruby，C，PHP , MySQL等各种编程语言的基础知识',
          icon_type: 'logo'
        },
        {
          id: '20',
          type: 'icon',
          size: 'icon-1X1',
          title: '掘金',
          url: 'https://juejin.cn/',
          icon: '/website/1663066509693.jpeg',
          create_time: '2022-10-10 17:59:39',
          update_time: '2022-10-10 17:59:39',
          original_id: 84,
          position: 20,
          bg_color: null,
          status: null,
          desc: '掘金是面向全球中文开发者的技术内容分享与交流平台',
          icon_type: 'logo'
        },
        {
          url: 'https://0b29ou.csb.app/',
          title: 'gzz',
          user: '',
          password: '',
          icon: '',
          icon_text: '鸽子',
          icon_type: 'bg_color',
          imageUrl: '',
          bg_color: 'background-color:#10B981',
          type: 'icon',
          size: 'icon-1X1',
          status: 1,
          id: '22'
        }
      ]
    }
  },
  created() {
    this.allClick() // 全局事件
    // this.defaultArray = this.$storage.get('appList') || this.defaultArray
  },
  methods: {
    log: function(evt) {
      window.console.log(evt)
    },
    allClick() {
      document.onclick = (event) => {
        this.rightMenu = false
      }
    },
    appGridList() {
      this.$storage.set('appList', this.defaultArray)
      this.$storage.get('appList')
    },
    color16() {
      // 十六进制颜色随机
      var r = Math.floor(Math.random() * 256)
      var g = Math.floor(Math.random() * 256)
      var b = Math.floor(Math.random() * 256)
      var color = '#' + r.toString(16) + g.toString(16) + b.toString(16)
      return color
    },
    menuHandle(event, item) {
      console.log('menuHandle', item, event)
      // 给left和top分别赋值为鼠标的位置,
      this.rightMenu = true
      this.left = event.pageX
      this.top = event.pageY
      this.currentAppGridList = []
      this.currentAppGridList.push(item)
    },
    urlToHandle(event, item) {
      console.log('urlToHandle', item, event)
      this.rightMenu = false
      if (item.url !== '' && item.url !== null) {
        window.open(item.url, '_blank')
      }
      switch (item.title) {
        case '设置':
          this.openAddDialog = true
          break

        default:
          break
      }
    },
    urlToMouseupHandle(event, item) {
      this.rightMenu = false
      console.log(event)
      console.log('urlToMouseupHandle')
      console.log(item)
      // window.location.href = item.url;
      // window.open(item.url, "_blank");
    },
    menuClick(v, t) {
      console.log(v, t)
      try {
        switch (t) {
          case 'del':
            console.log('del', v)
            this.$storage.remove('appList', v)
            for (let index = 0; index < this.defaultArray.length; index++) {
              if (
                this.defaultArray[index].title === this.currentAppGridList.title
              ) {
                this.defaultArray.splice(index, 1)
              }
            }

            break
          case '42':
            this.defaultArray.forEach(items => {
              if (items.id === v.currentAppGridList[0].id) {
                items.size = 'icon-4X2'
              }
            })
            break
          case '22':
            this.defaultArray.forEach(items => {
              if (items.id === v.currentAppGridList[0].id) {
                items.size = 'icon-2X2'
              }
            })
            break
          case '11':
            this.defaultArray.forEach(items => {
              if (items.id === v.currentAppGridList[0].id) {
                items.size = 'icon-1X1'
              }
            })
            break

          default:
            break
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 全屏事件
    handleFullScreen() {
      const element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  }
}
</script>

<style>
/* global styles */
/*全局样式*/
:root {
  --item-size: 55px;
  --item-gap-y: 30px;
  --item-gap-x: 30px;
  --icon-radius: 11px;
  --icon-bg-radius: 13px;
  --font-color: #333;
  --folder-bg: 255, 255, 255, 0.4;
}
</style>
<style lang="scss" scoped>
/* local styles */
*{
  padding: 0;
  margin: 0;
}
#background {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    border: none;
    pointer-events: none;
}
.app-main {
    position: relative;
    height: 100%;
    z-index: 1;
    display: flex;
    flex-flow: column;
    max-width: 1280px;
    height: calc(100vh - 350px);
    margin: 0 auto;
    padding-top: 50px;
}
.app-body{
    padding: 0 45px;
    height: 100%;
}
.app-grid-folder {
  display: grid;
  grid-template-columns: repeat(auto-fill,calc(var(--item-size) + var(--item-gap-y)));
  grid-template-rows: repeat(auto-fill,calc(var(--item-size) + var(--item-gap-x)));
  grid-auto-flow: dense;
  justify-content: center;
  box-sizing: border-box;
  }
.app-grid {
  margin: 60px;
  display: grid;
  grid-template-columns: repeat(auto-fill,calc(var(--item-size) + var(--item-gap-y)));
   grid-template-rows: repeat(auto-fill,calc(var(--item-size) + var(--item-gap-x)));
  grid-auto-flow: dense;
  justify-content: center;
  box-sizing: border-box;
  }

.app-item {
    width: calc(var(--item-size) + var(--item-gap-x));
    height: calc(var(--item-size) + var(--item-gap-y));
    padding: 0 calc(var(--item-gap-y)/2) calc(var(--item-gap-x));
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
}
.icon-2X1 {
    grid-column: span 2;
    grid-row: span 1;
    width: calc(var(--item-size)*2 + var(--item-gap-y)*2);
    height: calc(var(--item-size)*1 + var(--item-gap-x)*1);
}
.icon-2X2 {
    grid-column: span 2;
    grid-row: span 2;
    width: calc(var(--item-size)*2 + var(--item-gap-y)*2);
    height: calc(var(--item-size)*2 + var(--item-gap-x)*2);
}
.icon-4X2 {
    grid-column: span 4;
    grid-row: span 2;
    width: calc(var(--item-size)*4 + var(--item-gap-y)*4);
    height: calc(var(--item-size)*2 + var(--item-gap-x)*2);
}
.app-icon {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: var(--icon-bg-radius);
    background-color: #fff;
}
.app-box-icon {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.app-title {
    font-size: 12px;
    color: var(--color);
    text-align: center;
    padding-top: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.app-grid .app-item .app-icon .website-app {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.app-grid .app-item .app-icon .website-app .text {
    color: #fff;
    font-size: 12px;
    text-align: center;
}

/* ———————————————— */

li, ul {
    list-style: none;
}
.menu {
    position: fixed;
    border-radius: 8px;
    z-index: 999;
    padding: 5px 4px;
    background-color: #0b0b0bcc;
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    box-shadow: 0 2px 8px #0000004d;
    border: 1px solid rgba(11,11,11,.2);
  }

.menu ul li {
    transition: background .2s;
    font-size: 12px;
    color: #fff;
    padding: 0 4px;
    cursor: pointer;
    margin: 4px 0;
    border-radius: 6px;
}
.menu ul li .item {
    padding: 4px 0;
}
.menu ul li .app-size {
    padding-left: 24px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.menu ul li .app-size .size {
    border-radius: 12px;
    padding: 2px 8px;
    margin: 4px 0;
    display: inline-block;
    background-color: hsla(0,0%,100%,.10588235294117647);
}
.menu ul li .label {
    margin-left: 10px;
    vertical-align: middle;
}

.menu ul li :hover {
    background-color: rgba(255, 255, 255, 0.4);
    position: relative;
    box-shadow: 0 5px 15px rgba(20, 20, 20, 0.8);
    display   : flex;
    border-radius: 5px;
    align-items: center;
    backdrop-filter: blur(50px);
}

/* ———————————————— */
.clock-container {
    font: normal 12px 'Helvetica Neue', Helvetica, sans-serif;
    user-select: none;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }

.app-bottom{
    overflow: hidden;
    cursor: pointer;
    max-height: 60px;
    transition: .3s;
    line-height: 20px;
    background-color: transparent;
    color: #27d564;
    position: fixed;
    bottom:10px;
}

</style>
