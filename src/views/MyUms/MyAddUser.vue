<template>
  <div style="margin-top: 10px;width: 100%;">
    <el-form 
        :model="value"
        :rules="rules" 
        ref="userInfoForm" 
        label-width="120px" 
        style="width: 600px;margin-left: 32%;padding: 20px; border-style: solid;border-width: 1px;border-color: whitesmoke;" size="small"
    >
      <el-form-item label="用户姓名：" prop="newUserName">
        <el-input v-model="value.newUserName"></el-input>
      </el-form-item>
      <el-form-item label="用户学/工号：" prop="newUserNumber">
        <el-input v-model="value.newUserNumber"></el-input>
      </el-form-item>
      <el-form-item label="用户性别：" prop="selectSexValue">
        <el-select v-model="value.selectSexValue" placeholder="请选择" clearable filterable>
          <el-option 
              v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户手机号：" prop="newUserPhone">
        <el-input v-model="value.newUserPhone"></el-input>
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
  import {reqAddUser} from '../../api/index'
  export default {
    name:'MyAddUser',
    data() {
      // 检查手机号
      var checkPhone = (rule, value, callback) => {
          const phoneReg = /^1[0-9]{10}$/
          if (!value) {
            return callback(new Error('电话号码不能为空'))
          }
          setTimeout(() => {
            
            if (!Number.isInteger(+value)) {
              callback(new Error('请输入数字值'))
            } else {
              if (phoneReg.test(value)) {
                callback()
              } else {
                callback(new Error('电话号码格式不正确'))
              }
            }
          }, 100)

        };
      // 检查学工号
      var checkUserNumber = (rule, value, callback) => {
        const numberReg = /^20[0-9]{8}$/
        if (!value) {
          return callback(new Error('学/工号不能为空'))
        }
        setTimeout(() => {
          
          if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (numberReg.test(value)) {
              callback()
            } else {
              callback(new Error('学/工号格式不正确'))
            }
          }
        }, 100)

      };
      return {
        rules: {
          newUserName: [{required: true, message: '请输入姓名', trigger: 'blur'}],
          newUserNumber:[{required:true, validator:checkUserNumber,trigger:'blur'}],
          newUserPhone:[{required:true, validator: checkPhone,trigger:'blur'}],
          selectSexValue:[{required:true, message:'请为其选择一个性别',trigger:'blur'}],
        },
        value:{
          newUserName:null,
          newUserNumber:null,
          newUserPhone:null,
          selectSexValue:'男',
        },
        sexOptions:[{value:'男',label:'男'},{value:'女',label:'女'}],
      };
    },
    computed: {
      ...mapState('myUserAbout',['userInfo','userClass']),
    },
    methods: {
      //提交修改申请
      submitAdd(){
        this.$refs.userInfoForm.validate((valid) => {
          if (valid) {
            // 先提交基础信息的修改申请
            this.pushReqAddUser().then(()=>{
              this.$confirm('添加成功！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 点击确定进行的操作
                this.reSet()
              }).catch(() => {
                // 点击取消进行的操作       
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
      async pushReqAddUser(){
        let result =await reqAddUser(
          {
            userId:0,
            userNumber:this.value.newUserNumber,
            userName:this.value.newUserName,
            userSex:this.value.selectSexValue,
            userPhone:this.value.newUserPhone,
            userAccount:100,
            userPassword:'123',
            userIcon:'https://tva2.sinaimg.cn/large/0072Vf1pgy1foxkg1c0bbj31kw0w04oe.jpg',
            userPicture:'1'
          })
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
        this.value.newUserName=null
        this.value.newUserNumber=null
        this.value.newUserPhone=null
        this.value.selectSexValue='男'
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