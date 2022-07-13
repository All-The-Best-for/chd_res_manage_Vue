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
            <el-form-item label="订单编号">
                <el-input style="width: 203px" v-model="searchOrderId" placeholder="订单编号"></el-input>
            </el-form-item>
            <el-form-item label="用户：">
                <el-input style="width: 203px" v-model="searchOrderUserName" placeholder="用户"></el-input>
            </el-form-item>
            <el-form-item label="订单状态：">
                <el-select v-model="selectOrderCateValue" placeholder="请选择" clearable filterable>
                    <el-option 
                        v-for="item in orderStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单时间：">
                <el-date-picker
                class="input-width"
                v-model="searchOrderTime"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择时间">
                </el-date-picker>
            </el-form-item>
            <el-button style="float: right" type="primary" round size="small" @click="searchList">查询结果</el-button>
            <el-button style="float: right;margin-right: 15px" size="small" type="warning" round @click="reSet">重置</el-button>
        </el-form>
      </div>
    </el-card>
    <!-- 列表表头 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>订单列表</span>
    </el-card>
    <!-- 订单列表 -->
    <div class="table-container">
      <el-table ref="OrdersTable"
                :data="list"
                style="width: 100%"
                height="660"
                show-summary
                :summary-method="getSummaries"
                v-loading="listLoading"
                class="bueatyScroll"
                key="order_Table"
                border>
        <el-table-column label="序号" width="100" align="center">
            <template slot-scope="scope">
            {{scope.$index+1}} 
            </template>
        </el-table-column>
        <el-table-column label="订单编号" width="120" align="center" sortable prop="orderId">
          <template slot-scope="scope">{{scope.row.orderId}}</template>
        </el-table-column>
        <el-table-column label="用户" width="120" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.userName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" align="center" sortable prop="orderTime">
          <template slot-scope="scope">{{scope.row.orderTime}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">
            <p>{{stateList[scope.row.isPay-1]}}</p>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center" sortable prop="orderAmount">
          <template slot-scope="scope">{{scope.row.orderAmount}} 元</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                type="primary" round
                @click="showOrderDetail(scope.row)">查看详情
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {mapActions,mapState} from 'vuex'
  import {reqShopInfo,reqDeleteGoods,reqAllUserInfo} from '../../api/index'
  import Vue from 'vue'
export default {
    name:'MyOrders',
    data() {
      return {
        list:[],
        listLoading: true,  //请求是否返回结果，返回则设置为false，去除加载效果
        orderStateOptions: [], //商品分类名称数组
        selectOrderCateValue: '',   //筛选器选中的商品分类
        searchOrderId:null, 
        searchOrderUserName:'',
        multipleSelection:'',
        ImageBasePathHeader:this.GLOBALVAR.ImageBasePathHeader,
        stateList:['已完成','未支付','待取餐','待评价','已取消'],
        searchOrderTime:'',
        userList:null,
      }
    },
    computed: {
        ...mapState('myUserAbout',['userInfo']),
        ...mapState('myShopAbout',['shopInfo','nowChangeGood'])
    },
    methods: {
        ...mapActions('myShopAbout',['recordShopInfo','recordNowChangeGood','recordProCateOp']),
        ...mapActions('myOrderAbout',['setNowOrder']),
        async pushUsers(){
            let result=await reqAllUserInfo()
            if(result.code===200){
                this.userList=result.data
            }
        },
        async pushOrdersReq(){
            this.listLoading=true
            // 发送商家信息获取请求
            let result=await reqShopInfo(this.userInfo.secondaryAdminId)
            if(result.code===200){
                this.recordShopInfo(result.data)
                // 获取商品列表展示的内容
                // 先将list和分类列表清空
                this.list=[]
                this.orderStateOptions=[]
                var aStateList=[]
                this.shopInfo.orders.forEach(order => {
                    this.userList.forEach(user => {
                        if(user.userId===order.userId){
                            Vue.set(order,'userName',user.userName)
                            Vue.set(order,'userNumber',user.userNumber)
                            Vue.set(order,'userSex',user.userSex)
                            Vue.set(order,'userPhone',user.userPhone)
                            this.list.push(order)
                        }
                    });
                    if(aStateList.indexOf(order.isPay)===-1){
                        aStateList.push(order.isPay)
                        this.orderStateOptions.push({value:order.isPay,label:this.stateList[order.isPay-1]})
                    }
                });
                // 记录下本商店的分类情况
                // this.recordProCateOp(this.orderStateOptions)
                this.listLoading=false
            }else{
                this.listLoading=true
                console.log('@','商家信息获取失败')
            }
        },
        async pushShopReq(){
          // 发送商家信息获取请求
          let result=await reqShopInfo(this.userInfo.secondaryAdminId)
          if(result.code===200){
              this.recordShopInfo(result.data)
          }
        },
        // 按条件查询商品列表
        searchList(){
            // 每次查询前先重置商品信息
            this.pushShopReq()
            this.pushUsers()
            this.pushOrdersReq().then(()=>{
                if(this.searchOrderId!==null){
                    var arr = this.list
                    var brr = arr.filter((order)=> {
                        return (order.orderId).toString().includes((this.searchOrderId).toString())  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                    })
                    this.list=brr
                    if(this.searchOrderUserName!==''){
                        var arr2 = this.list
                        var brr2 = arr2.filter((order)=> {
                            return order.userName.includes(this.searchOrderUserName)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                        })
                        this.list=brr2
                    }
                    if(this.selectOrderCateValue!==''){
                        var arr3 = this.list
                        var brr3 = arr3.filter((order)=> {
                          return order.isPay===this.selectOrderCateValue  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                        })
                        this.list=brr3
                    }
                    if(this.searchOrderTime!==''){
                        var arr4 = this.list
                        var brr4 = arr4.filter((order)=> {
                          return order.orderTime.includes(this.searchOrderTime)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                        })
                        this.list=brr4
                    }
                    this.$message({
                        message: '查询成功',
                        type: 'success'
                    });
                }else if(this.searchOrderUserName!==''){
                        var arr = this.list
                        var brr = arr.filter((order)=> {
                          return order.userName.includes(this.searchOrderUserName)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                        })
                        this.list=brr
                        if(this.selectOrderCateValue!==''){
                            var arr2 = this.list
                            var brr2 = arr2.filter((order)=> {
                              return order.isPay===this.selectOrderCateValue  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                            })
                            this.list=brr2
                        }
                        if(this.searchOrderTime!==''){
                            var arr3 = this.list
                            var brr3 = arr3.filter((order)=> {
                              return order.orderTime.includes(this.searchOrderTime)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                            })
                            this.list=brr3
                        }
                        this.$message({
                            message: '查询成功',
                            type: 'success'
                        });
                        // 这个写好了
                }else if(this.selectOrderCateValue!==''){
                    var arr = this.list
                    var brr = arr.filter((order)=> {
                      return order.isPay===this.selectOrderCateValue  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                    })
                    this.list=brr
                    if(this.searchOrderTime!==''){
                      var arr2 = this.list
                      var brr2 = arr2.filter((order)=> {
                        return order.orderTime.includes(this.searchOrderTime)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                      })
                      this.list=brr2
                    }
                    this.$message({
                        message: '查询成功',
                        type: 'success'
                    });
                }else if(this.searchOrderTime!==''){
                  var arr = this.list
                  var brr = arr.filter((order)=> {
                    return order.orderTime.includes(this.searchOrderTime)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                  })
                  this.list=brr
                }else{
                  this.$message({
                      message: '查询条件为空',
                      type: 'warning'
                  });
                }
            })
        },
        // 重置按钮
        reSet(){
          this.selectOrderCateValue='',
          this.searchOrderUserName='',
          this.searchOrderId=null,
          this.searchOrderTime=''
          this.$message({
              message: '重置成功',
              type: 'success'
          });
          this.$nextTick(()=>{
            this.pushShopReq()
            this.pushUsers()
            this.pushOrdersReq()
          })
        },
        // 求和方法
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return prev + curr;
                } else {
                    return prev;
                }
                }, 0);
                if(index===1){
                    sums[index] = '';
                }else{
                    sums[index] += ' 元';
                }
            } else {
                sums[index] = '';
            }
            });
            return sums;
        },
        showOrderDetail(order){
          this.setNowOrder(order)
          // 跳转到详情页
          this.$router.push('/mylayout/myorderdetail')
        }
    },
    mounted () {
        this.$nextTick(()=>{
            this.pushShopReq()
            this.pushUsers()
            this.pushOrdersReq()
        })
    },
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
    .el-table {   overflow: visible !important; }

</style>