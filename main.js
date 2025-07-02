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
Vue.prototype.$socketUrl = "//127.0.0.1:8888"
Vue.prototype.$baseImageUrl = baseURl+":6134/"
Vue.prototype.$baseDocumentImageUrl = baseURl+":6135/"
Vue.prototype.$baseSwiperImageUrl = baseURl + ":6136/"
// 线上环境
// Vue.prototype.$fileUploadPath = baseURl+':39001/api/document/uploadFile'
// Vue.prototype.$fileDownloadPath = baseURl+":39001/api/document/downloadFile"
// Vue.prototype.$messageTypeIconPath = baseURl
// Vue.prototype.$baseSwiperImageUrl = baseURl + ":6136/"
// 开发环境
// Vue.prototype.$socketUrl = baseURl + ":8888"
Vue.prototype.$fileUploadPath = baseURl+':8888/document/uploadFile'
Vue.prototype.$fileDownloadPath = baseURl+":8888/document/downloadFile"

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