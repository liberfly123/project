import req from "@/utils/require";

export class Request {
	// get请求
	static async getData(url) {
		return await req.get(url);
	}
	// postqin
	static async postData(url, data) {
		return await req.post(url, data);
	}
	//put请求
	static async putData(url, data) {
		return await req.put(url, data);
	}
	// delete请求可以通过config中的query向后端发送请求数据
	static async delData(url, config) {
		return await req.delete(url, config);
	}
}
