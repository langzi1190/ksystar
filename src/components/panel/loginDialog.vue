<template>
    <div class="login_dialog">
        <div class="img_wrapper">
            <img src="@/assets/images/kystarlogo.png"/>
            <div style="color: #09c3fd;
font-weight: bold;">凯视达拼接器</div>
        </div>
        <div style="display: flex;justify-content: center;margin-top: 50px">
            <div style="width: 300px">
                <table>
                    <tr>
                        <td v-html="LANG.USER_USERNAME"></td>
                        <td>
                            <!--<el-input list="user_history" v-model="user.username" :placeholder="LANG.USER_INPUT_USERNAME"></el-input>-->
                            <!--<datalist id="user_history">-->
                            <!--<option v-for="item in userList">{{item}}</option>-->
                            <!--</datalist>-->
                            <el-select v-model="userIndex"
                                       allow-create
                                       filterable
                                       :filter-method="filterMethod"
                                       automatic-dropdown
                                       default-first-option
                                       placeholder="请输入用户名"
                                       style="width:240px;">
                                <el-option
                                        v-for="(item,index) in userList"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                ></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr><td colspan="2" style="height:30px;"></td></tr>
                    <tr>
                        <td v-html="LANG.USER_PASSWD"></td>
                        <td>
                            <el-input type="password" v-model="user.password" :placeholder="LANG.USER_INPUT_PASSWD" @keydown.enter.native="doLogin"></el-input>
                            <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
                        </td>
                    </tr>
                    <tr><td style="height:30px;"></td><td style="height:30px;">
                        <span style="color:#f44f44;" v-show="wrong_password">{{LANG.TIP_WRONG_PASSWD}}</span>
                    </td></tr>
                    <tr>
                        <!-- 占两行-->
                        <td colspan="2">
                            <!-- 点击事件的两种不同的写法v-on:click和 @click-->
                            <!--<el-button style="width: 300px" type="primary" v-on:click="doLogin">登录</el-button>-->
                            <el-button style="width: 300px;display:block;margin:0 auto;" type="primary" @click="doLogin">{{LANG.USER_LOGIN}}</el-button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

</template>
<script>
    export default {
        data() {
            return{
                user:{
                    username:'Administrator',
                    password:'',
                },
                old_password:"xx",
                wrong_password:false,
                userIndex:'Administrator',
                userHistoryKey:"user_history",
                userList:['Administrator'],
                LANG:this.LANGUAGE[this.globalEvent.language]
            }
        },
        mounted(){
            this.getLoginHistory();
            this.getLanguage();
            // this.test();
        },
        watch:{
            "user.password":function (v,o) {
                if(v!=this.old_password){
                    this.wrong_password=false;
                    this.old_password='xx';
                }
            }
        },
        methods:{
            // test(){
            //     let t=
            //         {
            //             "srcGroupInfo": [
            //                 {
            //                     "id": 0,
            //                     "name": "信号源分组1"
            //                 },
            //                 {
            //                     "id": 1,
            //                     "name": "信号源分组2"
            //                 },
            //                 {
            //                     "id": 2,
            //                     "name": "信号源分组3"
            //                 }
            //             ],
            //             "sceneLoopInfo": [
            //                 {
            //                     "id": 0,
            //                     "name": "场景1"
            //                 },
            //                 {
            //                     "id": 1,
            //                     "name": "场景2"
            //                 }
            //             ],
            //             "userModeInfo": [
            //                 {
            //                     "id": 0,
            //                     "name": "user1"
            //                 },
            //                 {
            //                     "id": 1,
            //                     "name": "user2"
            //                 },
            //                 {
            //                     "id": 2,
            //                     "name": "user3"
            //                 },
            //                 {
            //                     "id": 3,
            //                     "name": "user4"
            //                 },
            //                 {
            //                     "id": 4,
            //                     "name": "user5"
            //                 },
            //                 {
            //                     "id": 5,
            //                     "name": "用户模式6"
            //                 }
            //             ],
            //             "sourceInfo": [
            //                 {
            //                     "cardId": 0,
            //                     "chnArr": [
            //                         {
            //                             "id": 1,
            //                             "name": "S1_1信号源1"
            //                         },
            //                         {
            //                             "id": 2,
            //                             "name": "S1_2信号源2"
            //                         },
            //                         {
            //                             "id": 3,
            //                             "name": "S1_3信号源3"
            //                         },
            //                         {
            //                             "id": 4,
            //                             "name": "S1_4信号源4"
            //                         }
            //                     ]
            //                 }
            //             ],
            //             "winInfo": [
            //                 {
            //                     "usermode": 0,
            //                     "scrGroupArr": [
            //                         {
            //                             "scrGroup": 0,
            //                             "winArr": [
            //                                 {
            //                                     "id": 0,
            //                                     "name": 1111
            //                                 },
            //                                 {
            //                                     "id": 1,
            //                                     "name": 2222
            //                                 },
            //                                 {
            //                                     "id": 2,
            //                                     "name": 3333
            //                                 },
            //                                 {
            //                                     "id": 3,
            //                                     "name": 4444
            //                                 }
            //                             ]
            //                         }
            //                     ]
            //                 },
            //                 {
            //                     "usermode": 1,
            //                     "scrGroupArr": [
            //                         {
            //                             "scrGroup": 0,
            //                             "winArr": [
            //                                 {
            //                                     "id": 0,
            //                                     "name": 1111
            //                                 },
            //                                 {
            //                                     "id": 1,
            //                                     "name": 2222
            //                                 },
            //                                 {
            //                                     "id": 2,
            //                                     "name": 3333
            //                                 },
            //                                 {
            //                                     "id": 3,
            //                                     "name": 4444
            //                                 }
            //                             ]
            //                         },
            //                         {
            //                             "scrGroup": 1,
            //                             "winArr": [
            //                                 {
            //                                     "id": 0,
            //                                     "name": 21111
            //                                 },
            //                                 {
            //                                     "id": 1,
            //                                     "name": 22222
            //                                 },
            //                                 {
            //                                     "id": 2,
            //                                     "name": 23333
            //                                 },
            //                                 {
            //                                     "id": 3,
            //                                     "name": 24444
            //                                 }
            //                             ]
            //                         }
            //                     ]
            //                 }
            //             ]
            //         }
            //
            //     this.globalEvent.transFormatStr(t,'web')
            // },
            filterMethod(v){
                this.userIndex=v;
            },
            getLoginHistory(){
                let userHistory=localStorage.getItem(this.userHistoryKey);
                if(userHistory!==null){
                    userHistory=JSON.parse(userHistory);
                    this.userList=userHistory;
                }
            },
            getLanguage(){
                this.$http.post("languageRd.cgi",{},(ret)=>{
                    this.globalEvent.language= (ret.data===undefined || ret.data.lang===undefined || ret.data.lang==0) ?'zh':'en';
                    this.globalEvent.$emit('language');
                    this.LANG=this.LANGUAGE[this.globalEvent.language];
                    localStorage.setItem('language',this.globalEvent.language)
                });
            },
            doLogin(){

                this.user.username=this.userIndex;
                this.$http.post("login.cgi",{username:this.user.username,password:this.user.password},(ret)=>{
                    if(ret.data.result==1){
                        this.globalEvent.userInfo.password=this.user.password;
                        this.globalEvent.userInfo.username=this.user.username;
                        this.globalEvent.userInfo.type=ret.data.type;



                        if(!this.userList.includes(this.user.username)){
                            this.userList.push(this.user.username);
                            localStorage.setItem(this.userHistoryKey,JSON.stringify(this.userList));
                        }

                        sessionStorage.setItem("login_user",JSON.stringify(this.globalEvent.userInfo));//保存当前用户信息
                        this.$emit("sub_event",{act:'login'});

                    }
                    else{
                        this.old_password=this.user.password;
                        this.wrong_password=true;
                        // this.user.password='';
                    }

                });

                // alert(JSON.stringify(this.user))//可以直接把this.user对象传给后端进行校验用户名和密码
            }
        }
    }
</script>
<style scoped>
    .login_dialog{
        overflow: hidden;
        width: 560px;
        height: 450px;
        background-color: #fff;
        margin: 50px auto;
    }
    table td{height:50px;}
    .login_dialog .img_wrapper{ width: 257px;
        display: flex;
        margin: 40px auto 0;
        height: 50px;
        font-size: 30px;
        line-height: 50px;}
    .login_dialog img{width:50px;margin-right:20px;}
    /*.login_dialog img{margin: 50px auto 0;display: block;width: 300px;}*/
</style>