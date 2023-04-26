import { request } from "../../utils/request"
import { apiLogin } from "../../utils/api"


// pages/login/login.ts
Page({

  data: {
    username: '',
    password: '',
    agree: false,
    isTips: false,
    tips: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    const result: any = await request(apiVerifyToken, 'POST')
    console.log(result)
    if (result.status === 1) {
      wx.navigateTo({
        url: '../account-list/account-list'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  usernameBlur (e: any) {
    this.setData({
      username: e.detail.value
    })
  },

  passwordBlur (e: any) {
    this.setData({
      password: e.detail.value
    })
  },

  agreeProtocol () {
    if (!this.data.agree) {
      this.setData({agree: true})
    } else {
      this.setData({agree: false})
    }
  },

  inputFocus () {
    if (this.data.isTips) {
      this.setData({isTips: false})
      return
    }
  },

  // 跳转到注册页面
  toRegister () {
    wx.redirectTo({
      url: '../register/register'
    })
  },

  // 登录
  async login () {
    const _this = this
    const {username, password, agree} = this.data
    // username为空
    if (!username) {
      this.setData({isTips: true, tips: '用户名为空'})
      return
    }
    // password为空
    if (!password) {
      this.setData({isTips: true, tips: '密码为空'})
      return
    }
    // 未勾选同意协议
    if (!agree) {
      this.setData({isTips: true, tips: '勾选同意协议'})
      return
    }
    // 发起登录请求
    try {
      const requestParams = {
        username,
        password,
        agree
      }
      const result: any = await request(apiLogin, 'POST', requestParams)
      if (result.status === 1003) {
        wx.setStorageSync('accessToken', result.data.accessToken)
        wx.redirectTo({
          url: '../../pages/account-list/account-list'
        })
      } else {
        this.setData({isTips: true, tips: '登录失败'})
      }
    } catch (e) {
      console.log('登录请求出错')
    }
  },
})