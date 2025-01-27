import {httpOFPost,httpOFGet,httpOfGetWithNotToken} from "../pages/js/globalRequest.js"

export function modifyUserInfoAPI(path,data){
	return httpOFPost(path,data)
}