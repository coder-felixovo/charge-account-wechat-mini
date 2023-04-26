// pages/register/register.ts
import {request} from '../../utils/request'
import {apiRegister} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    code: '',
    securityCode: '123456',
    securityCodeKey: '',
    expires: 0,
    isAgree: false,
    tips: '提示',
    isTips: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.refreshCode()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  // 刷新验证码
  async refreshCode() {
    console.log('刷新验证码')
    const _this = this
    try {
      const result: any = await request('/yzm', 'GET')
      const { status, data } = result
      if (status === 1001) {
        const {expires, securityCode, securityCodeKey} = data
        _this.setData({securityCode, securityCodeKey, expires})
      } else {
        _this.setData({securityCode:'获取验证码失败'})
      }
    } catch (e) {
      _this.setData({securityCode:'获取验证码失败'})
    }
  },

  // 输入框聚焦隐藏提示
  inputFocus () {
    if (this.data.isTips) {
      this.setData({isTips: false})
    }
  },

  // 用户名输入框失去焦点，将用户名输入框内容更新到data
  setUsername (e:any) {
    const {value} = e.detail
    this.setData({
      username: value
    })
  },

  // 密码输入框失去焦点，将密码输入框内容更新到data
  setPassword (e:any) {
    const {value} = e.detail
    this.setData({password: value})
  },

  // 验证码输入框失去焦点，将验证码输入框内容更新到data
  setCode(e:any) {
    const {value} = e.detail
    this.setData({code: value})
  },

  // 点击已有账号，跳转到登录页面
  toLogin () {
    wx.redirectTo({
      url: '../login/login'
    })
  },

  // 勾选同意服务协议
  agreeProtocol (e:any) {
    if (!this.data.isAgree) {
      this.setData({isAgree: true})
    } else {
      this.setData({isAgree: false})
    }
  },

  // 点击注册触发
  async register () {
    const {username, password, code, securityCode, securityCodeKey} = this.data
    const _this = this
    if (!username) {
      this.setData({isTips: true, tips: '用户名为空'})
      return
    }
    if (!password) {
      this.setData({isTips: true, tips: '密码为空'})
      return
    }
    if (!code) {
      this.setData({isTips: true, tips: '验证码为空'})
      return
    }
    if (securityCode !== code) {
      this.setData({isTips: true, tips: '验证码错误'})
      return
    }
    if (!this.data.isAgree) {
      this.setData({isTips: true, tips: '请同意服务协议'})
      return
    }
    console.log('发起请求注册')
    const reqData = {
      username,
      password,
      securityCode,
      securityCodeKey
    }
    try {
      const result:any = await request(apiRegister, 'POST', reqData)
      console.log(result)
      const { status } = result
      if (status === -1001) {
        _this.setData({
          isTips: true,
          tips: '验证码失效',
          code: ''
        })
        _this.refreshCode()
      } else if (status === 1002) {
        wx.redirectTo({
          url: '../../pages/login/login'
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
})