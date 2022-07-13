<template>
  <div class="MyBox">
    <el-container style="height:100%;" direction="vertical">
      <el-container>
        <el-aside width="200px">
          <MyMenu/>
        </el-aside>
        <el-container>
          <el-header>
            <MyHeader/>
          </el-header>
          <el-main>
            <!-- <keep-alive> -->
              <router-view></router-view>
            <!-- </keep-alive> -->
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MyMenu from '../../components/MyMenu/MyMenu.vue'
import MyHeader from '../../components/MyHeader/MyHeader.vue'
export default {
    name:'MyLayOut',
    components: {
      MyMenu,MyHeader,
    }
}
</script>

<style scoped>
  .MyBox{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    /* line-height: 200px; */
    line-height: 100vh;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>