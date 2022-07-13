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
            <el-form-item label="餐厅名称">
                <el-input style="width: 203px" v-model="searchResName" placeholder="餐厅名称"></el-input>
            </el-form-item>
            <el-form-item label="餐厅编号：">
                <el-input style="width: 203px" v-model="searchResId" placeholder="餐厅编号"></el-input>
            </el-form-item>
            <el-button style="float: right" type="primary" round size="small" @click="searchList">查询结果</el-button>
            <el-button style="float: right;margin-right: 15px" size="small" type="warning" round @click="reSet">重置</el-button>
        </el-form>
      </div>
    </el-card>
    <!-- 列表表头 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>商品列表</span>
      <el-button class="btn-add" @click="$router.push('/mylayout/myaddres')" size="mini" style="float:right">添加</el-button>
    </el-card>
    <!-- 商品列表 -->
    <div class="table-container">
      <el-table ref="resTable"
                height="650"
                key="res_Table"
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
        <el-table-column label="餐厅id" width="120" align="center" sortable prop="resId">
          <template slot-scope="scope">{{scope.row.resId}}</template>
        </el-table-column>
        <el-table-column label="餐厅名称"  align="center">
          <template slot-scope="scope">
            <p>{{scope.row.resName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="120" align="center" sortable prop="resAmount">
          <template slot-scope="scope">{{scope.row.resAmount}}</template>
        </el-table-column>
        <el-table-column label="销售额" width="120" align="center" sortable prop="resAmount">
          <template slot-scope="scope">￥{{scope.row.resAccount}}</template>
        </el-table-column>
        <el-table-column label="星级" width="120" align="center" sortable prop="resStar">
          <template slot-scope="scope">{{scope.row.resStar}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                type="primary" round
                @click="changeRes(scope.row.resId,scope.row.resName)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger" round
                @click="deleteRes(scope.row.resId)">删除
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
  import {reqAllResInfo,reqShops,reqAllUserInfo,reqChangeResName,reqDeleteRess} from '../../api/index'
  export default {
    name:'MyRms',
    data() {
      return {
        list:[],
        listLoading: true,  //商品信息请求是否返回结果，返回则设置为false，去除加载效果
        searchResName:'', 
        searchResId:'',
        multipleSelection:[],
        ImageBasePathHeader:this.GLOBALVAR.ImageBasePathHeader,
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
          if(this.searchResName!==''){
            var arr = this.list
            var brr = arr.filter((res)=> {
                return res.resName.includes(this.searchResName)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
            })
            this.list=brr
            if(this.searchResId!==''){
                var arr2 = this.list
                var brr2 = arr2.filter((res)=> {
                    return res.resId.toString()===this.searchResId  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                })
                this.list=brr2
            }
            this.listLoading=false
            this.$message({
                message: '查询成功',
                type: 'success'
            });
          }else if(this.searchResId!==''){
            var arr = this.list
            var brr = arr.filter((good)=> {
                return good.resId.toString()===this.searchResId  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
            })
            this.list=brr
            if(this.selectProductCateValue!==''){
                var arr2 = this.list
                var brr2 = arr2.filter((good)=> {
                    return good.dishSort===this.selectProductCateValue  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                })
                this.list=brr2
            }
            this.listLoading=false
            this.$message({
                message: '查询成功',
                type: 'success'
            });
          }else{
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
        this.searchResId='',
        this.searchResName='',
        this.$message({
            message: '重置成功',
            type: 'success'
        });
        this.$nextTick(()=>{
          this.pushAllReq()
        })
      },
      // 删除功能
      async deleteRes(resId){
        var resList=[]
        resList.push(resId)
        let result= await reqDeleteRess({resList:resList})
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
        var resList=[]
        if(this.multipleSelection.length===0){
          this.$message({
            message: '请先选择至少一个项目',
            type: 'warning'
          });
        }else{
          this.multipleSelection.forEach(selection => {
            resList.push(selection.resId)
          });
          this.$confirm(`确定删除这${resList.length}个餐厅?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 点击确定进行的操作
            this.pushDeleteList(resList)
          }).catch(() => {
            // 点击取消进行的操作        
          });
        }
      },
      async pushDeleteList(resList){
        let result= await reqDeleteRess({resList:resList})
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
      changeRes(resId,resName) {
        this.$prompt('请输入新的餐厅名称', '修改餐厅名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:resName,
          roundButton:true,
          inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
            if(!value) {
                return '输入不能为空';
            }
          }
        }).then(({ value }) => {
          // 进行异步操作，提交修改信息
          this.pushReqChange(resId,value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      
      },
      // 提交编辑修改请求
      async pushReqChange(resId,resName){
        let result=await reqChangeResName(resName,resId)
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
          this.list=this.allRes
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