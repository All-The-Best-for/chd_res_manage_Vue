<template>
  <div style="margin-top: 10px;width: 100%;">
    <el-form 
        :model="value"
        :rules="rules" 
        ref="stallInfoForm" 
        label-width="120px" 
        style="width: 600px;margin-left: 32%;padding: 20px; border-style: solid;border-width: 1px;border-color: whitesmoke;" size="small"
    >
      <el-form-item label="商家名称：" prop="newStallName">
        <el-input v-model="value.newStallName"></el-input>
      </el-form-item>
      <el-form-item label="商家介绍：" prop="newStallText">
        <el-input
          :autoSize="true"
          v-model="value.newStallText"
          type="textarea"
          placeholder="请输入商家介绍，不超过100字"></el-input>
      </el-form-item>
      <el-form-item label="商家图标：">
        <el-upload
        class="avatar-uploader"
        ref="iconUpload"
        :action="actionIcon"
        :auto-upload="false"
        :on-change='changeUpload'
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrlIcon" :src="imageUrlIcon" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商家照片：">
        <el-upload
        class="avatar-uploader"
        ref="picUpload"
        :action="actionPic"
        :auto-upload="false"
        :on-change='changePicUpload'
        :show-file-list="false"
        :on-success="handlePicSuccess"
        :before-upload="beforePicUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item style="text-align: center;margin-top: 40px;">
        <el-button type="warning" round size="medium" @click="reSet" style="margin-right:60px">重置</el-button>
        <el-button type="success" round size="medium" @click="back" style="margin-right:60px">放弃修改</el-button>
        <el-button type="primary" round size="medium" @click="submitChange" style="margin-right:60px">提交修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import {mapState,mapActions} from 'vuex'
import {reqChangeStallBase,reqShopInfo,reqAllResInfo} from '../../api/index'
export default {
    name:'MyChangeStall',
    data() {
      return {
        rules: {
          newStallName: [{required: true, message: '请输入名称', trigger: 'blur'}],
          newStallRes: [{required: true, message: '请选择商家所属餐厅', trigger: 'blur'}],
          newStallText: [{required: true, message: '请输入简介', trigger: 'blur'}],
        },
        // 商品图标组件数据
        imageUrlIcon: '',
        // 商品详情组件数据
        imageUrl:'',
        value:{
            newStallName:null,
            newStallText:null,
            newGoodPrice:null,
            newStallRes:null,
        },
        resOptions:[],
        resList:null,
      };
    },
    computed: {
        ...mapState('myUserAbout',['userInfo']),
        ...mapState('myShopAbout',['shopInfo']),
        actionIcon(){
            return  'http://localhost:8081/api/sms/system/uploadStallIcon?stallId='+this.shopInfo.stallInfo.stallId
        },
        actionPic(){
            return  'http://localhost:8081/api/sms/system/uploadStallPic?stallId='+this.shopInfo.stallInfo.stallId
        },
    },
    methods: {
        ...mapActions('myShopAbout',['recordShopInfo']),
        //商品详情图片上传组件方法
        handlePicSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforePicUpload(file) {
          
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传图标只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传图标大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        //商品图标图片上传组件方法
        handleAvatarSuccess(res, file) {
          this.imageUrlIcon = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {

          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传图标只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传图标大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
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
        //提交修改申请
        submitChange(){
            this.$refs.stallInfoForm.validate((valid) => {
                if (valid) {
                    // 先提交基础信息的修改申请
                    this.pushChangeStallBase()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
            this.$forceUpdate()
        },
        // 提交基础信息申请
        async pushChangeStallBase(){
          let newRes=0
          this.resList.forEach(res => {
            if(res.resName===this.value.newStallRes){
              newRes=res.resId
            }
          });
          let result =await reqChangeStallBase({
                              stallId:this.shopInfo.stallInfo.stallId,
                              stallName:this.value.newStallName,
                              stallAccount:0,
                              stallRestaurant:this.shopInfo.stallInfo.stallRestaurant,
                              stallText:this.value.newStallText,
                              stallIcon:'',
                              stallPicture1:'',
                              stallPicture2:'',
                              stallPicture3:'',
                              stallStar:0,
                              amount:0,
                              boxFee:0,
                              resAddress:this.shopInfo.stallInfo.resAddress,
                              dayAmount:0,
                              isWork:0
                            })
              console.log(result)
              if(result.code===200){
                //提交图片上传申请,触发组件的action
                this.$refs.iconUpload.submit();
                this.$refs.picUpload.submit();
                this.$message({
                    message: '提交成功',
                    type: 'success'
                });
                setTimeout(() => {
                  this.$router.back()
                }, 200);
              }else{
                  this.$message.error( '提交失败');
              }
        },
        // 返回
        back(){
            this.$confirm('确定放弃修改?', '提示', {
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
            this.value.newStallName=this.shopInfo.stallInfo.stallName
            this.value.newStallText=this.shopInfo.stallInfo.stallText
            this.value.newStallRes=this.shopInfo.stallInfo.resAddress
            // 假重置，点击上传后图片依然可以上传
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
        // 请求所有的餐厅信息
        async pushRess(){
          let result= await reqAllResInfo()
          if(result.code===200){
            this.resList=result.data
          }
        }

    },
    watch: {
      'resList':{
        deep:true,
        handler(){
          this.value.newStallName=this.shopInfo.stallInfo.stallName
          this.value.newStallText=this.shopInfo.stallInfo.stallText
          this.value.newStallRes=this.shopInfo.stallInfo.resAddress
          this.resList.forEach(res => {
            this.resOptions.push({value:res.resName,label:res.resName})
            
          });
        }
      }
    },
    mounted () {
        this.$nextTick(()=>{
            this.pushShopReq()
            this.pushRess()
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