import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

export function getPostByTypeAPI(type,pageIndex,pageSize,typeSecond='all'){
	return httpOFGet("post/getByType?type="+type+"&pageIndex="+pageIndex+"&pageSize="+pageSize+"&typeSecond="+typeSecond,false)
}

export function getPostBySearchAPI(conten,pageIndex,pageSize){
	return httpOFGet("post/listByLike?content="+conten+"&pageIndex="+pageIndex+"&pageSize="+pageSize,false)
}