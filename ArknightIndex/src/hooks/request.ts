import req from '@/utils/require'

export class Request {
  // get请求
  static async getData(url: string) {
    return await req.get(url)
  }
  // post请求
  static async postData(url: string, data: object) {
    return await req.post(url, data)
  }
  // put请求，修改数据
  static async putData(url: string, data: object) {
    return req.put(url, data)
  }
  // delete请求，删除数据
  static async delData(url: string, data: object) {
    return req.delete(url, data)
  }
}
