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
            <el-form-item label="商品名称">
                <el-input style="width: 203px" v-model="searchGoodName" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品编号：">
                <el-input style="width: 203px" v-model="searchGoodId" placeholder="商品编号"></el-input>
            </el-form-item>
            <el-form-item label="商品分类：">
              <el-select v-model="selectProductCateValue" placeholder="请选择" clearable filterable>
                <el-option 
                    v-for="item in productCateOptions" :key="item.value" :label="item.label" :value="item.value">
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
      <span>商品列表</span>
      <el-button
        class="btn-add"
        @click="$router.push('/mylayout/myaddProduct')"
        size="mini"
        style="float:right"
        >
        添加
      </el-button>
    </el-card>
    <!-- 商品列表 -->
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                height="650"
                v-loading="listLoading"
                key="pro_Table"
                @selection-change="handleSelectionChange"
                class="bueatyScroll"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="序号" width="100" align="center">
            <template slot-scope="scope">
            {{scope.$index+1}} 
            </template>
        </el-table-column>
        <el-table-column label="编号" width="100" align="center" sortable prop="dishId">
          <template slot-scope="scope">{{scope.row.dishId}}</template>
        </el-table-column>
        <el-table-column label="商品名称" width="120" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.dishName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <el-popover
                  placement="right"
                  :title="scope.row.dishName"
                  trigger="hover">
                <img :src="ImageBasePathHeader+scope.row.dishIcon" style="max-height: 300px;max-width: 300px"/>
                <img slot="reference" :src="ImageBasePathHeader+scope.row.dishIcon" style="height: 80px">
            </el-popover>
          </template>
          <!-- <template slot-scope="scope"><img style="height: 80px" :src="ImageBasePathHeader+scope.row.dishIcon"></template> -->
        </el-table-column>
        <el-table-column label="商品分类" width="100" align="center">
          <template slot-scope="scope">{{scope.row.dishSort}}</template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center" sortable prop="dishPrice">
          <template slot-scope="scope">
            <p>￥{{scope.row.dishPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="旧价" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.oldPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center" sortable prop="dishSales">
          <template slot-scope="scope">{{scope.row.dishSales}}</template>
        </el-table-column>
        <el-table-column label="简介" align="center">
          <template slot-scope="scope">
            <el-popover
                  placement="right"
                  :content="scope.row.dishText"
                  width="200"
                  trigger="hover">
              <div class="jianjieClass" slot="reference">{{scope.row.dishText}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="星级" width="100" align="center" sortable prop="dishStar">
          <template slot-scope="scope">{{scope.row.dishStar}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-popover
                placement="left"
                title="详情图片"
                trigger="click"
                offset="">
                <img :src="ImageBasePathHeader+scope.row.dishPicture1" style="max-height: 300px;max-width: 300px"/>
                <el-button slot="reference" size="mini" type="info" round>查看大图</el-button>
              </el-popover>
            </p>
            <p>
              <el-button
                size="mini"
                type="primary" round
                @click="changeGood(scope.row.dishId)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger" round
                @click="deleteGood(scope.row.dishId)">删除
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
  import {reqShopInfo,reqDeleteGoods} from '../../api/index'
export default {
    name:'MyPms',
    data() {
      return {
        list:[],
        listLoading: true,  //商品信息请求是否返回结果，返回则设置为false，去除加载效果
        productCateOptions: [], //商品分类名称数组
        selectProductCateValue: '',   //筛选器选中的商品分类
        searchGoodName:'', 
        searchGoodId:'',
        multipleSelection:[],
        ImageBasePathHeader:this.GLOBALVAR.ImageBasePathHeader,
      }
    },
    computed: {
        ...mapState('myUserAbout',['userInfo']),
        ...mapState('myShopAbout',['shopInfo','nowChangeGood'])
    },
    methods: {
        ...mapActions('myShopAbout',['recordShopInfo','recordNowChangeGood','recordProCateOp']),
        async pushShopReq(){
            this.listLoading=true
            // 发送商家信息获取请求
            let result=await reqShopInfo(this.userInfo.secondaryAdminId)
            if(result.code===200){
                this.recordShopInfo(result.data)
                // 获取商品列表展示的内容
                // 先将list和分类列表清空
                this.list=[]
                this.productCateOptions=[]
                this.shopInfo.goods.forEach(goodClass => {
                    goodClass.dishInfoList.forEach( dish=> {
                        this.list.push(dish)
                    });
                    this.productCateOptions.push({value:goodClass.name,label:goodClass.name})
                });
                // 记录下本商店的分类情况
                this.recordProCateOp(this.productCateOptions)
                this.listLoading=false
            }else{
                this.listLoading=true
                console.log('@','商家信息获取失败')
            }
        },
        // 按条件查询商品列表
        searchList(){
          // 每次查询前先重置商品信息
          this.listLoading=true
          this.pushShopReq().then(()=>{
            if(this.searchGoodName!==''){
              var arr = this.list
              var brr = arr.filter((good)=> {
                  return good.dishName.includes(this.searchGoodName)  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
              })
              this.list=brr
              if(this.searchGoodId!==''){
                  var arr2 = this.list
                  var brr2 = arr2.filter((good)=> {
                      return good.dishId.toString()===this.searchGoodId  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                  })
                  this.list=brr2
              }
              if(this.selectProductCateValue!==''){
                  var arr3 = this.list
                  var brr3 = arr3.filter((good)=> {
                      return good.dishSort===this.selectProductCateValue  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                  })
                  this.list=brr3
              }
              this.listLoading=false
              this.$message({
                  message: '查询成功',
                  type: 'success'
              });
            }else if(this.searchGoodId!==''){
              var arr = this.list
              var brr = arr.filter((good)=> {
                  return good.dishId.toString()===this.searchGoodId  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
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
            }else if(this.selectProductCateValue!==''){
              var arr = this.list
              var brr = arr.filter((good)=> {
                  return good.dishSort===this.selectProductCateValue  //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
              })
              this.list=brr
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
          this.selectProductCateValue='',
          this.searchGoodId='',
          this.searchGoodName='',
          this.$message({
              message: '重置成功',
              type: 'success'
          });
          this.$nextTick(()=>{
            this.pushShopReq()
          })
        },
        // 修改按钮
        changeGood(dishId){
          // 修改nowChangeGood
          this.list.forEach(good => {
            if(good.dishId===dishId){
              this.recordNowChangeGood(good)
            }
          });
          // 跳转到修改商品
          this.$router.push('/mylayout/mychangegood')
        },
        // 删除功能
        async deleteGood(dishId){
          var goodList=[]
          goodList.push(dishId)
          let result= await reqDeleteGoods({goodList:goodList})
          if(result.code===200){
            this.$message({
              message:'删除成功',
              type:'success'
            })
            this.$nextTick(()=>{
              this.pushShopReq()
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
          var goodList=[]
          if(this.multipleSelection.length===0){
            this.$message({
              message: '请先选择至少一个项目',
              type: 'warning'
            });
          }else{
            this.multipleSelection.forEach(selection => {
              goodList.push(selection.dishId)
            });
            this.$confirm(`确定删除这${goodList.length}个商品?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 点击确定进行的操作
              this.pushDeleteList(goodList)
            }).catch(() => {
              // 点击取消进行的操作        
            });
          }
        },
        async pushDeleteList(goodList){
          let result= await reqDeleteGoods({goodList:goodList})
          if(result.code===200){
            this.$message({
              message:'删除成功',
              type:'success'
            })
            this.$nextTick(()=>{
              this.pushShopReq()
            })
          }else{
            this.$message.error('删除失败')
          }
        },
    },
    mounted () {
        this.$nextTick(()=>{
            this.pushShopReq()
        })
    },

}
</script>

<style scoped>
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