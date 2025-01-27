import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";

export function postReportAPI(data){
	return httpOFPost("report",data,false)
}

// 根据举报id获取举报信息
export function getReportByIdAPI(reportId){
	return httpOFGet((`report?id=${reportId}`))
}
// 根据举报id获取相关图片链接数组
export function getReportImgByReportIdAPI(reportId){
	return httpOFGet(`report/getImg?reportId=${reportId}`)
}