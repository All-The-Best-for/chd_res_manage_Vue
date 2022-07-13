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
            <el-form-item label="商家名称：">
                <el-input style="width: 203px" v-model="searchStallName" placeholder="商家名称"></el-input>
            </el-form-item>
            <el-form-item label="是否营业：" style="margin-left:350px;">
              <el-switch
                style="display: block;height: 32px;margin-top: 5px;"
                v-model="searchIsWork"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="营业中"
                inactive-text="歇业中">
              </el-switch>
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
      <el-button
        class="btn-add"
        @click="$router.push('/mylayout/myaddstall')"
        size="mini"
        style="float:right"
        >
        添加
      </el-button>
    </el-card>
    <!-- 商品列表 -->
    <div class="table-container">
      <el-table ref="stallTable"
                :data="list"
                style="width: 100%"
                height="650"
                v-loading="listLoading"
                key="stall_Table"
                @selection-change="handleSelectionChange"
                class="bueatyScroll"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="序号" width="100" align="center">
            <template slot-scope="scope">{{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column label="商家id" width="100" align="center" sortable prop="stallId">
          <template slot-scope="scope">{{scope.row.stallId}}</template>
        </el-table-column>
        <el-table-column label="商家名称" width="120" align="center">
          <template slot-scope="scope"><p>{{scope.row.stallName}}</p></template>
        </el-table-column>
        <el-table-column label="商家图片" width="120" align="center">
          <template slot-scope="scope">
            <el-popover
                  placement="right"
                  :title="scope.row.stallName"
                  trigger="hover">
                <img :src="ImageBasePathHeader+scope.row.stallIcon" style="max-height: 300px;max-width: 300px"/>
                <img slot="reference" :src="ImageBasePathHeader+scope.row.stallIcon" style="height: 80px">
            </el-popover>
          </template>
          <!-- <template slot-scope="scope"><img style="height: 80px" :src="ImageBasePathHeader+scope.row.stallIcon"></template> -->
        </el-table-column>
        <el-table-column label="订单量" width="100" align="center" sortable prop="amount">
          <template slot-scope="scope">{{scope.row.amount}}</template>
        </el-table-column>
        <el-table-column label="交易额" width="100" align="center" sortable prop="stallAccount">
          <template slot-scope="scope">{{scope.row.stallAccount}}</template>
        </el-table-column>
        <el-table-column label="简介" align="center">
          <template slot-scope="scope">
            <el-popover
                  placement="right"
                  :content="scope.row.stallText"
                  width="200"
                  trigger="hover">
              <div class="jianjieClass" slot="reference">{{scope.row.stallText}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="星级" width="100" align="center" sortable prop="stallStar">
          <template slot-scope="scope">{{scope.row.stallStar}}</template>
        </el-table-column>
        <el-table-column label="是否营业" width="220" align="center">
          <template slot-scope="scope">
              <el-switch
                style="display: block;height: 32px;margin-top: 5px;"
                v-model="scope.row.isWork"
                @change="changeIsWork($event,scope.row.stallId)"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                active-text="营业中"
                inactive-text="歇业中">
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-popover
                placement="left"
                title="详情图片"
                trigger="click"
                offset="">
                <img :src="ImageBasePathHeader+scope.row.stallPicture1" style="max-height: 300px;max-width: 300px"/>
                <el-button slot="reference" size="mini" type="info" round>查看大图</el-button>
              </el-popover>
            </p>
            <p>
              <el-button
                size="mini"
                type="primary" round
                @click="changeStall(scope.row.stallId)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger" round
                @click="deleteStall(scope.row.stallId)">删除
              </el-button>
            </p>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 批量删除 -->
    <div class="batch-operate-container" style="position:fixed; bottom:10px; left:200px;">
      <el-button-group style="margin-left: 20px">
        <el-button
          style="margin-left: 20px"
          size="small"
          type="danger" round
          @click="deleteList">
          批量删除
        </el-button>
        <el-button
          style="margin-left: 20px"
          size="small"
          type="success" round
          @click="deleteList">
          批量营业
        </el-button>
        <el-button
          style="margin-left: 20px"
          size="small"
          type="warning" round
          @click="deleteList">
          批量歇业
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
  import {mapActions,mapState} from 'vuex'
  import {reqChangeStallWork,reqDeleteStalls,reqShops,reqShopsByRes} from '../../api/index'
export default {
    name:'MyStallMS',
    data() { 
      return {
        list:[],
        listLoading: true,  //商品信息请求是否返回结果，返回则设置为false，去除加载效果
        searchStallName:'', 
        searchIsWork:true,
        multipleSelection:[],
        ImageBasePathHeader:this.GLOBALVAR.ImageBasePathHeader,
      }
    },
    computed: {
      ...mapState('myShopAbout',['shopInfo','res','shops']),
      ...mapState('myUserAbout',['userInfo','userClass']),
    },
    methods: {
      ...mapActions('myShopAbout',['recordShopInfo','recordShops','recordRes','recordNowChangeStall']),
      // 按条件查询商品列表
      searchList(){
        this.listLoading=true
        // 每次查询前先重置商品信息
        this.pushAllShopsReq().then(()=>{
          if(this.searchStallName!==''){
              var arr = this.list
              var brr = arr.filter((stall)=> {
                return stall.stallName.includes(this.searchStallName)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
              })
              this.list=brr
              var arr2 = this.list
              var brr2 = arr2.filter((stall)=> {
                if(stall.isWork===1){
                  return this.searchIsWork===true  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                }else{
                  return this.searchIsWork===false
                }
              })
              this.list=brr2
              this.listLoading=false
              this.$message({
                  message: '查询成功',
                  type: 'success'
              });
          }else{
            var arr = this.list
            var brr = arr.filter((stall)=> {
                if(stall.isWork===1){
                  return this.searchIsWork===true  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                }else{
                  return this.searchIsWork===false
                }
            })
            this.list=brr
            this.listLoading=false
            this.$message({
                message: '查询成功',
                type: 'success'
            });
          }
        })
    
      },
      // 重置按钮
      reSet(){
        this.searchIsWork=true,
        this.searchStallName='',
        this.$message({
            message: '重置成功',
            type: 'success'
        });
        this.$nextTick(()=>{
          this.pushAllShopsReq()
        })
      },
      // 修改按钮
      changeStall(stallId){
        this.list.forEach(stall => {
          if(stall.stallId===stallId){
            this.recordNowChangeStall(stall)
          }
        });
        // 跳转到修改商品
        this.$router.push('/mylayout/mychangestallsms')
      },
      // 删除功能
      deleteStall(stallId){
        var stallList=[]
        stallList.push(stallId)
        // let result= await reqDeleteStalls({stallList:stallList})
        this.pushDeleteList(stallList)
      },
      // 批量按钮
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 批量删除
      deleteList(){
        var stallList=[]
        if(this.multipleSelection.length===0){
            this.$message({
              message: '请先选择至少一个项目',
              type: 'warning'
            });
        }else{
          this.multipleSelection.forEach(selection => {
            stallList.push(selection.stallId)
          });
          this.$confirm(`确定删除这${stallList.length}个商家?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 点击确定进行的操作
            this.pushDeleteList(stallList)
          }).catch(() => {
            // 点击取消进行的操作        
          });
        }
      },
      async pushDeleteList(stallList){
        let result= await reqDeleteStalls({stallList:stallList})
        if(result.code===200){
          this.$message({
            message:'删除成功',
            type:'success'
          })
          this.$nextTick(()=>{
            this.pushAllShopsReq()
          })
        }else{
          this.$message.error('删除失败')
        }
      },
      // 获取基本信息
      async pushAllShopsReq(){
        this.listLoading=true
        // 先发送获取该管理员对应餐厅下辖所有商铺的列表
        let res= await reqShopsByRes(this.userInfo.topAdminId)
        if(res.code===200){
          // console.log(res.data)
          this.recordRes(res.data.res)
          // 发送商家信息获取请求
          let result=await reqShops()
          if(result.code===200){
            // console.log(result.data)
            // 根据商家id数组选择存入
            var brr=[]
            res.data.stalls.forEach(stallId => {
              result.data.stall.forEach(stall => {
                if(stallId===stall.stallInfo.stallInfo.stallId){
                  brr.push(stall)
                }
              });
            });
            this.recordShops(brr)
          }else{
            console.log('@','商家信息获取失败')
          }

        }
      },
      // 更改营业状态
      changeIsWork:function($event,stallId){
        console.log("event",$event)
        this.pushChangeStallWork(stallId)
      },
      async pushChangeStallWork(stallId){
        let result=await reqChangeStallWork(stallId)
        if(result.code===200){
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        }
      }
    },
    mounted () {
        this.$nextTick(()=>{
            this.pushAllShopsReq()
        })
    },
    watch: {
      // 监控shopInfo，进行数据更新
      'shops':{
        immediate:true,
        deep:true,
        handler(){
          this.list=[]
          if(this.shops!==null){
            this.shops.forEach(shop => {
              let ashop=shop.stallInfo.stallInfo
              this.list.push(ashop)
            });
          }
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