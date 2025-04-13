import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

// 分页获取使用指南
export function getUseGuideWithPageAPI(pageIndex,pageSize){
	return httpOFGet(`back/guide/listAll?pageIndex=${pageIndex}&pageSize=${pageSize}`)
}