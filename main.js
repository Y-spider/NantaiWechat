import App from './App'
// 线上环境
// const baseURl = "https://www.chopper.love"
// 开发环境
const baseURl = "http://127.0.0.1"

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$baseImageUrl = baseURl+":6134/"
Vue.prototype.$baseDocumentImageUrl = baseURl+":6135/"
// 开发环境
// Vue.prototype.$fileUploadPath = baseURl+':8888/document/uploadFile'
// 线上环境
Vue.prototype.$fileUploadPath = baseURl+':39001/api/document/uploadFile'
// 开发环境
// Vue.prototype.$fileDownloadPath = baseURl+":8888/document/downloadFile"
// 线上环境
Vue.prototype.$fileDownloadPath = baseURl+":39001/api/document/downloadFile"
Vue.prototype.$messageTypeIconPath = baseURl
Vue.prototype.$baseSwiperImageUrl = baseURl + ":6136/"

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif