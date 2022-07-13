<template>
<div>
  <!--limit:最大上传数，on-exceed：超过最大上传数量时的操作  -->
  <div style="width:100%;display: inline;">
        <el-upload
            style="width:50%;"
            class="upload-demo"
            action=""
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :limit="limitUpload"
            accept="application/vnd.openxmlformats-    
            officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :auto-upload="false">
            <el-button size="small" type="primary" style="float:left;">点击上传</el-button>
        </el-upload>
            <!-- <el-button size="small" type="primary" >批量注册</el-button> -->
        <!-- <div style="float:right;width: 20%;">

        </div> -->
  </div>

    <!-- 数据展示 -->
    <div style="margin-top:50px">
        <el-main>
            <el-table :data="mydata" height="650" class="bueatyScroll">
                <el-table-column label="序号" align="center">
                    <template slot-scope="scope">{{scope.$index+1}} </template>
                </el-table-column>
                <el-table-column prop="userNumber" label="学/工号" align="center"></el-table-column>
                <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="userSex" label="性别" align="center"></el-table-column>
                <el-table-column prop="userPhone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="userAccount" label="余额" align="center"></el-table-column>
                <el-table-column prop="userPassword" label="初始密码" align="center"></el-table-column>
            </el-table>
            <el-button-group>
                <el-button size="small" type="primary" round style="margin-top:50px;" @click="batchReg">批量注册</el-button>
                <el-button size="small" type="warning" round style="margin-top:50px;margin-left: 10px;" @click="reSet">清空数据</el-button>
            </el-button-group>
        </el-main>
    </div>
</div>

</template>


<script>
    import {reqAddUsers} from '../../api/index'
    import Vue from 'vue'
    export default {
        name:'MyBatchRegUser',
        data() {
            return {
            limitUpload:1,
            fileTemp:null,
            file:null,
            dalen:0,
            mydata:[],
            };
        },
        methods: {
            //上传文件时处理方法  
            handleChange(file, fileList){
                this.fileTemp = file.raw;
                if(this.fileTemp){
                    if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') 
                        || (this.fileTemp.type == 'application/vnd.ms-excel')){
                        this.importfxx(this.fileTemp);
                    } else {
                        this.$message({
                            type:'warning',
                            message:'附件格式错误，请删除后重新上传！'
                        })
                    }
                } else {
                    this.$message({
                        type:'warning',
                        message:'请上传附件！'
                    })
                }
            },
            //超出最大上传文件数量时的处理方法
            handleExceed(){
                this.$message({
                    type:'warning',
                    message:'超出最大上传文件数量的限制！'
                })
                return;
            },
            //移除文件的操作方法
            handleRemove(file,fileList){
                this.fileTemp = null
            },
            // 导入数据
            importfxx(obj) {
                let _this = this;
                let inputDOM = this.$refs.inputer;
                // 通过DOM取文件数据

                this.file = event.currentTarget.files[0];

                var rABS = false; //是否将文件读取为二进制字符串
                var f = this.file;

                var reader = new FileReader();
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function(f) {
                    var binary = "";
                    var rABS = false; //是否将文件读取为二进制字符串
                    var pt = this;
                    var wb; //读取完成的数据
                    var outdata;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for (var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        //此处引入，用于解析excel
                        var XLSX = require("xlsx");
                        if (rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), {
                            //手动转化
                            type: "base64"
                            });
                        } else {
                            wb = XLSX.read(binary, {
                            type: "binary"
                            });
                        }
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); 
                        console.log(outdata)
                        //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
                        //此处可对数据进行处理
                        let arr = [];
                        _this.mydata=[]
                        outdata.map(v => {
                            let obj = {}
                            obj.userAccount = v['余额']
                            obj.userPassword = v['初始密码']
                            obj.userName = v['姓名']
                            obj.userNumber = v['学/工号']
                            obj.userSex = v['性别']
                            obj.userPhone = v['手机号']
                            _this.mydata.push(obj)
                        });
                        _this.dalen=_this.mydata.length;
                    };
                    reader.readAsArrayBuffer(f);
                };
                if (rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            },
            // 重置
            reSet(){
                this.mydata=[],
                this.dalen=0
            },
            // 批量注册
            async batchReg(){
                var userList=[]
                this.mydata.forEach(some => {
                    let user=some
                    Vue.set(user,'userIcon','https://tva2.sinaimg.cn/large/0072Vf1pgy1foxkg1c0bbj31kw0w04oe.jpg')
                    Vue.set(user,'userPicture','1')
                    Vue.set(user,'userId',0)
                    userList.push(user)
                });
                let result=await reqAddUsers({userList})
                if(result.code===200){
                    this.$message({
                        message: '批量注册成功',
                        type: 'success'
                    });
                    this.$router.go(0)
                }else{
                    this.$message.error('注册失败')
                }
            }
        }
    }
</script>

<style scoped>
    .bueatyScroll .el-table__body-wrapper::-webkit-scrollbar-track-piece {
        background-color:#f8f8f8;
    }
    .bueatyScroll .el-table__body-wrapper::-webkit-scrollbar {
        width:6px;
    }
    .bueatyScroll .el-table__body-wrapper::-webkit-scrollbar-thumb {
        background-color:#dddddd;
        border-radius: 100px;
    }
    .bueatyScroll .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
        background-color:#bbb;
    }
</style>