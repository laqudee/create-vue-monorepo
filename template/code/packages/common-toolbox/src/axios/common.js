/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import axios from 'axios'
import { stringify } from 'qs'

/**
 * @descriptor 需要校验options中的选项
 * @param {string} baseURL
 * @param {number} timeout
 * @param {function} getAccessToken
 * @param {RouterType} router
 */
export function createAxios(options = {}) {
  const instance = axios.create({
    baseURL: options.baseURL || '',
    timeout: options.timeout || 60000
  })

  instance.interceptors.request.use((config) => {
    const accessToken = options.getAccessToken()

    if (accessToken) {
      config.headers.accessToken = accessToken
    }

    if (config.headers['content-type'] === 'application/x-www-form-urlencoded') {
      config.data = stringify(config.data)
    }
    return config
  })

  return {
    async post(url, data, config) {
      try {
        const response = await instance({
          method: 'post',
          url,
          data: checkParam(data),
          headers: config && config.headers ? config.headers : {}
        })
        const res = await checkStatus(response)
        return checkCode(res)
      } catch (res_1) {
        return catchError(res_1, options)
      }
    },
    async delete(url, data) {
      try {
        const response = await instance({
          method: 'delete',
          url,
          data: checkParam(data)
        })
        const res = await checkStatus(response)
        return checkCode(res)
      } catch (res_1) {
        return catchError(res_1, options)
      }
    },
    async put(url, data) {
      try {
        const response = await instance({
          method: 'put',
          url,
          data: checkParam(data)
        })
        const res = await checkStatus(response)
        return checkCode(res)
      } catch (res_1) {
        return catchError(res_1, options)
      }
    },
    async get(url, params, config) {
      // console.log(url, params, config)
      try {
        const response = await instance({
          method: 'get',
          url,
          params: checkParam(params),
          responseType: config && config.responseType ? config.responseType : ''
        })
        const res = await checkStatus(response)
        return checkCode(res)
      } catch (res_1) {
        return catchError(res_1, options)
      }
    },
    async download(url, params, method = 'get', headers, cancel) {
      // data: 请求参数
      if (method === 'get' && params && typeof params === 'object') {
        Object.keys(params).forEach((key) => {
          if (Array.isArray(params[key])) {
            params[key] = params[key].join(',')
          }
        })
      }
      try {
        const res = await instance({
          url,
          method,
          params: method === 'get' ? params : null,
          data: method === 'post' ? params : null,
          responseType: 'blob',
          timeout: 60000,
          headers
        })
        const { headers: headers_2, data } = res
        const { 'content-type': contentType, 'content-disposition': disposition } = headers_2
        if (data instanceof Blob) {
          const decodePosition = decodeURIComponent(disposition).toLocaleLowerCase()
          // 过滤Firefox浏览器错误文件名
          const replacedPosit = decodePosition
            .replace(/"/g, '')
            .replace(/\*/g, '')
            .replace(/zh_cn/g, '')
            .replace(/utf-8/g, '')
            .replace(/'/g, '')
          let nameFromHeader = ''
          const idx = replacedPosit.indexOf('filename=')
          if (replacedPosit && idx) {
            // 提取响应头content-disposition中的filename
            nameFromHeader = replacedPosit.slice(idx, replacedPosit.length).replace('filename=', '')
          }
          const fileName = nameFromHeader || '导出信息.xls' // 自定义文件名优先级最高，其次是接口响应头中指定的文件名，最后是默认文件名
          const blob = new Blob([data], { type: contentType })
          if (contentType === 'application/json;charset=UTF-8') {
            const blobReader = new Response(blob).json()
            blobReader.then((res_2) => {
              const message = res_2.errmsg || res_2.msg || res_2.message
              console.error('error:', message)
              // ElMessage.error(message) // TODO：后期替换成不依赖element-plus的组件
            })
          } else {
            if ('download' in document.createElement('a')) {
              // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else if (window.navigator.msSaveBlob) {
              // IE10+中文件下载方法
              window.navigator.msSaveBlob(blob, fileName)
            }
          }
        }
      } catch (res_3) {
        return checkCode(res_3)
      }
    },
    async saveLoad(url, params, method = 'get', headers, cancel) {
      // data: 请求参数
      if (method === 'get' && params && typeof params === 'object') {
        Object.keys(params).forEach((key) => {
          if (Array.isArray(params[key])) {
            params[key] = params[key].join(',')
          }
        })
      }
      return instance({
        url,
        method,
        params: method === 'get' ? params : null,
        data: method === 'post' ? params : null,
        responseType: 'blob',
        timeout: 60000,
        headers
      })
        .then((res) => {
          const { headers, data } = res
          const { 'content-type': contentType, 'content-disposition': disposition } = headers
          if (data instanceof Blob) {
            const blob = new Blob([data], { type: contentType })
            if (contentType === 'application/json;charset=UTF-8') {
              const blobReader = new Response(blob).json()
              blobReader.then((res) => {
                const message = res.errmsg || res.msg || res.message
                console.error('error:', message)
                // ElMessage.error(message) // TODO：后期替换成不依赖element-plus的组件
              })
            } else {
              return URL.createObjectURL(blob)
            }
          }
        })
        .catch((res) => {
          return checkCode(res)
        })
    },
    async getBlob(url, params) {
      return instance({
        url,
        method: 'get',
        params: params,
        responseType: 'blob',
        timeout: 60000
      })
        .then((res) => {
          const { headers, data } = res
          const { 'content-type': contentType, 'content-disposition': disposition } = headers
          if (data instanceof Blob) {
            const blob = new Blob([data], { type: contentType })
            if (contentType === 'application/json;charset=UTF-8') {
              const blobReader = new Response(blob).json()
              blobReader.then((res) => {
                const message = res.errmsg || res.msg || res.message
                console.error('error:', message)
                // ElMessage.error(message) // TODO：后期替换成不依赖element-plus的组件
              })
            } else {
              return URL.createObjectURL(blob)
            }
          }
        })
        .catch((res) => {
          return checkCode(res)
        })
    }
  }
}

const checkStatus = (response) => {
  const successStatus = [200, 304, 400]
  if (response && successStatus.includes(response.status)) {
    return response.data
  }
  return new Error('service status error')
}

function checkCode(res) {
  return res
}

function catchError(res, options) {
  const error = [
    // 'Request failed with status code 403',
    'Request failed with status code 401'
  ]
  const message = res.errmsg || res.msg || res.message
  if (error.includes(message)) {
    options.router.replace('/')
  }
}

const checkParam = (data) => {
  const type = Object.prototype.toString.call(data)
  if (type === '[object Object]') {
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || data[key] === null || data[key] === '') {
        delete data[key]
      }
      if (Object.prototype.toString.call(data[key]) === '[object String]') {
        data[key] = data[key].trim()
      }
    })
  }
  return data
}
