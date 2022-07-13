export default{
    namespaced:true,//开启命名空间
    state:{
        // 商家管理模块
        shopInfo:null,  //商家管理模块中根据商家管理员id获取的单个商家信息
        nowChangeGood:null, //目前正在修改的商品信息
        productCateOptions:[],//本商店的分类情况

        // 餐厅管理模块
        shops:null,  //根据餐厅管理员id获取该餐厅下辖的所有商家信息
        res:null, //餐厅信息
        nowChangeStall:null,//当前修改的商家信息
        
        // 超级管理模块
        allShop:null, //所有商家
        allRes:null, //所有餐厅
        allUser:null, //所有消费用户
    },
    mutations: { 
        // 商家管理模块
        RECEIVE_SHOP_INFO(state,shopInfo){
            state.shopInfo=shopInfo
        },
        RECEIVE_NOW_CHANGE_GOOD(state,nowChangeGood){
            state.nowChangeGood=nowChangeGood
        },
        RECEIVE_PRO_CATE_OP(state,productCateOptions){
            state.productCateOptions=productCateOptions
        },
        // 餐厅管理模块
        RECEIVE_SHOPS(state,shops){
            state.shops=shops
        },
        RECEIVE_RES(state,res){
            state.res=res
        },
        RECEIVE_NOW_CHANGE_STALL(state,nowChangeStall){
            state.nowChangeStall=nowChangeStall
        },
        // 超级管理模块
        RECEIVE_ALL_SHOP(state,allShop){
            state.allShop=allShop
        },
        RECEIVE_ALL_RES(state,allRes){
            state.allRes=allRes
        },
        RECEIVE_ALL_USER(state,allUser){
            state.allUser=allUser
        },
    },
    actions: { 
        // 商家管理模块
        //同步记录用户信息，因为这个信息是本程序自有的，所以同步记录。而之前的异步获取都是从服务器上请求得来的，需要异步
        recordShopInfo(context,shopInfo){
            context.commit('RECEIVE_SHOP_INFO',shopInfo)
        },
        recordNowChangeGood(context,nowChangeGood){
            context.commit('RECEIVE_NOW_CHANGE_GOOD',nowChangeGood)
        },
        recordProCateOp(context,productCateOptions){
            context.commit('RECEIVE_PRO_CATE_OP',productCateOptions)
        },
        // 餐厅管理模块
        recordShops(context,shops){
            context.commit('RECEIVE_SHOPS',shops)
        },
        recordRes(context,res){
            context.commit('RECEIVE_RES',res)
        },
        recordNowChangeStall(context,nowChangeStall){
            context.commit('RECEIVE_NOW_CHANGE_STALL',nowChangeStall)
        },
        // 超级管理模块
        recordAllShop(context,allShop){
            context.commit('RECEIVE_ALL_SHOP',allShop)
        },
        recordAllRes(context,allRes){
            context.commit('RECEIVE_ALL_RES',allRes)
        },
        recordAllUser(context,allUser){
            context.commit('RECEIVE_ALL_USER',allUser)
        },
    }
}