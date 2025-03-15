// 收货地址相关 api
import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

// 获取默认使用的收货地址
export function getDefaultAddressAPI(){
	return httpOFGet("address/default")
}

// 获取当前用户所有的收货地址信息
export function getAllAddressAPI(){
	return httpOFGet("address/list")
}

// 修改当前某个收货地址信息
export function modifyAddressAPI(data){
	return httpOFPost("address/modify",data,false)
}

// 新增某个收货地址
export function addAddressAPI(data){
	return httpOFPost("address/add",data,false)
}

// 删除某个收货地址

export function deleteAddressAPI(id){
	return httpOFGet(`address/delete?id=${id}`)
}

// 切换默认收货地址
export function changeDefaultAddressAPI(newId,oldId){
	return httpOFGet(`address/changeDefault?newId=${newId}&oldId=${oldId}`)
}

// 更加id获取地址信息
export function getByIdAPI(id){
	return httpOFGet(`address/getById?id=${id}`)
}