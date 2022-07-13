<template>
  <!-- 商家管理员主页 -->
  <div class="app-container">
    <!-- 图标展示 -->
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="total-frame" style="padding-left: 42%;">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">销售量</div>
            <div class="total-value" >{{allAccount}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="total-frame" style="padding-left: 42%;">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">销售额</div>
            <div class="total-value">￥{{allAmount}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 商家总览 -->
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="out-border">
            <div class="layout-title">商家总览</div>
            <div style="padding-top: 40px;padding-bottom: 40px;padding-left: 50px;">
              <el-row  style="padding-left: 50px;font-size: 10px;">
                <el-col :span="10" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{allStallNum}}</el-col>
                <el-col :span="10" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{allGoodNum}}</el-col>
              </el-row>
              <el-row class="font-medium" style="padding-left: 50px;padding-top: 10px;">
                <el-col :span="10" class="overview-item-title">全部商家</el-col>
                <el-col :span="10" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex'
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
  import {reqShops,reqShopsByRes} from '../../api/index'
  export default {
    name: 'MyTopManageHome',
    data() {
      return {
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount,
        allStallNum:0, //商家数量
        allGoodNum:0, //商品数量
        allAccount:0, //总销售量，本餐厅共销售餐品数量
        allAmount:0,  //总销售额
      }
    },
    computed:{
      ...mapState('myShopAbout',['shopInfo','res','shops']),
      ...mapState('myUserAbout',['userInfo','userClass']),
    },
    methods:{
      ...mapActions('myShopAbout',['recordShopInfo','recordShops','recordRes']),
      // 获取所有信息
      async pushAllShopsReq(){
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
    },
    mounted () {
      this.$nextTick(()=>{
        this.pushAllShopsReq()
      })
    },
    watch: {
      // 监控shopInfo，进行数据更新
      'shops':{
        // immediate:true,
        deep:true,
        handler(){
          if(this.shops!==null){
            this.allStallNum=this.shops.length
            this.allAccount=this.res.resAmount
            this.allAmount=this.res.resAccount
            this.shops.forEach(shop => {
              shop.dishInfo.dishInfo.forEach(dishClass => {
                this.allGoodNum+=dishClass.dishInfoList.length
              });
            });
          }
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
