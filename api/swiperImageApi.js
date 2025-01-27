import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

// 获取轮播图，采取分页
export function listSwiperImageWithPageAPI(pageSize){
	return httpOFGet(`swiper/list/wechat?pageIndex=1&pageSize=${pageSize}`)
}