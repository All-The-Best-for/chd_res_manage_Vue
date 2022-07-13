//引入路由器插件
import VueRouter from 'vue-router'

//引入跳转的组件
import MyLogin from '../views/login/index.vue'
import MyHome from '../views/home/index.vue'
import MyTopManageHome from '../views/home/MyTopManageHome.vue'
import MySuperManageHome from '../views/home/MySuperManageHome.vue'
import MyLayOut from '../views/MyLayOut/MyLayOut.vue'
import MyPms from '../views/MyPms/MyPms.vue'
import MyChangeGood from '../views/MyPms/MyChangeGood.vue'
import MyAddProduct from '../views/MyPms/MyAddProduct.vue'
import MyOrders from '../views/MyOms/MyOrders.vue'
import MyOrderDetail from '../views/MyOms/MyOrderDetail.vue'
import MyShopSms from '../views/MySms/MyShopSms.vue'
import MyChangeStall from '../views/MySms/MyChangeStall.vue'
import MyStallMS from '../views/MyStallMS/MyStallMS.vue'
import MyChangeStallSms from '../views/MyStallMS/MyChangeStall.vue'
import MyAddStall from '../views/MyStallMS/MyAddStall.vue'
import MyRms from '../views/MyRms/MyRms.vue'
import MyAddRes from '../views/MyRms/MyAddRes.vue'
import MyUms from '../views/MyUms/MyUms.vue'
import MyAddUser from '../views/MyUms/MyAddUser.vue'
import MyBatchRegUser from '../views/MyUms/MyBatchRegUser.vue'

//创建并暴露一个路由器
export default new VueRouter({
    routes:[  
        {
            name:'MyLogin',
            path:'/mylogin',
            component:MyLogin,
        },
        {
            name:'MyLayOut',
            path:'/mylayout',
            // redirect: 'myhome',
            component:MyLayOut,
            children:[
                // 商家管理员模块路由
                {
                    path: 'myhome',
                    name: 'myhome',
                    component: MyHome,
                },
                {
                    name: 'mypms',
                    path: 'mypms',
                    component: MyPms,
                },
                {
                    name: 'myaddproduct',
                    path: 'myaddproduct',
                    component: MyAddProduct,
                },
                {
                    name: 'mychangegood',
                    path: 'mychangegood',
                    component: MyChangeGood,
                },
                {
                    name: 'myorders',
                    path: 'myorders',
                    component: MyOrders,
                },
                {
                    name: 'myorderdetail',
                    path: 'myorderdetail',
                    component: MyOrderDetail,
                },
                {
                    name: 'myshopsms',
                    path: 'myshopsms',
                    component: MyShopSms,
                },
                {
                    name: 'mychangestall',
                    path: 'mychangestall',
                    component: MyChangeStall,
                },
                // 餐厅管理员模块路由
                {
                    path: 'mytopmanagehome',
                    name: 'mytopmanagehome',
                    component: MyTopManageHome,
                },
                {
                    path: 'mystallms',
                    name: 'mystallms',
                    component: MyStallMS,
                },
                {
                    path: 'mychangestallsms',
                    name: 'mychangestallsms',
                    component: MyChangeStallSms,
                },
                {
                    path: 'myaddstall',
                    name: 'myaddstall',
                    component: MyAddStall,
                },
                // 餐厅管理员模块路由
                {
                    path: 'mysupermanagehome',
                    name: 'mysupermanagehome',
                    component: MySuperManageHome,
                },
                {
                    path: 'myrms',
                    name: 'myrms',
                    component: MyRms,
                },
                {
                    path: 'myaddres',
                    name: 'myaddres',
                    component: MyAddRes,
                },
                {
                    path: 'myums',
                    name: 'myums',
                    component: MyUms,
                },
                {
                    path: 'myadduser',
                    name: 'myadduser',
                    component: MyAddUser,
                },
                {
                    path: 'mybatchreguser',
                    name: 'mybatchreguser',
                    component: MyBatchRegUser,
                },
            ]
        },
        // 加一个默认显示
        {
            path:'/',
            redirect: '/mylogin'
        }
    ]
})