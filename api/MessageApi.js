import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

// 按照openid获取消息列表
export function getMessageByOpenidAPI(openid,type,pageInfo){
	let path = `message?openid=${openid}&type=${type}&pageIndex=${pageInfo.pageIndex}&pageSize=${pageInfo.pageSize}`
	return httpOFGet(path,false)
}

// 根据openid获取到当前未读消息数量
export function getNoReadMessageCountAPI(openid){
	return httpOFGet(`message/noReadCount?openid=${openid}`,false)
}

// 批量删除消息
export function deleteMessageAPI(ids){
	return httpOFPost(`message/delete?ids=${ids}`)
}

// 按照消息id查询消息 restFul风格
export function getMessageByIdAPI(id){
	return httpOFGet(`message/${id}`,false)
}

// 修改消息
export function modifyMessageAPI(data){
	return httpOFPost("message/update",data,false)
}


// 获取消息类型列表
export function getMessageTypeAPI(){
	return httpOFGet("messageType?messageState=0")
}

// 一键已读所有未读消息
export function readAllMessageAPI(){
	return httpOFPost("message/readAllMessage",null,false)
}

// 一键删除所有已读消息
export function deleteAllMessageHasReadedAPI(){
	return httpOFPost("message/deleteAllMessage",null,false)
}