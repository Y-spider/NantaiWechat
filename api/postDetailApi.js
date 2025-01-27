import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

export function getImageUrlAPI(postId){
	return httpOFGet("post/getPostImage?postId="+postId)
};

export function postCommnetAPI(data){
	return httpOFPost("comment",data,true)
};

export function getCommentAPI(pageIndex,pageSize,postId,parentId){
	return httpOFGet("comment/page?pageIndex="+pageIndex+"&pageSize="+pageSize+"&postId="+postId+"&parentId="+parentId)
}

export function batchUpdateCommentAPI(data){
	return httpOFPost("comment/batchUpdateComment",data,false)
}
// 根据评论id删除评论
export function deleteCommentByCommentIdAPI(commentId){
	return httpOFGet(`comment/delete?commentId=${commentId}`,false)
}