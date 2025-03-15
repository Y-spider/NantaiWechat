// 与支付有关的接口
import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

// 获取预支付id
export function getPrePayIdAPI(id){
	return httpOFGet(`pay/getPrepayId?id=${id}`)
}
// 其他方式支付
export function payOrderOtherAPI(payMethod,id){
	return httpOFPost(`pay/other?postId=${id}&payMethod=${payMethod}`)
}
