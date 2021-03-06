/* ajax请求函数模块，
返回值：prosmise对象（异步返回的数据是response.data）
 */

import axios from 'axios'

export default function ajax(url,data={},type='GET') {
    return new Promise(function (resovle,reject) {
        //执行异步ajax请求
        let promise
        if (type==='GET') {
            //准备url query参数
            let dataStr=''  //数据拼接字符串
            Object.keys(data).forEach(key=>{
                dataStr+=key+'='+data[key]+'&'
            })
            if(dataStr!==''){
                dataStr=dataStr.substring(0,dataStr.lastIndexOf('&'))
                url+='?'+dataStr
            }
            //发送get请求
            console.log('url',url)
            promise=axios.get(url)
        }else{
            //发送post请求
            console.log('url',url)
            console.log('data',data)
            promise=axios.post(url,data)
        }

        promise.then(function (response) {
            //成功则调用resolve()
            resovle(response.data)
        }).catch(function (error) {
            //失败则调用reject()
            reject(error)
        })
    })
}