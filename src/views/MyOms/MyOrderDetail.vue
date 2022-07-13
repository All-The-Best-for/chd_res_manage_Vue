<template> 
  <div class="detail-container">
    <!-- 进度条 -->
    <div>
      <el-steps :active="formatStepStatus(nowOrder.isPay)" finish-status="success" align-center>
        <el-step title="提交订单" :description="nowOrder.orderTime"></el-step>
        <el-step title="支付订单"></el-step>
        <el-step title="取餐"></el-step>
        <el-step title="完成评价"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <!-- 订单状态以及操作 -->
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{stateList[nowOrder.isPay-1]}}</span>
        <div class="operate-button-container" v-show="nowOrder.isPay===2">
          <el-button size="mini" round type="danger" @click="cancelOrder">取消订单</el-button>
        </div>
      </div>
      <!-- 基本信息标头 -->
      <div style="margin-top: 20px">
        <span class="font-small el-icon-collection-tag">  基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">订单编号</el-col>
          <el-col :span="6" class="table-cell-title">用户姓名</el-col>
          <el-col :span="6" class="table-cell-title">订单金额</el-col>
          <el-col :span="6" class="table-cell-title">订单状态</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{nowOrder.orderId}}</el-col>
          <el-col :span="6" class="table-cell">{{nowOrder.userName}}</el-col>
          <el-col :span="6" class="table-cell">{{nowOrder.orderAmount}}</el-col>
          <el-col :span="6" class="table-cell">{{stateList[nowOrder.isPay-1]}}</el-col>
        </el-row>
      </div>
      <!-- 用户信息标头 -->
      <div style="margin-top: 20px">
        <span class="font-small el-icon-collection-tag">  用户信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">账号</el-col>
          <el-col :span="6" class="table-cell-title">姓名</el-col>
          <el-col :span="6" class="table-cell-title">性别</el-col>
          <el-col :span="6" class="table-cell-title">手机号</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{nowOrder.userNumber}}</el-col>
          <el-col :span="6" class="table-cell">{{nowOrder.userName}}</el-col>
          <el-col :span="6" class="table-cell">{{nowOrder.userSex}}</el-col>
          <el-col :span="6" class="table-cell">{{nowOrder.userPhone}}</el-col>
        </el-row>
      </div>
      <!-- 商品信息标头 -->
      <div style="margin-top: 20px">
        <span class="font-small el-icon-collection-tag">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="orders"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="序号" align="center" width="100">
          <template slot-scope="scope">
            <p>{{scope.$index+1}}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品编号" align="center" width="120" sortable prop="dishId">
          <template slot-scope="scope">
            <p>{{scope.row.dishId}}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="ImageBasePathHeader+scope.row.dishIcon" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.dishName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center" sortable prop="dishPrice">
          <template slot-scope="scope">
            <p>￥{{scope.row.dishPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.dishSort}}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center" sortable prop="count">
          <template slot-scope="scope">
            {{scope.row.count}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center" sortable prop="amount">
          <template slot-scope="scope">
            ￥{{scope.row.amount}}
          </template>
        </el-table-column>
      </el-table>
      <!-- 合计 -->
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{nowOrder.orderAmount}}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import {reqShopInfo,reqAllUserInfo,reqCancelOrder} from '../../api/index'
import Vue from 'vue'

  export default {
    name: 'MyOrderDetail',
    data() {
      return {
        id: null,
        orders: [],
        stateList:['已完成','未支付','待取餐','待评价','已取消'],
        ImageBasePathHeader:this.GLOBALVAR.ImageBasePathHeader,
      }
    },
    filters: {
      formatNull(value) {
        if(value===undefined||value===null||value===''){
          return '暂无';
        }else{
          return value;
        }
      },
      formatLongText(value) {
        if(value===undefined||value===null||value===''){
          return '暂无';
        }else if(value.length>8){
          return value.substr(0, 8) + '...';
        }else{
          return value;
        }
      },
      formatPayType(value) {
        if (value === 1) {
          return '支付宝';
        } else if (value === 2) {
          return '微信';
        } else {
          return '未支付';
        }
      },
      formatSourceType(value) {
        if (value === 1) {
          return 'APP订单';
        } else {
          return 'PC订单';
        }
      },
      formatOrderType(value) {
        if (value === 1) {
          return '秒杀订单';
        } else {
          return '正常订单';
        }
      },
      formatAddress(order) {
        let str = order.receiverProvince;
        if (order.receiverCity != null) {
          str += "  " + order.receiverCity;
        }
        str += "  " + order.receiverRegion;
        str += "  " + order.receiverDetailAddress;
        return str;
      },
      formatStatus(value) {
        if (value === 1) {
          return '待发货';
        } else if (value === 2) {
          return '已发货';
        } else if (value === 3) {
          return '已完成';
        } else if (value === 4) {
          return '已关闭';
        } else if (value === 5) {
          return '无效订单';
        } else {
          return '待付款';
        }
      },
      formatPayStatus(value) {
        if (value === 0) {
          return '未支付';
        } else if(value===4){
          return '已退款';
        }else{
          return '已支付';
        }
      },
      formatDeliverStatus(value) {
        if (value === 0||value === 1) {
          return '未发货';
        } else {
          return '已发货';
        }
      },
      formatProductAttr(value){
        if(value==null){
          return '';
        }else{
          let attr = JSON.parse(value);
          let result='';
          for(let i=0;i<attr.length;i++){
            result+=attr[i].key;
            result+=":";
            result+=attr[i].value;
            result+=";";
          }
          return result;
        }
      }
    },
    computed: {
      ...mapState('myOrderAbout',['nowOrder']),
      ...mapState('myUserAbout',['userInfo']),
      ...mapState('myShopAbout',['shopInfo']),
    },
    methods: {
      ...mapActions('myShopAbout',['recordShopInfo']),
      async pushUsers(){
          let result=await reqAllUserInfo()
          if(result.code===200){
              this.userList=result.data
          }
      },
      async pushShopReq(){
        // 发送商家信息获取请求
        let result=await reqShopInfo(this.userInfo.secondaryAdminId)
        if(result.code===200){
            this.recordShopInfo(result.data)
        }
      },
      // 取消订单
      async cancelOrder(){
        this.$confirm(`确定取消除这个订单?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 点击确定进行的操作
          let result=await reqCancelOrder({orderId:this.nowOrder.orderId})
          if(result.code===200){
            this.$message({
              message:'取消成功',
              type:'success'
            })
            this.$router.back()
          }
        }).catch(() => {
          // 点击取消进行的操作        
        });

      },
      // 订单进度
      formatStepStatus(value) {
        if (value === 1) {
          //已完成，显示完成评价
          return 4;
        } else if (value === 2) {
          //待支付，显示提交订单
          return 1;
        } else if (value === 3) {
          //待取餐，显示支付订单
          return 2;
        }else if(value===4){
          //待评价，显示取餐
          return 3;
        }else{
          // 取消，不显示
          return 0;
        }
      },
    },
    mounted () {
        this.$nextTick(()=>{
            this.pushShopReq()
            this.pushUsers()
        })
    },
    watch: {
      'nowOrder':{
        immediate:true,
        depp:true,
        handler(){
          this.nowOrder.orderInfo.forEach(orderOf => {
            this.shopInfo.goods.forEach(goodClass => {
              goodClass.dishInfoList.forEach(dish => {
                if(dish.dishId===orderOf.orderDish){
                  Vue.set(dish,'dishClass',goodClass.name)
                  Vue.set(dish,'count',orderOf.count)
                  Vue.set(dish,'amount',orderOf.count*dish.dishPrice)
                  this.orders.push(dish)
                }
              });
            });
          });
        }
      }
    }

  }
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>


