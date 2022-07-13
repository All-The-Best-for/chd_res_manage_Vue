<template>
    <div style="width:100%;height:100%">
    <!-- 基本信息卡片 -->
    <el-card class="box-card" style="margin-bottom:50px">
        <div slot="header" class="clearfix">
        <span style="float: left"><b>基本信息</b></span>
        <el-button-group
            style="float: right; padding: 3px 0"
            type="text"
        >
            <!-- 修改信息 -->
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="medium"
                round
                @click="changeShopInfo"
            >
                修改信息
            </el-button>
        </el-button-group>
        </div>
        <div class="text item">
            <el-table :data="tableData" style="width: 100%;">
                <el-table-column label="名称" width="200">
                    <template slot-scope="scope">
                        <p>{{ scope.row.stallName }}</p>
                        <div slot="reference" class="name-wrapper"></div>
                    </template>
                </el-table-column>
                <el-table-column label="所属餐厅" align="center" width="200">
                    <template slot-scope="scope">
                        <p>{{ scope.row.resName }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="简介" align="center">
                    <template slot-scope="scope">
                        <el-popover
                            placement="bottom"
                            :content="scope.row.text"
                            width="200"
                            trigger="hover"
                        >
                            <div class="jianjieClass" slot="reference">{{scope.row.text}}</div>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-card>
    <!-- 图片卡片 -->
    <el-card class="box-card">
        <div>
            <span style="float: left" shadow="hover"><b>商店图片</b></span>
            <br />
            <br />
            <el-popover
                  placement="right"
                  title="商店图标"
                  trigger="hover">
                <img :src="shopInfo?ImageBasePathHeader+shopInfo.stallInfo.stallIcon:''" style="max-height: 300px;max-width: 300px"/>
                <img slot="reference" :src="shopInfo?ImageBasePathHeader+shopInfo.stallInfo.stallIcon:''" style="height: 80px" v-if="shopInfo">
            </el-popover>
            <el-divider></el-divider>
            <el-popover
                  placement="right" 
                  title="商店详情"
                  trigger="hover">
                <img :src="shopInfo?ImageBasePathHeader+shopInfo.stallInfo.stallPicture1:''" style="max-height: 300px;max-width: 300px"/>
                <img slot="reference" :src="shopInfo?ImageBasePathHeader+shopInfo.stallInfo.stallPicture1:''" style="height: 80px" v-if="shopInfo">
            </el-popover>
        </div>
    </el-card>
    </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import {reqShopInfo} from '../../api/index'
  export default {
    name: 'MyShopSms',
    data() {
      return {
        tableData: [
          {
            stallName: '',
            resName: '',
            text:'',
          },
        ],
          ImageBasePathHeader:this.GLOBALVAR.ImageBasePathHeader,
      }
    },
    computed: {
      ...mapState('myUserAbout',['userInfo']),
      ...mapState('myShopAbout',['shopInfo']),
    },
    methods: {
        ...mapActions('myShopAbout',['recordShopInfo']),
        async pushShopReq(){
          // 发送商家信息获取请求
          let result=await reqShopInfo(this.userInfo.secondaryAdminId)
          if(result.code===200){
              this.recordShopInfo(result.data)
          }
        },
        changeShopInfo(){
            this.$router.push('/mylayout/mychangestall')
        }
    },
    mounted () {
        this.$nextTick(()=>{
            this.pushShopReq()
        })
    },
    watch: {
        'shopInfo':{
            // immediate:true,
            deep:true,
            handler(){
                if(this.shopInfo!==null){
                    if(this.shopInfo.stallInfo!==null){
                        this.tableData[0].resName=this.shopInfo.stallInfo.resAddress
                        this.tableData[0].stallName=this.shopInfo.stallInfo.stallName
                        this.tableData[0].text=this.shopInfo.stallInfo.stallText
                    }
                }
            }
        }
    }
  }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: '';
    }
    .clearfix:after {
        clear: both;
    }

    .box-card {
        overflow: hidden;
        width: 100%;
        border-radius: 30px;
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

