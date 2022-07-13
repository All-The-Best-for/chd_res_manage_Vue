export default{
    namespaced:true,//开启命名空间
    state:{
        userInfo:{}, //用户信息
        userClass:1,//用户身份，1商家管理员，2餐厅管理员，3超级管理员
    },
    mutations: { 
        //修改用户信息
        RECEIVE_USER_INFO(state,userInfo){
            state.userInfo=userInfo
        },
        //重置用户信息
        RESET_USER_INFO(state){
            state.userInfo={}
            state.userClass=1
        },
        // 修改用户身份
        RECEIVE_USER_CLASS(state,userClass){
            state.userClass=userClass
        },
    },
    actions: { 
        //同步记录用户信息，因为这个信息是本程序自有的，所以同步记录。而之前的异步获取都是从服务器上请求得来的，需要异步
        recordUser(context,userInfo){
            context.commit('RECEIVE_USER_INFO',userInfo)
        },
        // 修改用户身份
        recordUserClass(context,userClass){
            context.commit('RECEIVE_USER_CLASS',userClass)
        },
        // 获取用户信息，用于自动登录(session)
        getUserInfo(context){
            const userInfo= JSON.parse(window.sessionStorage.getItem("userInfo"))
            const userClass= JSON.parse(window.sessionStorage.getItem("userClass"))
            if(userInfo){
                context.commit('RECEIVE_USER_INFO',userInfo)
                context.commit('RECEIVE_USER_CLASS',userClass)
            }
        },
        //请求退出
        logout(context){
            window.sessionStorage.removeItem("userInfo")
            context.commit('RESET_USER_INFO')
        },
    }
}