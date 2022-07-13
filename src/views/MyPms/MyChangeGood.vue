<template>
  <div style="margin-top: 10px;width: 100%;">
    <el-form 
        :model="value"
        :rules="rules" 
        ref="productInfoForm" 
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
      <el-form-item label="商品照片：">
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
import {mapState,mapActions} from 'vuex'
import {reqChangeGoodBase,reqShopInfo} from '../../api/index'
export default {
    name:'MyChangeGood',
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
        }
      };
    },
    computed: {
        ...mapState('myUserAbout',['userInfo']),
        ...mapState('myShopAbout',['nowChangeGood']),
        actionIcon(){
            return  'http://localhost:8081/api/sms/system/uploadGoodIcon?dishId='+this.nowChangeGood.dishId
        },
        actionPic(){
            return  'http://localhost:8081/api/sms/system/uploadGoodPic?dishId='+this.nowChangeGood.dishId
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
            this.$refs.productInfoForm.validate((valid) => {
                if (valid) {
                    // 先提交基础信息的修改申请
                    this.pushChangeGoodBase()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
            this.$forceUpdate()
        },
        // 提交基础信息申请
        async pushChangeGoodBase(){
          let result =await reqChangeGoodBase({
            dishId:this.nowChangeGood.dishId,
            dishName:this.value.newGoodName,
            dishIcon:this.nowChangeGood.dishIcon,
            dishPicture1:this.nowChangeGood.dishPicture1,
            dishPrice:this.value.newGoodPrice,
            dishSales:this.nowChangeGood.dishSales,
            dishSort:this.value.newGoodClass,
            dishStar:this.nowChangeGood.dishStar,
            dishText:this.value.newGoodText,
            oldPrice:this.nowChangeGood.oldPrice
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
            this.value.newGoodName=this.nowChangeGood.dishName
            this.value.newGoodText=this.nowChangeGood.dishText
            this.value.newGoodPrice=this.nowChangeGood.dishPrice
            this.value.newGoodClass=this.nowChangeGood.dishSort
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

    },
    watch: {
      'nowChangeGood':{
        immediate:true,
        deep:true,
        handler(){
          this.value.newGoodName=this.nowChangeGood.dishName
          this.value.newGoodText=this.nowChangeGood.dishText
          this.value.newGoodPrice=this.nowChangeGood.dishPrice
          this.value.newGoodClass=this.nowChangeGood.dishSort
        }
      }
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