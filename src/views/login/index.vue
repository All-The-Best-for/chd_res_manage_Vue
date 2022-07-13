<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <h2 class="login-title color-main">长大餐厅后台管理系统</h2>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="loginForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <div icon-class="user" class="iconfont icon-morentouxiang"></div>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <div icon-class="password" class="iconfont icon-shouhuoicon"></div>
          </span>
            <span slot="suffix" @click="showPwd">
            <div icon-class="eye" class="iconfont icon-yanjing_yincang"></div>
          </span>
          </el-input>
        </el-form-item>
        <div class="manage_class">
            <div class="tool_list">
              <div class="tool_li">
                <a>
                  <div class="tool_button">
                    <input type="radio" name="tool" @click="manageClass=1" checked>
                    商家管理员
                  </div>
                </a>
              </div>
              <div class="tool_li">
                <a>
                  <div class="tool_button">
                    <input type="radio" name="tool"  @click="manageClass=2">
                    餐厅管理员
                  </div>
                </a>
              </div>
              <div class="tool_li">
                <a>
                  <div class="tool_button">
                    <input type="radio" name="tool"  @click="manageClass=3">
                    超级管理员
                  </div>
                </a>
              </div>
            </div>
        </div>
        <el-form-item style="margin-bottom: 10px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="Login">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate';
  import {setCookie,getCookie} from '@/utils/support';
  import login_center_bg from '@/assets/images/login_center_bg.png'
  import {reqPwdLogin,reqShopInfo} from '../../api/index'
  import { mapState,mapActions } from "vuex";

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          username: '',
          password: '',
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        login_center_bg,
        dialogVisible:false,
        supportDialogVisible:false,
        manageClass:1,//登录者身份
        result:null
      }
    },
    computed: {
      ...mapState('myUserAbout',['userInfo']),
    },
    created() {
      this.loginForm.username = getCookie("username");
      this.loginForm.password = getCookie("password");
      if(this.loginForm.username === undefined||this.loginForm.username==null||this.loginForm.username===''){
        this.loginForm.username = 'admin';
      }
      if(this.loginForm.password === undefined||this.loginForm.password==null){
        this.loginForm.password = '';
      }
    },
    methods: {
      ...mapActions('myUserAbout',['recordUser','recordUserClass']),
      ...mapActions('myShopAbout',['recordShopInfo']),
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      // 登录
      Login() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.pushLoginReq(this.manageClass).then(() => {
              if(this.result.code===200){
                this.loading = false;
                setCookie("username",this.loginForm.username,15);
                setCookie("password",this.loginForm.password,15);
                // 将信息保存到vuex中
                this.recordUser(this.result.data.userInfo)
                this.recordUserClass(this.manageClass)
                // 将信息保存到session中
                window.sessionStorage.setItem("userInfo",JSON.stringify(this.result.data.userInfo));
                window.sessionStorage.setItem("userClass",JSON.stringify(this.manageClass));
                // 登陆成功后根据管理员类型请求商家信息
                if(this.manageClass===1){
                  this.pushShopReq()
                  this.$router.push('/mylayout/myhome')
                }else if(this.manageClass===2){
                  this.$router.push('/mylayout/mytopmanagehome')
                }else if(this.manageClass===3){
                  this.$router.push('/mylayout/mysupermanagehome')
                }
              }else{
                this.loading = false;
                this.$message.error('登陆失败，请检查账号是否正确')
              }
            })
          } else {
            this.$message.error('输入格式不正确')
            return false
          }
        })
      },
      async pushLoginReq(userClass){
          // 发送登录请求
          this.result=await reqPwdLogin({name:this.loginForm.username,pwd:this.loginForm.password,manageClass:this.manageClass})
      },
      async pushShopReq(){
          // 发送商家信息获取请求
          console.log('this.userInfo.userId',this.userInfo.secondaryAdminId)
          let result=await reqShopInfo(this.userInfo.secondaryAdminId)
          if(result.code===200){
            this.recordShopInfo(result.data)
            console.log('@',result.data)
          }else{
            console.log('@','商家信息获取失败')
          }
      },
    }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }

  .manage_class{
    font-size: 13px;
    width: 100%;
    height: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
    display:flex;
    justify-content: flex-start;
  }

  .tool_li{
    display: inline-block;
    box-sizing: border-box;  /*border计算在width中*/
    -moz-box-sizing:border-box; /* Firefox */
    -webkit-box-sizing:border-box; /* Safari */
    width: 100px;
    height: 100%;
    padding-left: 10px;
  }
</style>
