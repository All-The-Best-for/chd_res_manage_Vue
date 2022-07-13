import Vue from 'vue'

export default{
    namespaced:true,//开启命名空间
    state:{
        nowOrder:null,//当前选中的order
    },
    mutations: { 
        SET_NOW_ORDER(state,nowOrder){
            state.nowOrder=nowOrder
        },
    },
    actions: { 
        // 设置当前选中的order
        setNowOrder({commit,state},nowOrder){
            commit('SET_NOW_ORDER',nowOrder)
        },
    },
    getters: {
    }
}