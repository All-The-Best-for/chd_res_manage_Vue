<template> 
  <div class="app-container" ref="pmsCon">
    <!-- 筛选器 -->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="140px">
            <el-form-item label="用户姓名">
                <el-input style="width: 203px" v-model="searchUserName" placeholder="用户姓名"></el-input>
            </el-form-item>
            <el-form-item label="用户学/工号：">
                <el-input style="width: 203px" v-model="searchUserNumber" placeholder="用户学/工号"></el-input>
            </el-form-item>
            <el-form-item label="用户性别：">
              <el-select v-model="selectSexValue" placeholder="请选择" clearable filterable>
                <el-option 
                    v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button style="float: right" type="primary" round size="small" @click="searchList">查询结果</el-button>
            <el-button style="float: right;margin-right: 15px" size="small" type="warning" round @click="reSet">重置</el-button>
        </el-form>
      </div>
    </el-card>
    <!-- 列表表头 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户列表</span>
        <div style="width:200px;float:right;">
          <!-- json_fields为表头信息和取值逻辑 -->
          <download-excel :data="list" :fields="json_fields" name="用户账号信息" style="float:left;">
            <el-button size="mini" icon="el-icon-download">点击导出</el-button>
          </download-excel>
          <el-button icon="el-icon-circle-plus-outline" style="float:right;" class="btn-add" @click="$router.push('/mylayout/myadduser')" size="mini">添加</el-button>
        </div>
    </el-card>
    <!-- 用户列表 -->
    <div class="table-container">
      <el-table ref="userTable"
                height="650"
                key="user_Table"
                class="bueatyScroll"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                @selection-change="handleSelectionChange"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="序号" width="100" align="center">
            <template slot-scope="scope">
            {{scope.$index+1}} 
            </template>
        </el-table-column>
        <el-table-column label="用户学/工号" width="120" align="center" sortable prop="userNumber">
          <template slot-scope="scope">{{scope.row.userNumber}}</template>
        </el-table-column>
        <el-table-column label="用户姓名"  align="center">
          <template slot-scope="scope"><p>{{scope.row.userName}}</p></template>
        </el-table-column>
        <el-table-column label="性别" width="120" align="center">
          <template slot-scope="scope">{{scope.row.userSex}}</template>
        </el-table-column>
        <el-table-column label="用户手机号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.userPhone}}</template>
        </el-table-column>
        <el-table-column label="用户余额" width="120" align="center" sortable prop="userAccount">
          <template slot-scope="scope">￥{{scope.row.userAccount}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                type="primary" round
                @click="changeRes(scope.row.userId,scope.row.userPhone)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger" round
                @click="deleteRes(scope.row.userId)">删除
              </el-button>
            </p>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 批量删除 -->
    <div class="batch-operate-container" style="position:fixed; bottom:10px; left:200px;">
      <el-button
        style="margin-left: 20px"
        size="small"
        type="danger" round
        @click="deleteList">
        批量删除
      </el-button>
    </div>
  </div>
</template>

<script>
  import {mapActions,mapState} from 'vuex'
  import {reqAllResInfo,reqShops,reqAllUserInfo,reqChangeUserPhone,reqDeleteUsers} from '../../api/index'
  export default {
    name:'MyUms',
    data() {
      return {
        list:[],
        listLoading: true,  //商品信息请求是否返回结果，返回则设置为false，去除加载效果
        searchUserName:'', 
        searchUserNumber:'',
        multipleSelection:[],
        selectSexValue:'',
        sexOptions:[{value:'男',label:'男'},{value:'女',label:'女'}],
        ImageBasePathHeader:this.GLOBALVAR.ImageBasePathHeader,

        json_fields: {
          "姓名": "userName", //常规字段
          "学/工号": "userNumber", //支持嵌套属性
          "性别":"userSex",
          "手机号": "userPhone",
          "初始密码": "userPassword",
          "余额":"userAccount",
        },
      }
    },
    computed: {
        ...mapState('myUserAbout',['userInfo']),
        ...mapState('myShopAbout',['allShop','allRes','allUser']),
    },
    methods: {
      ...mapActions('myShopAbout',['recordAllShop','recordAllRes','recordAllUser']),
      // 获取基本信息
      async pushAllReq(){
        let resultRes=await reqAllResInfo()
        let resultUser=await reqAllUserInfo()
        let resultShop=await reqShops()
        if(resultRes.code===200){
          // console.log('Res',resultRes.data)
          this.recordAllRes(resultRes.data)
        }else{
          console.log('@','餐厅信息获取失败')
        }
        if(resultUser.code===200){
          // console.log('User',resultUser.data)
          this.recordAllUser(resultUser.data)
        }else{
          console.log('@','餐厅信息获取失败')
        }
        if(resultShop.code===200){
          // console.log('Shop',resultShop.data.stall)
          this.recordAllShop(resultShop.data.stall)
        }else{
          console.log('@','餐厅信息获取失败')
        }
      },
      // 按条件查询商品列表
      searchList(){
        this.listLoading=true
        // 每次查询前先重置商品信息
        this.pushAllReq().then(()=>{
          if(this.searchUserName!==''){
            var arr = this.list
            var brr = arr.filter((user)=> {
                return user.userName.includes(this.searchUserName)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
            })
            this.list=brr
            if(this.searchUserNumber!==''){
              var arr2 = this.list
              var brr2 = arr2.filter((user)=> {
                  return user.userNumber.includes(this.searchUserNumber)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
              })
              this.list=brr2
            }
            if(this.selectSexValue!==''){
              var arr3 = this.list
              var brr3 = arr3.filter((user)=> {
                  return user.userSex===this.selectSexValue  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
              })
              this.list=brr3
            }
            this.listLoading=false
            this.$message({
                message: '查询成功',
                type: 'success'
            });
          }else if(this.searchUserNumber!==''){
            var arr = this.list
            var brr = arr.filter((user)=> {
                return user.userNumber.includes(this.searchUserNumber)   //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
            })
            this.list=brr
            if(this.selectSexValue!==''){
                var arr2 = this.list
                var brr2 = arr2.filter((user)=> {
                    return user.userSex===this.selectSexValue  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                })
                this.list=brr2
            }
            this.listLoading=false
            this.$message({
                message: '查询成功',
                type: 'success'
            });
          }else if(this.selectSexValue!==''){
            var arr = this.list
            var brr = arr.filter((user)=> {
                return user.userSex===this.selectSexValue  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
            })
            this.list=brr
            this.listLoading=false
            this.$message({
                message: '查询成功',
                type: 'success'
            });
          }
          else{
            this.listLoading=false
            this.$message({
                message: '查询条件为空',
                type: 'warning'
            });
          }
        })
    
      },
      // 重置按钮
      reSet(){
        this.listLoading=true
        this.searchUserNumber='',
        this.searchUserName='',
        this.selectSexValue=''
        this.$message({
            message: '重置成功',
            type: 'success'
        });
        this.$nextTick(()=>{
          this.pushAllReq()
        })
      },
      // 删除功能
      async deleteRes(userId){
        var userList=[]
        userList.push(userId)
        let result= await reqDeleteUsers({userList:userList})
        if(result.code===200){
          this.$message({
            message:'删除成功',
            type:'success'
          })
          this.$nextTick(()=>{
            this.pushAllReq()
          })
        }else{
          this.$message.error('删除失败')
        }
      },
      // 批量按钮
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 批量删除
      deleteList(){
        var userList=[]
        if(this.multipleSelection.length===0){
          this.$message({
            message: '请先选择至少一个项目',
            type: 'warning'
          });
        }else{
          this.multipleSelection.forEach(selection => {
            userList.push(selection.userId)
          });
          this.$confirm(`确定删除这${userList.length}个用户?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 点击确定进行的操作
            this.pushDeleteList(userList)
          }).catch(() => {
            // 点击取消进行的操作        
          });
        }
      },
      async pushDeleteList(userList){
        let result= await reqDeleteUsers({userList:userList})
        if(result.code===200){
          this.$message({
            message:'删除成功',
            type:'success'
          })
          this.$nextTick(()=>{
            this.pushAllReq()
          })
        }else{
          this.$message.error('删除失败')
        }
      },
      // 编辑
      changeRes(userId,userPhone) {
        this.$prompt('请输入新的手机号', '修改手机号', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:userPhone,
          roundButton:true,
          inputPattern:/^[0-9]+$/,
          inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
            if(!value) {
                return '输入不能为空';
            }
            if(value-0<10000000000||value-0>99999999999){
              return '请输入11位手机号';
            }
          }
        }).then(({ value }) => {
          // 进行异步操作，提交修改信息
          this.pushReqChange(userId,value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      
      },
      // 提交编辑修改请求
      async pushReqChange(userId,userPhone){
        let result=await reqChangeUserPhone(userId,userPhone)
        if(result.code===200){
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.pushAllReq()
        }else{
          this.$message.error('修改失败')
        }
      }
    },
    mounted () {
        this.$nextTick(()=>{
            this.pushAllReq()
        })
    },
    watch: {
      'allShop':{
        deep:true,
        handler(){
          this.list=this.allUser
          this.listLoading=false
        }
      }
    }
  }
</script>

<style>
    /*
    *改变浏览器默认的滚动条样式
    */
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
    .jianjieClass{
        /* 溢出内容隐藏,强制文本在一行内显示,当对象内文本溢出时显示省略标记 */
        text-align: center;
        width: 80%;
        overflow: hidden;
        white-space: nowrap;  
        text-overflow: ellipsis; 
        padding-left: 10%;
    }
</style>