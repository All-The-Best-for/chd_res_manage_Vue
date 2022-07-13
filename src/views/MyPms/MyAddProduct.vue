<template>
  <div style="margin-top: 10px;width: 100%;">
    <el-form 
        :model="value"
        :rules="rules" 
        ref="addProductInfoForm" 
        label-width="120px" 
        style="width: 600px;margin-left: 32%;padding: 20px; border-style: solid;border-width: 1px;border-color: whitesmoke;" size="small"
    >
      <el-form-item label="商品名称：" prop="newGoodName">
        <el-input v-model="value.newGoodName"></el-input>
      </el-form-item>
      <el-form-item label="商品分类："  prop="newGoodClass">
        <el-input v-model="value.newGoodClass"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍：" prop="newGoodText">
        <el-input
          :autoSize="true"
          v-model="value.newGoodText"
          type="textarea"
          placeholder="请输入商品介绍，不超过100字"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：" prop="newGoodPrice">
        <el-input v-model="value.newGoodPrice"></el-input>
        <div style="font-size:12px;color:#606266;">单位：元</div>
      </el-form-item>
      <el-form-item label="商品图标：">
        <el-upload
        class="avatar-uploader"
        ref="addIconUpload"
        :action="actionIcon"
        :auto-upload="false"
        :on-change='changeUpload'
        :show-file-list="false"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrlIcon!==''" :src="imageUrlIcon" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品照片：">
        <el-upload
        class="avatar-uploader"
        ref="addPicUpload"
        :action="actionPic"
        :auto-upload="false"
        :on-change='changePicUpload'
        :show-file-list="false"
        :before-upload="beforePicUpload">
          <img v-if="imageUrl!==''" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item style="text-align: center;margin-top: 40px;">
        <el-button type="warning" round size="medium" @click="reSet" style="margin-right:60px">重置</el-button>
        <el-button type="success" round size="medium" @click="back" style="margin-right:60px">放弃添加</el-button>
        <el-button type="primary" round size="medium" @click="submitChange" style="margin-right:60px">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex'
  import {reqAddGoodBase,reqShopInfo} from '../../api/index'
  export default {
    name:'MyAddProduct',
    data() {
        var validateNumber = (rule, value, callback) => {
          console.log('value:' + value)
          if (!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value)) {
              callback(new Error('请输入数字值'))
          } else {
              callback()
          }
        }

      return {
        rules: {
          newGoodName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
          newGoodClass: [{required: true, message: '请输入商品类别', trigger: 'blur'}],
          newGoodText: [{required: true, message: '请输入商品简介', trigger: 'blur'}],
          newGoodPrice: [{required: true, validator: validateNumber, message: '请以阿拉伯数字输入正确的商品售价', trigger: 'blur'}],
        },
        // 商品图标组件数据
        imageUrlIcon: '',
        // 商品详情组件数据
        imageUrl:'',
        value:{
            newGoodName:null,
            newGoodText:null,
            newGoodPrice:null,
            newGoodClass:null,
        },
        newDishId:0, //服务器提交基础信息之后返回新商品id，通过这个id发送图片上传请求
        actionPic:'',
        actionIcon:'',
      };
    },
    computed: {
        ...mapState('myShopAbout',['nowChangeGood','shopInfo']),
        ...mapState('myUserAbout',['userInfo']),
    },
    methods: {
      ...mapActions('myShopAbout',['recordShopInfo']),
      //商品详情图片上传组件方法
      beforePicUpload(file) {
          return new Promise((resolve, reject) => {
              this.$nextTick(() => {
                  this.actionPic = `http://localhost:8081/api/sms/system/uploadGoodPic?dishId=${this.newDishId}`
                  resolve()
              })
          })
      },
      //商品图标图片上传组件方法
      beforeAvatarUpload(file) {
          return new Promise((resolve, reject) => {
              this.$nextTick(() => {
                  this.actionIcon = `http://localhost:8081/api/sms/system/uploadGoodIcon?dishId=${this.newDishId}`
                  resolve()
              })
          })
      },
      //图片预览
      changeUpload: function(file) {
          let fileName=file.name;
          console.log(fileName)
          let regex =/(.jpg|.jpeg)$/ //匹配图片类型
          /*toLowerCase()将字符串转化为小写，返回一个新的字符串，其中的大写全部转为小写*/
          if (regex.test(fileName.toLowerCase())){
              //URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL
              //这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
              this.imageUrlIcon=URL.createObjectURL(file.raw)
          }
      },
      //详情图片预览
      changePicUpload: function(file){
          let fileName=file.name;
          console.log(fileName)
          let regex =/(.jpg|.jpeg)$/ //匹配图片类型
          /*toLowerCase()将字符串转化为小写，返回一个新的字符串，其中的大写全部转为小写*/
          if (regex.test(fileName.toLowerCase())){
              //URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL
              //这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
              this.imageUrl=URL.createObjectURL(file.raw)
          }
      },
      //提交添加申请
      submitChange(){
        this.$refs.addProductInfoForm.validate((valid) => {
          if (valid) {
            // 先提交基础信息的修改申请
            this.pushAddGoodBase().then(()=>{
              this.$router.go(0)
              // this.reSet()
            })
            return true;
          } else {
            this.$message.error('提交失败')
            return false;
          }
        })
        this.$forceUpdate()
      },
      // 提交基础信息申请
      async pushAddGoodBase(){
          let result =await reqAddGoodBase({
          dishId:0,
          dishName:this.value.newGoodName,
          dishIcon:'',
          dishPicture1:'',
          dishPrice:this.value.newGoodPrice,
          dishSales:0,
          dishSort:this.value.newGoodClass,
          dishStar:4,
          dishText:this.value.newGoodText,
          oldPrice:0
          },this.shopInfo.stallInfo.stallId)
          console.log(result)
          if(result.code===200){
              //提交图片上传申请,触发组件的action
              this.newDishId=result.data
              this.$refs.addIconUpload.submit();
              setTimeout(() => {
                this.$refs.addPicUpload.submit();
              }, 200);
              this.$message({
                  message: '提交成功',
                  type: 'success'
              });
          }else{
              this.$message.error('提交失败')
          }
      },
      // 返回
      back(){
        this.$confirm('确定放弃添加?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 点击确定进行的操作
          this.$router.back()
        }).catch(() => {
          // 点击取消进行的操作        
        });
      },
      // 重置修改信息
      reSet(){
        this.value.newGoodName=null
        this.value.newGoodText=null
        this.value.newGoodPrice=null
        this.value.newGoodClass=null
        //假重置，点击上传后图片依然可以上传
        this.imageUrlIcon=''
        this.imageUrl=''
        this.$message({
            message: '重置成功',
            type: 'success'
        });
      },
      async pushShopReq(){
        // 发送商家信息获取请求
        let result=await reqShopInfo(this.userInfo.secondaryAdminId)
        if(result.code===200){
            this.recordShopInfo(result.data)
        }
      },

    },
    mounted () {
        this.$nextTick(()=>{
            this.pushShopReq()
        })
    },
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>