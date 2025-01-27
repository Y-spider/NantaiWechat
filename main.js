import App from './App'
const baseURl = "https://www.chopper.love"
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$baseImageUrl = baseURl+":6134/"
Vue.prototype.$baseDocumentImageUrl = baseURl+":6135/"
Vue.prototype.$fileUploadPath = baseURl+':39001/document/uploadFile'
Vue.prototype.$fileDownloadPath = baseURl+":39001/document/downloadFile"
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