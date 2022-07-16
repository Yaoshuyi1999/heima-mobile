import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // 请求根路径
  baseURL: 'http://toutiao.itheima.net',
  timeout: 3000
})

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = store.state.user.token
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 相应拦截器

export default request
