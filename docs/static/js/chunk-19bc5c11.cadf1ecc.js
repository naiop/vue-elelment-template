(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-19bc5c11"],{"1fd6":function(e,t,o){"use strict";o.r(t);var s=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"dashboard-container"},[o("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.handdleMsg}},[e._v("submit")]),o("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.handdleRoute}},[e._v("testRoute")]),o("div",{staticClass:"dashboard-text"},[e._v("roles: "+e._s(e.roles))])],1)},n=[],a={name:"Dashboard",roles:"roles",data:function(){return{roles:""}},computed:{},methods:{handdleMsg:function(e){var t=this;console.log(t.global.ws),t.global.ws&&1===t.global.ws.readyState&&(console.log("发送信息",e),t.global.ws.send(e)),t.global.ws.onmessage=function(e){console.log("收到服务器内容",e),t.roles=e.data}},handdleRoute:function(e){this.$router.push("/register")}}},l=a,c=(o("771c"),o("2877")),r=Object(c["a"])(l,s,n,!1,null,"35e5165d",null);t["default"]=r.exports},"4e5e":function(e,t,o){},"771c":function(e,t,o){"use strict";o("4e5e")}}]);