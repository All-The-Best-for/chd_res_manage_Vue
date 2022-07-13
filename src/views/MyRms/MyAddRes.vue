<template>
  <div style="margin-top: 10px;width: 100%;">
    <el-form 
        :model="value"
        :rules="rules" 
        ref="resInfoForm" 
        label-width="120px" 
        style="width: 600px;margin-left: 32%;padding: 20px; border-style: solid;border-width: 1px;border-color: whitesmoke;" size="small"
    >
      <el-form-item label="餐厅名称：" prop="newResName">
        <el-input v-model="value.newResName"></el-input>
      </el-form-item>
      <el-form-item label="管理账号：" prop="newTopName">
        <el-input v-model="value.newTopName"></el-input>
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
  import {mapState} from 'vuex'
  import {reqAddRes} from '../../api/index'
  export default {
    name:'MyAddRes',
    data() {
      return {
        rules: {
          newResName: [{required: true, message: '请输入名称', trigger: 'blur'}],
          newTopName:[{required:true,message:'请为其规定一个管理员账号',trigger:'blur'}]
        },
        value:{
          newResName:null,
          newTopName:null
        },
      };
    },
    computed: {
      ...mapState('myUserAbout',['userInfo','userClass']),
    },
    methods: {
      //提交修改申请
      submitAdd(){
        this.$refs.resInfoForm.validate((valid) => {
          if (valid) {
            // 先提交基础信息的修改申请
            this.pushReqAddRes().then(()=>{
              this.$confirm('添加成功！请以所添加管理账号登录进行餐厅管理', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 点击确定进行的操作
                this.reSet()
              }).catch(() => {
                // 点击取消进行的操作       
                this.$router.back() 
              });
            })
          } else {
            this.$message.error('检验未通过,提交失败')
            return false;
          }
        })
        this.$forceUpdate()
      },
      // 提交基础信息申请
      async pushReqAddRes(){
        let result =await reqAddRes(
          {
            resId:0,
            resName:this.value.newResName,
            resAccount:0,
            resStar:4,
            resAmount:0,
          },this.value.newTopName)
        if(result.code===200){
          this.$message({
              message: '提交成功',
              type: 'success'
          });
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
        this.value.newResName=null
        this.value.newTopName=null
        this.$message({
          message: '重置成功',
          type: 'success'
        });
      },
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