(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6eddc6e8"],{"1bc8":function(e,t,n){},"3f5e":function(e,t,n){"use strict";n.d(t,"c",(function(){return a})),n.d(t,"e",(function(){return l})),n.d(t,"f",(function(){return c})),n.d(t,"d",(function(){return r})),n.d(t,"b",(function(){return u})),n.d(t,"a",(function(){return d}));n("d3b7");var i=n("b775"),s=n("bc3a"),o=n.n(s);function a(e){return Object(i["a"])({url:"/Admin/Ftp/GetFtpItems",method:"post",data:e})}function l(e){return Object(i["a"])({timeout:6e4,url:"/Admin/Ftp/UpLoadFile",method:"post",data:e})}function c(e,t){return new Promise((function(n,i){o()({baseURL:"/prod-api",method:"Post",headers:{},url:"/Admin/UploadFile/UpLoadFile",params:t,data:e}).then((function(e){n(e.data)})).catch((function(e){i(e)}))}))}function r(e){return Object(i["a"])({url:"/Admin/UploadFile/GetUploadFileList",method:"post",data:e,params:e})}function u(e){return new Promise((function(t,n){o()({baseURL:"/prod-api",method:"Post",headers:{},url:"/Admin/UploadFile/DownloadFile",params:{},data:e,responseType:"blob"}).then((function(e){t(e)})).catch((function(e){n(e)}))}))}function d(e){return Object(i["a"])({url:"/Admin/UploadFile/DeleteFile",method:"delete",data:e})}},4111:function(e,t,n){},"6b48":function(e,t,n){"use strict";n("1bc8")},8371:function(e,t,n){"use strict";n("4111")},d30a:function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("div",{staticClass:"filter-container"},[n("el-upload",{ref:"upload1",staticClass:"upload-demo",attrs:{action:"/Admin/UploadFile/UpLoadFile",disabled:e.disabledUpload,"auto-upload":!1,"on-change":e.changeFile,"on-error":e.fileErr,"on-exceed":e.handleExceed,"file-list":e.fileList1,"before-upload":e.beforeAvatarUpload,"on-success":e.msgSuccessOne,data:e.fileData,"list-type":"picture",drag:"","show-file-list":!1,multiple:!0,limit:1e3}},[n("i",{staticClass:"el-icon-upload"}),n("div",{staticClass:"el-upload__text",staticStyle:{"margin-top":"-10px","line-height":"20px"}},[e._v(" 将文件拖到此处，"),e.disabledUpload?n("em",[e._v("（文件正在上传中，请等待...）")]):n("em",[e._v("或点击上传(单个文件需小于100M,一次最多上传1000个文件)")])])]),n("div",[e.showPercent?n("el-button",{staticStyle:{"margin-left":"10px"},attrs:{size:"small",type:"success"},on:{click:e.submitAbort}},[e._v("取消后续文件上传")]):e._e()],1),e.showPercent?n("div",{staticStyle:{color:"orange"}},[e._v("上传过程请勿刷新浏览器和跳转其他页面...")]):e._e(),e.showPercent?n("el-progress",{attrs:{percentage:Number((100*e.percentNow/e.percentTotal).toFixed(0))}}):e._e()],1),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],staticStyle:{width:"100%","margin-top":"30px"},attrs:{data:e.DataList,size:"small",border:""}},[n("el-table-column",{attrs:{align:"center",label:"Id",width:"90"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[e._v(" "+e._s(n.id))]}}])}),n("el-table-column",{attrs:{align:"center",label:"UserId"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[e._v(" "+e._s(n.userId))]}}])}),n("el-table-column",{attrs:{align:"center",label:"FileName"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[e._v(" "+e._s(n.fileName)+" ")]}}])}),n("el-table-column",{attrs:{label:"UploadTime",align:"center","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.row;return[n("span",[e._v(e._s(e._f("parseTime")(i.uploadTime,"{y}-{m}-{d} {h}:{i}")))])]}}])}),n("el-table-column",{attrs:{align:"center",label:"操作","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){return e.handleDownload(t)}}},[e._v(" 下载 ")]),n("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(n){return e.handleDelete(t)}}},[e._v(" 删除")])]}}])})],1),n("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.listQuery.page,limit:e.listQuery.limit},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},"update:limit":function(t){return e.$set(e.listQuery,"limit",t)},pagination:e.getList}})],1)},s=[],o=n("b85c"),a=n("c7eb"),l=n("1da1"),c=(n("b0c0"),n("d3b7"),n("3ca3"),n("ddb0"),n("2b3d"),n("9861"),n("3f5e")),r={name:"UploadFile",data:function(){return{fileNum:"",upFileList:"",percentTotal:0,percentNow:0,showDesc:"",showPercent:!1,time:null,disabledUpload:!1,fileData:{},fileList1:[],listLoading:!1,total:0,DataList:[],listQuery:{page:1,limit:10,configName:"Roles",userId:0,active:!0}}},beforeCreate:function(){console.log("beforeCreate()")},created:function(){console.log("created()"),this.getList()},beforeMount:function(){console.log("beforeMount()")},mounted:function(){var e=this;console.log("mounted()"),this.intervalId=setInterval((function(){console.log("-----"),e.isShow=!e.isShow}),1e3)},beforeUpdate:function(){console.log("beforeUpdate()")},updated:function(){console.log("updated()")},beforeDestroy:function(){console.log("beforeDestroy()"),clearInterval(this.intervalId)},destroyed:function(){console.log("destroyed()")},methods:{destroyVue:function(){this.$destroy()},getList:function(){var e=this;return Object(l["a"])(Object(a["a"])().mark((function t(){return Object(a["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.listLoading=!0,Object(c["d"])(e.listQuery).then((function(t){e.DataList=t.data.items,e.total=t.data.total,e.listLoading=!1})).catch((function(){e.listLoading=!1}));case 2:case"end":return t.stop()}}),t)})))()},handleExceed:function(e,t){console.log("当前限制一次性最多上传1000个文件",e,t),this.$message.warning("当前限制一次性最多上传1000个文件")},changeFile:function(e,t){var n=this;this.disabledUpload=!0,console.log("changeFile",e,t);var i=e.size/1024/1024<100;i||this.$message.warning("上传文件大小不能超过 100M"),this.upFileList=[];var s,a=Object(o["a"])(t);try{for(a.s();!(s=a.n()).done;){var l=s.value;l.raw&&l.size/1024/1024<100&&(this.upFileList.push(l.raw),this.percentTotal=this.upFileList.length,this.percentNow=0,this.showPercent=!1,this.showDesc="")}}catch(c){a.e(c)}finally{a.f()}clearTimeout(this.time),this.time=setTimeout((function(){n.time=null,console.log("防抖 高频触发后n秒内只会执行一次  再次触发重新计时"),n.fnBegin()}),1500)},fnBegin:function(){console.log("此时change了所有文件 开始上传",this.upFileList),this.submitUpload2()},submitUpload2:function(){var e=this;if(!(this.upFileList.length>0))return this.disabledUpload=!1,this.showPercent=!1,this.upFileList=[],this.$refs.upload1.clearFiles(),this.fileList1=[],this.percentNow===this.percentTotal&&this.percentTotal?(this.$message.success(this.showDesc?this.showDesc:"已全部上传成功！"),this.percentTotal=0,this.percentNow=0,this.showDesc=""):this.percentNow===this.percentTotal&&0===this.percentTotal?(this.$message.warning("请先选择文件！"),this.percentTotal=0,this.percentNow=0):(this.$message.success("已部分上传成功，且取消后续文件上传！"),this.percentTotal=0,this.percentNow=0),this.getList(),!1;this.showPercent=!0,this.fileNum=new FormData,this.fileNum.append("file",this.upFileList[0]),this.fileNum.append("name",this.upFileList[0].name);var t=this;Object(c["f"])(this.fileNum).then((function(n){e.percentNow=e.percentNow+1,e.upFileList.shift(),console.log("上传返回",n),n.data.success||(t.$message({message:n.data.return_message||"上传失败",type:"error"}),e.showDesc="上传结束，部分文件上传失败"),e.submitUpload2()})).catch((function(n){console.log(n),t.$message({message:n||"上传失败",type:"error"}),e.percentNow=e.percentNow+1,e.upFileList.shift(),e.showDesc="上传结束，部分文件上传失败",e.submitUpload2()}))},submitAbort:function(){this.showPercent=!1,this.upFileList=[]},fileErr:function(e,t,n){this.$message({message:t.name+"上传失败",type:"error"})},beforeAvatarUpload:function(e){console.log("上传文件前",e)},msgSuccessOne:function(e,t,n){console.log("成功",t)},handleDelete:function(e){var t=this;Object(c["a"])(e.row).then((function(e){t.$message({type:"success",message:t.$t("tips.actionSuccess")}),t.getList()}))},handleDownload:function(e){var t=this;Object(c["b"])(e.row).then((function(e){console.log(e);var t=document.createElement("a"),n=document.createEvent("HTMLEvents");n.initEvent("click",!0,!0),t.download=decodeURI(e.headers.filename),t.href=URL.createObjectURL(e.data),t.dispatchEvent(n),t.click()})).catch((function(e){t.$message({type:"error",message:t.$t(e)})})).finally((function(){t.$message({type:"success",message:t.$t("download success")})}))}}},u=r,d=(n("6b48"),n("8371"),n("2877")),p=Object(d["a"])(u,i,s,!1,null,"ca22a12c",null);t["default"]=p.exports}}]);