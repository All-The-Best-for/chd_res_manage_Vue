import ajax from "./ajax";
//加入代理拦截前缀
const BSAE_URL='/api'

// 用户名密码登陆
export const reqPwdLogin=({name,pwd,manageClass})=>ajax(BSAE_URL+'/sms/system/manageLogin',{name,pwd,manageClass},'POST')

// 根据商家管理员id获取商家信息（包括商品信息、订单信息、商家基本信息）
export const reqShopInfo=(manageId)=>ajax(BSAE_URL+'/sms/stallInfolController/getStall?manageId='+manageId)

// 提交一个修改商品信息
export const reqChangeGoodBase=({dishId,dishIcon,dishName,dishPicture1,dishPrice,dishSales,dishSort,dishStar,dishText,oldPrice})=>ajax(BSAE_URL+'/sms/dishInfoController/changeGoodBase',{dishId,dishIcon,dishName,dishPicture1,dishPrice,dishSales,dishSort,dishStar,dishText,oldPrice},'POST')

// 提交一个新增商品信息 这里的dihId是个假数据，默认为0即可，这是为了方便后端接收
export const reqAddGoodBase=({dishId,dishIcon,dishName,dishPicture1,dishPrice,dishSales,dishSort,dishStar,dishText,oldPrice},stallId)=>ajax(BSAE_URL+'/sms/dishInfoController/addGoodBase?stallId='+stallId,{dishId,dishIcon,dishName,dishPicture1,dishPrice,dishSales,dishSort,dishStar,dishText,oldPrice},'POST')

// 删除商品，包含了批量删除和单个删除，post提交的参数是一个数组
export const reqDeleteGoods=({goodList})=>ajax(BSAE_URL+'/sms/dishInfoController/deleteGoods',{goodList},'POST')

// 获取用户信息
export const reqAllUserInfo=()=>ajax(BSAE_URL+'/sms/userInfoController/getUsers')

// 取消订单请求
export const reqCancelOrder=({orderId})=>ajax(BSAE_URL+'/sms/orderUserController/cancelOrder',{orderId},'POST')

// 获取餐厅信息
export const reqAllResInfo=()=>ajax(BSAE_URL+'/sms/restaurantInfoController/getRess')

// 提交一个修改商家信息
export const reqChangeStallBase=({stallId,stallName,stallAccount,stallRestaurant,stallText,stallIcon,stallPicture1,stallPicture2,stallPicture3,stallStar,amount,boxFee,resAddress,dayAmount,isWork})=>ajax(BSAE_URL+'/sms/stallInfolController/changeStallBase',{stallId,stallName,stallAccount,stallRestaurant,stallText,stallIcon,stallPicture1,stallPicture2,stallPicture3,stallStar,amount,boxFee,resAddress,dayAmount,isWork},'POST')

// 获取所有商铺
export const reqShops=()=>ajax(BSAE_URL+'/sms/stallInfolController/getStalls')

// 获取餐厅管理员对应餐厅下辖的商铺
export const reqShopsByRes=(manageId)=>ajax(BSAE_URL+'/sms/stallInfolController/getStallsByRes?manageId='+manageId)

// 请求改变商家营业状态
export const reqChangeStallWork=(stallId)=>ajax(BSAE_URL+'/sms/stallInfolController/changeStallWork?stallId='+stallId)

// 提交一个基本商家信息进行添加
export const reqAddStallBase=({stallId,stallName,stallAccount,stallRestaurant,stallText,stallIcon,stallPicture1,stallPicture2,stallPicture3,stallStar,amount,boxFee,resAddress,dayAmount,isWork},newSecName)=>ajax(BSAE_URL+'/sms/stallInfolController/addStallBase?newSecName='+newSecName,{stallId,stallName,stallAccount,stallRestaurant,stallText,stallIcon,stallPicture1,stallPicture2,stallPicture3,stallStar,amount,boxFee,resAddress,dayAmount,isWork},'POST')

// 删除商家，包含了批量删除和单个删除，post提交的参数是一个数组
export const reqDeleteStalls=({stallList})=>ajax(BSAE_URL+'/sms/stallInfolController/deleteStalls',{stallList},'POST')

// 添加餐厅信息
export const reqAddRes=({resId,resName,resAccount,resStar,resAmount},newTopName)=>ajax(BSAE_URL+'/sms/restaurantInfoController/addRes?newTopName='+newTopName,{resId,resName,resAccount,resStar,resAmount},'POST')

// 修改餐厅名称
export const reqChangeResName=(newResName,resId)=>ajax(BSAE_URL+'/sms/restaurantInfoController/cahngeResName?newResName='+newResName+'&resId='+resId)

// 删除餐厅，包含了批量删除和单个删除，post提交的参数是一个数组
export const reqDeleteRess=({resList})=>ajax(BSAE_URL+'/sms/restaurantInfoController/deleteRess',{resList},'POST')

// 修改用户手机号
export const reqChangeUserPhone=(userId,userPhone)=>ajax(BSAE_URL+'/sms/userInfoController/changeUserPhone?userId='+userId+'&userPhone='+userPhone)

// 添加用户
export const reqAddUser=({userId,userNumber,userName,userSex,userPhone,userAccount,userPassword,userIcon,userPicture})=>ajax(BSAE_URL+'/sms/userInfoController/addUser',{userId,userNumber,userName,userSex,userPhone,userAccount,userPassword,userIcon,userPicture},'POST')

// 删除用户，包含了批量删除和单个删除，post提交的参数是一个数组
export const reqDeleteUsers=({userList})=>ajax(BSAE_URL+'/sms/userInfoController/deleteUsers',{userList},'POST')

// 添加用户
export const reqAddUsers=({userList})=>ajax(BSAE_URL+'/sms/userInfoController/addUsers',{userList},'POST')

// 发送评价请求
export const reqRateByStall=(stallId)=>ajax(BSAE_URL+'/sms/dishAppraisalController/getRateByStall?stallId='+stallId)
