<template>
<div style="height:100%;width:100%;text-align: left;overflow:hidden;">
    <!-- 商家管理员导航栏 -->
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="height:100%;width:100%;text-align: left;overflow:hidden;"
        v-if="userClass===1"
    >
        <el-menu-item index="1" @click="$router.push('/mylayout/myhome')">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-goods"></i>
                <span>商品管理</span>
            </template>
            <div style="background: color #1f2d3d !important;;">
                <el-menu-item index="2-1"  @click="$router.push('/mylayout/mypms')">商品列表</el-menu-item>
                <el-menu-item index="2-2"  @click="$router.push('/mylayout/myaddProduct')">添加商品</el-menu-item>
            </div>
        </el-submenu>
        <el-submenu index="3" >
            <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>订单管理</span>
            </template>
            <el-menu-item index="3-1" @click="$router.push('/mylayout/myorders')">订单列表</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
            <template slot="title">
                <i class="el-icon-setting"></i>
                <span>商铺管理</span>
            </template>
            <el-menu-item index="4-1" @click="$router.push('/mylayout/myshopsms')">基本信息</el-menu-item>
        </el-submenu>

    </el-menu>

    <!-- 餐厅管理员导航栏 -->
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="height:100%;width:100%;text-align: left;"
        v-if="userClass===2"
    >
        <el-menu-item index="1" @click="$router.push('/mylayout/mytopmanagehome')">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-goods"></i>
                <span>商家管理</span>
            </template>
            <el-menu-item index="2-1" @click="$router.push('/mylayout/mystallms')">商家列表</el-menu-item>
            <el-menu-item index="2-2" @click="$router.push('/mylayout/myaddstall')">添加商家</el-menu-item>
        </el-submenu>

    </el-menu>

    <!-- 超级管理员导航栏 -->
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="height:100%;width:100%;text-align: left;"
        v-if="userClass===3"
    >
        <el-menu-item index="1" @click="$router.push('/mylayout/mysupermanagehome')">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-goods"></i>
                <span>餐厅管理</span>
            </template>
            <el-menu-item index="2-1" @click="$router.push('/mylayout/myrms')">餐厅列表</el-menu-item>
            <el-menu-item index="2-2" @click="$router.push('/mylayout/myaddres')">添加餐厅</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-setting"></i>
                <span>用户管理</span>
            </template>
            <el-menu-item index="3-1" @click="$router.push('/mylayout/myums')">用户列表</el-menu-item>
            <el-menu-item index="3-2" @click="$router.push('/mylayout/myadduser')">添加用户</el-menu-item>
            <el-menu-item index="3-3" @click="$router.push('/mylayout/mybatchreguser')">批量注册</el-menu-item>
        </el-submenu>

    </el-menu>

</div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name:'MyMenu',
    computed: {
        ...mapState('myUserAbout',['userInfo','userClass'])
    },
    methods: {  
    }
}
</script>

<style>

</style>