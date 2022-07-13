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
      <el-form-item label="管理账号：" prop="newSecName">
        <el-input v-model="value.newSecName"></el-input>
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
        <el-button type="success" round size="medium" @click="back" style="margin-right:60px">放弃添加</el-button>
        <el-button type="primary" round size="medium" @click="submitAdd" style="margin-right:60px">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import {reqAddStallBase,reqShopsByRes} from '../../api/index'
export default {
    name:'MyAddStall',
    data() {
      return {
        rules: {
          newStallName: [{required: true, message: '请输入名称', trigger: 'blur'}],
          newStallText: [{required: true, message: '请输入简介', trigger: 'blur'}],
          newSecName:[{required:true,message:'请为其规定一个管理员账号',trigger:'blur'}]
        },
        // 商品图标组件数据
        imageUrlIcon: '',
        // 商品详情组件数据
        imageUrl:'',
        value:{
            newStallName:null,
            newStallText:null,
            newSecName:null
        },
        reStallId:0,
        actionPic:'',
        actionIcon:'',
      };
    },
    computed: {
      ...mapState('myShopAbout',['res']),
      ...mapState('myUserAbout',['userInfo','userClass']),
    },
    methods: {
      ...mapActions('myShopAbout',['recordRes']),
      async pushReqRes(){
        let res= await reqShopsByRes(this.userInfo.topAdminId)
        if(res.code===200){
          this.recordRes(res.data.res)
        }
      },
      //商品详情图片上传组件方法
      handlePicSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforePicUpload(file) {
        return new Promise((resolve, reject) => {
            this.$nextTick(() => {
                this.actionPic = `http://localhost:8081/api/sms/system/uploadStallPic?stallId=${this.reStallId}`
                resolve()
            })
        })
      },
      //商品图标图片上传组件方法
      handleAvatarSuccess(res, file) {
        this.imageUrlIcon = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        return new Promise((resolve, reject) => {
            this.$nextTick(() => {
                this.actionIcon = `http://localhost:8081/api/sms/system/uploadStallIcon?stallId=${this.reStallId}`
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
      //提交修改申请
      submitAdd(){
        this.$refs.stallInfoForm.validate((valid) => {
          if (valid) {
            // 先提交基础信息的修改申请
            this.pushAddStallBase().then(()=>{
              this.$confirm('添加成功！请以所添加管理账号登录进行商店管理', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 点击确定进行的操作
                this.$router.go(0)
              }).catch(() => {
                // 点击取消进行的操作       
                this.$router.back() 
              });
            })

          } else {
            this.$message.error('提交失败')
            return false;
          }
        })
        this.$forceUpdate()
      },
      // 提交基础信息申请
      async pushAddStallBase(){
        let result =await reqAddStallBase({
                            stallId:0,
                            stallName:this.value.newStallName,
                            stallAccount:0,
                            stallRestaurant:this.res.resId,
                            stallText:this.value.newStallText,
                            stallIcon:'',
                            stallPicture1:'',
                            stallPicture2:'',
                            stallPicture3:'',
                            stallStar:4,
                            amount:0,
                            boxFee:1,
                            resAddress:this.res.resName,
                            dayAmount:0,
                            isWork:0
                          },this.value.newSecName)
      if(result.code===200){
        //提交图片上传申请,触发组件的action
        this.reStallId=result.data.newStallId
        this.$refs.iconUpload.submit();
        setTimeout(() => {
          this.$refs.picUpload.submit();
        }, 200);
        this.$message({
            message: '提交成功',
            type: 'success'
        });
          // this.$router.back()
      }else{
        this.$message.error( '提交失败');
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
          this.value.newStallName=null
          this.value.newStallText=null
          this.value.newSecName=null
          // 假重置，点击上传后图片依然可以上传
          this.imageUrlIcon=''
          this.imageUrl=''
          this.$message({
            message: '重置成功',
            type: 'success'
        });
      },
    },
    mounted () {
      this.$nextTick(()=>{
        this.pushReqRes()
      })
    }
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