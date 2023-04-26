import {apiPrefix} from './api'
import {ResponseResult} from '../model/ResponseResult'

export function request(url:string, method:string, data?: object,options?: object): Promise<ResponseResult | Error> {
  const accessToken = wx.getStorageSync('accessToken')
  const _url = apiPrefix + url
  const _method: any = method
  const _data: any = data
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: _method,
      data: _data,
      header: {
        "Authorization": accessToken
      },
      ...options,
      success (res) {
        const responseData = <ResponseResult>res.data
        resolve(responseData)
      },
      fail (err) {
        reject(err)
      }
    })
  })
}