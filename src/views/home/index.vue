<template>
  <!-- 商家管理员主页 -->
  <div class="app-container">
    <!-- 图标展示 -->
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="total-frame" style="padding-left: 30%;">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日订单总数</div>
            <div class="total-value" >{{todayOrdersNum}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame" style="padding-left: 30%;">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">今日销售总额</div>
            <div class="total-value">￥{{todayAmount}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame" style="padding-left: 30%;">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">销售总额</div>
            <div class="total-value">￥{{allAmount}}</div>
          </div>
        </el-col>
        <!-- <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">近7天销售总额</div>
            <div class="total-value">￥50000.00</div>
          </div>
        </el-col> -->
      </el-row>
    </div>
    <!-- 订单总览 -->
    <div class="un-handle-layout">
      <div class="layout-title">订单总览</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right;font-size: 20px;color: red;" class="color-danger">({{okOrdersNum}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待付款订单</span>
              <span style="float: right;font-size: 20px;color: red;" class="color-danger">({{payOrdersNum}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待取餐订单</span>
              <span style="float: right;font-size: 20px;color: red;" class="color-danger">({{pickOrdersNum}})</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已取消订单</span>
              <span style="float: right;font-size: 20px;color: red;" class="color-danger">({{cancelOrdersNum}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待评价订单</span>
              <span style="float: right;font-size: 20px;color: red;" class="color-danger">({{appraisalOrdersNum}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">全部订单</span>
              <span style="float: right;font-size: 20px;color: red;" class="color-danger">({{ordersNum}})</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 商品总览以及评价总览 -->
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding-top: 40px;padding-bottom: 40px;padding-left: 50px;">
              <el-row  style="padding-left: 50px;font-size: 10px;">
                <el-col :span="10" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{mostSellWell}}</el-col>
                <el-col :span="10" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{goodsNum}}</el-col>
              </el-row>
              <el-row class="font-medium" style="padding-left: 50px;padding-top: 10px;">
                <el-col :span="10" class="overview-item-title">热销</el-col>
                <el-col :span="10" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">评价总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{rates?rates.length:0}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{positiveRatesNum}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{nagativeRatesNum}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{rates?((positiveRatesNum/rates.length)*100).toFixed(2):0}}%</el-col>
              </el-row>
              <el-row class="font-medium" style="padding-top: 10px;">
                <el-col :span="6" class="overview-item-title">评论数</el-col>
                <el-col :span="6" class="overview-item-title">好评</el-col>
                <el-col :span="6" class="overview-item-title">差评</el-col>
                <el-col :span="6" class="overview-item-title">好评占比</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import dayjs from "dayjs"
  import {mapState,mapActions} from 'vuex'
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
  import {reqShopInfo,reqRateByStall} from '../../api/index'
  export default {
    name: 'home',
    data() {
      return {
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount,
        okOrdersNum:0,
        appraisalOrdersNum:0,
        payOrdersNum:0,
        pickOrdersNum:0,
        cancelOrdersNum:0,
        ordersNum:0,
        goodsNum:0,
        mostSellWell:'暂无',
        todayOrdersNum:0,
        todayAmount:0,
        allAmount:0,
        todayOrders:[], //今日订单列表
        rates:null,
      }
    },
    computed:{
      ...mapState('myShopAbout',['shopInfo']),
      ...mapState('myUserAbout',['userInfo','userClass']),
      positiveRatesNum(){
        var brr=[]
        if(this.rates!==null){
          this.rates.forEach(rate => {
            if(rate.agree>=3){
              brr.push(rate)
            }
          });
        }
        return brr.length
      },
      nagativeRatesNum(){
        var brr=[]
        if(this.rates!==null){
          this.rates.forEach(rate => {
            if(rate.agree<3){
              brr.push(rate)
            }
          });
        }
        return brr.length
      }
    },
    methods:{
      ...mapActions('myShopAbout',['recordShopInfo']),
      async pushShopReq(){
        // 发送商家信息获取请求
        let result=await reqShopInfo(this.userInfo.secondaryAdminId)
        if(result.code===200){
          this.recordShopInfo(result.data)
        }else{
          console.log('@','商家信息获取失败')
        }
      },
      async pushRateReq(){
        // 发送商家信息获取请求
        let result=await reqRateByStall(this.shopInfo.stallInfo.stallId)
        if(result.code===200){
          this.rates=result.data
        }else{
          console.log('@','商家信息获取失败')
        }
      },
    },
    mounted () {
      this.$nextTick(()=>{
        this.pushShopReq()
        this.pushRateReq()
      })
    },
    watch: {
      // 监控shopInfo，进行数据更新
      'shopInfo':{
        deep:true,
        handler(){
          // 更新订单信息
          this.okOrdersNum=0,
          this.appraisalOrdersNum=0,
          this.payOrdersNum=0,
          this.pickOrdersNum=0,
          this.cancelOrdersNum=0,
          this.ordersNum=this.shopInfo.orders.length,
          this.shopInfo.orders.forEach(order => {
            if(order.isPay===1){
              this.okOrdersNum++
            }else if(order.isPay===2){
              this.payOrdersNum++
            }else if(order.isPay===3){
              this.pickOrdersNum++
            }else if(order.isPay===4){
              this.appraisalOrdersNum++
            }else if(order.isPay===5){
              this.cancelOrdersNum++
            }
            // 更新总体销售额
            this.allAmount+=order.orderAmount
          });
          // 更新商品信息
          this.goodsNum=0,
          this.shopInfo.goods.forEach(goodClass => {
            this.goodsNum+=goodClass.dishInfoList.length
          });
          this.mostSellWell='暂无'
          let maxSale=0
          this.shopInfo.goods.forEach(goodClass => {
            goodClass.dishInfoList.forEach(good => {
              if(maxSale<good.dishSales){
                maxSale=good.dishSales
                this.mostSellWell=good.dishName
              }
            });
          });
          // 更新todayOrdersNum今日订单总数
            // 得到今日日期关键字
          var date = Date.parse(new Date());
          let orderTime= dayjs(date).format('YYYY-MM-DD')
          let keyword=orderTime.trim()
            // 进行搜索
          if(keyword){
            // this.emptyResult = false
            var arr = this.shopInfo.orders
            var brr = arr.filter(function (order) {
              return order.orderTime.includes(keyword)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
            })
            this.todayOrders=brr
          }
          this.todayOrdersNum=this.todayOrders.length
          // 更新todayAmount今日销售额
          this.todayOrders.forEach(order => {
            this.todayAmount+=order.orderAmount
          });
          // 更新评价信息

        }
      }

    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }
</style>
