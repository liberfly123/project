import axios from 'axios'
import qs from 'qs'
import devEnv from '@/config/dev.env'
import proEnv from '@/config/pro.env'
import { type AxiosRequestHeaders, type AxiosResponse } from 'axios'
import router from '@/router'

const server = axios.create({
  baseURL: import.meta.env.MODE == 'development' ? devEnv.BASE_URL : proEnv.BASE_URL,
  timeout: 5000
})

// 拦截器
server.interceptors.request.use(
  (config) => {
    // 转对象
    config.data = qs.parse(config.data)
    // 设置请求头
    config.headers = {
      'Content-Type': 'application/json;charset=uft-8'
      // 断言它是 AxiosRequestHeaders 类型，逃过类型检查
    } as AxiosRequestHeaders
    // 处理token
    const token: null | string = localStorage.getItem('token')
    if (token) {
      config.headers = {
        Authorization: token
        // 断言它是AxiosRequestHeaders类型，逃过类型检查
      } as AxiosRequestHeaders
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应器
server.interceptors.response.use(
  (config) => {
    // 响应成功
    if (config.status == 200 || config.status == 204) {
      // 断言它是 AxiosResponse 类型，逃过类型检查
      return Promise.resolve(config) as Promise<AxiosResponse<any, any>>
    } else {
      return Promise.reject(config)
    }
  },
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          console.error(
            '发出的请求有错误，服务器没有进行新建或修改数据的操作==>' + error.response.status
          )
          break
        case 401:
          console.error('token:登录失效==>' + error.response.status + ':')
          router.replace({
            path: '/login'
          })
          break
        case 403:
          console.error('登录信息已过期==>' + error.response.status)
          router.replace({
            path: '/login'
          })
          break
        case 404:
          console.error('网络请求不存在==>' + error.response.status)
          break
        case 406:
          console.error('请求的格式不可得==>' + error.response.status)
          break
        case 410:
          console.error('请求的资源被永久删除，且不会再得到的==>' + error.response.status)
          break
        case 422:
          console.error('当创建一个对象时，发生一个验证错误==>' + error.response.status)
          break
        case 500:
          console.error('服务器发生错误，请检查服务器==>' + error.response.status)
          break
        case 502:
          console.error('网关错误==>' + error.response.status)
          break
        case 503:
          console.error('服务不可用，服务器暂时过载或维护==>' + error.response.status)
          break
        case 504:
          console.error('网关超时==>' + error.response.status)
          break
        default:
          console.error('其他错误错误==>' + error.response.status)
      }

      return Promise.reject(error.message)
    } else {
      // 遇到未知的错误，抛出
      console.error('未知错误或网络超时')
    }
  }
)

// 导出server
export default server
