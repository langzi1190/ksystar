<template>
    <div style="overflow: hidden;">
        <div style="display: flex;justify-content: center;margin-top: 150px">
            <div style="width: 300px">
                <div style="text-align:center;margin-bottom:20px;font-size:20px;" slot="header" class="clearfix">
                    <span>{{LANG.USER_LOGIN}}</span>
                </div>
                <table>
                    <tr>
                        <td v-html="LANG.USER_USERNAME"></td>
                        <td>
                            <el-input v-model="user.username" :placeholder="LANG.USER_INPUT_USERNAME"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td v-html="LANG.USER_PASSWD"></td>
                        <td>
                            <el-input type="password" v-model="user.password" :placeholder="LANG.USER_INPUT_PASSWD" @keydown.enter.native="doLogin"></el-input>
                            <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
                        </td>
                    </tr>
                    <tr>
                        <!-- 占两行-->
                        <td colspan="2">
                            <!-- 点击事件的两种不同的写法v-on:click和 @click-->
                            <!--<el-button style="width: 300px" type="primary" v-on:click="doLogin">登录</el-button>-->
                            <el-button style="width: 300px" type="primary" @click="doLogin">{{LANG.USER_LOGIN}}</el-button>
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
                LANG:this.LANGUAGE[this.globalEvent.language]
            }
        },
        mounted(){
            this.getLanguage();
        },
        methods:{
            getLanguage(){
                this.$http.post("languageRd.cgi",{},(ret)=>{
                    this.globalEvent.language= (ret.data===undefined || ret.data.lang===undefined || ret.data.lang==0) ?'zh':'en';
                    this.globalEvent.$emit('language');
                    this.LANG=this.LANGUAGE[this.globalEvent.language];
                });
            },
            doLogin(){
                this.$http.post("login.cgi",{username:this.user.username,password:this.user.password},(ret)=>{
                    if(ret.data.result==1){
                        this.globalEvent.userInfo.password=this.user.password;
                        this.globalEvent.userInfo.username=this.user.username;
                        this.globalEvent.userInfo.type=ret.data.type;
                        this.$emit("sub_event",{act:'login'});
                    }
                    else{
                        alert("登录失败");
                    }

                    // this.globalEvent.userInfo.password=this.user.password;
                    // this.globalEvent.userInfo.username=this.user.username;
                    // this.globalEvent.userInfo.type=0;
                    // this.$emit("sub_event",{act:'login'});
                });

                // alert(JSON.stringify(this.user))//可以直接把this.user对象传给后端进行校验用户名和密码
            }
        }
    }
</script>
<style scoped>
    table td{height:50px;}
</style>