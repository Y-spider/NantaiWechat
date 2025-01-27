import {httpOFGet,httpOfGetWithNotToken,httpOFPost} from "../pages/js/globalRequest.js";
export function loginClassAPI(data){
	return httpOFPost("login",data)
}