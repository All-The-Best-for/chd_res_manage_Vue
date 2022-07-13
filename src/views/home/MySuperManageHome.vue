<template>
  <!-- 商家管理员主页 -->
  <div class="app-container">
    <!-- 图标展示 -->
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="total-frame" style="padding-left: 30%;">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">总销售量</div>
            <div class="total-value">{{allAmount}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="total-frame" style="padding-left: 30%;">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">总交易额</div>
            <div class="total-value">￥{{allAccount}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 商品总览以及评价总览 -->
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding-top: 40px;padding-bottom: 40px;padding-left: 30px;">
              <el-row  style="padding-left: 30px;font-size: 10px;">
                <el-col :span="6" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{ressNum}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{stallsNum}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{goodsNum}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value" style="font-size: 20px;color: red;">{{usersNum}}</el-col>
              </el-row>
              <el-row class="font-medium" style="padding-left: 30px;padding-top: 10px;">
                <el-col :span="6" class="overview-item-title">全部餐厅</el-col>
                <el-col :span="6" class="overview-item-title">全部商家</el-col>
                <el-col :span="6" class="overview-item-title">全部商品</el-col>
                <el-col :span="6" class="overview-item-title">全部用户</el-col>
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
  import {reqAllResInfo,reqShops,reqAllUserInfo} from '../../api/index'
  export default {
    name: 'MySuperManageHome',
    data() {
      return {
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount,
        allAmount:0,
        allAccount:0,
        ressNum:0,
        stallsNum:0,
        goodsNum:0,
        usersNum:0,
      }
    },
    computed:{
      ...mapState('myUserAbout',['userInfo','userClass']),
      ...mapState('myShopAbout',['allShop','allRes','allUser']),
    },
    methods:{
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
    },
    mounted () {
      this.$nextTick(()=>{
        this.pushAllReq()
      })
    },
    watch: {
      // 监控shopInfo，进行数据更新
      'allShop':{
        deep:true,
        handler(){
          this.usersNum=this.allUser.length
          this.ressNum=this.allRes.length
          this.stallsNum=this.allShop.length
          this.allShop.forEach(shop => {
            shop.dishInfo.dishInfo.forEach(dishClass => {
              this.goodsNum += dishClass.dishInfoList.length
            });
          });
          this.allRes.forEach(res => {
            this.allAccount+=res.resAccount
            this.allAmount+=res.resAmount
          });
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
