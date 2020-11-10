<template>
    <div class="user_dialog">
        <el-dialog
                :title="LANG.USER_TITLE"
                :visible="showDialog=='user' && globalEvent.userInfo.type==0"
                width="800px"
                @close="op('cancel')"
                center
        >
            <div class="user_body">
                <fieldset>
                    <legend>{{LANG.USER_TABLE_TITLE}}</legend>
                    <div class="user_left" style="overflow:auto;">
                        <!--<div class="top_menu">-->
                            <!--<div>用户名称</div>-->
                            <!--<div>类型</div>-->
                            <!--<div>屏幕墙号</div>-->
                        <!--</div>-->
                        <table>
                            <thead>
                            <tr>
                                <th>{{LANG.USER_TABLE_USERNAME}}</th>
                                <th>{{LANG.VERSION_TYPE}}</th>
                                <th>{{LANG.USER_TABLE_SCREEN_NO}}</th>
                            </tr>
                            </thead>
                         <tbody>
                         <tr :class="{selected:selectedIndex==index}"
                             @click="selectUser(index)"
                             v-for="(item,index) in userList">
                             <td>{{item.name}}</td>
                             <td>{{userTypeList[item.type]}}</td>
                             <td>{{item.type==0?LANG.USER_TABLE_SCREE_ALL:item.screenArr.map((v,k)=>"#"+(v+1)).join(',')}}</td>
                         </tr>
                         </tbody>

                        </table>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>{{LANG.USER_EDIT}}</legend>
                    <div  class="user_right">
                        <div class="item">
                            <span v-html="LANG.USER_USERNAME"></span>
                            <el-input v-model="selectedUser.name" size="mini"></el-input>
                        </div>
                        <div class="item">
                            <span v-html="LANG.USER_PASSWD"></span>
                            <el-input show-password v-model="selectedUser.pass" size="mini"></el-input>
                        </div>
                        <div class="item">
                            <span v-html="LANG.USER_PASSWD_REPEAT"></span>
                            <el-input show-password v-model="repeatPass" size="mini"></el-input>
                        </div>
                        <div class="item">
                            <span v-html="LANG.USER_TYPE"></span>
                            <el-select v-model="selectedUser.type" size="mini" placeholder="无">
                                <el-option
                                        v-for="(item,index) in userTypeList"
                                        :key="index"
                                        :label="item"
                                        :value="index">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="item">
                            <span></span>
                            <el-select v-model="selectedUser.screenArr" :placeholder="LANG.USER_SELEC_SCREEN" size="mini" multiple :disabled="selectedUser.type==0">
                                <el-option
                                        v-for="item in screenList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="item" style="text-align:center;">
                            <el-button size="mini" @click="op('add')">{{LANG.BTN_ADD}}</el-button>
                            <el-button size="mini" @click="op('edit')">{{LANG.BTN_EDIT}}</el-button>
                            <el-button size="mini" @click="op('delete')">{{LANG.BTN_DEL}}</el-button>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div style="text-align:center;margin-top:20px;">
                <el-button size="mini" style="margin-right:50px;" @click="op('sure')">{{LANG.BTN_SURE}}</el-button>
                <el-button size="mini" @click="op('cancel')">{{LANG.BTN_CANCEL}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            let LANG=this.LANGUAGE[this.globalEvent.language];
            return {
                // userType:0,
                selectedIndex:-1,
                userTypeList:[LANG.USER_ROLE_0,LANG.USER_ROLE_1,LANG.USER_ROLE_2],

                userList:[
                    {
                        name:'Administrator',
                        type:0,//0 管理员
                        pass:'',
                        screenArr:[]
                    }
                ],
                selectedUser:{
                    name:'',
                    type:0,//0 管理员
                    pass:'',
                    screenArr:[0,1]
                },
                repeatPass:'',
                selectedScreen:'',
                screenList:[],
                LANG:LANG
            };
        },
        mounted(){
            let total=this.globalEvent.screenInfo.scrGroupArr.length;
            for(let i =0 ;i<total;i++){
                this.screenList.push({
                    label:this.LANG.SCREEN+'#'+(i+1),
                    value:i
                });
            }
        },
        methods:{
            selectUser(index){
                if(this.selectedIndex==index){
                    return ;
                }
                this.selectedIndex=index;
                this.selectedUser=JSON.parse(JSON.stringify(this.userList[index]));
            },
            op(act){
                console.log(act);
                if(act=='add'){
                    if(this.selectedUser.pass!=this.repeatPass){
                        alert(this.LANG.USER_PASSWD_REPEAT_WRONG);
                        return ;
                    }
                    for(let i in this.userList){
                        if(this.userList[i].name==this.selectedUser.name){
                            alert(this.LANG.USER_USERNAME_EXIST);
                            return ;
                        }
                    }

                    this.userList.push({
                        name:this.selectedUser.name,
                        type:this.selectedUser.type,
                        pass:this.selectedUser.pass,
                        screenArr:this.selectedUser.screenArr,
                    });
                }
                else if(act=='delete'){
                    this.userList.splice(this.selectedIndex,1);
                    this.selectedIndex=-1;
                    //置空
                    this.selectedUser={
                        name:'',
                        type:1,
                        pass:'',
                        screenArr:[]
                    };
                }
                else if(act=='edit'){
                    if(this.selectedUser.pass!=this.repeatPass){
                        alert(this.LANG.USER_PASSWD_REPEAT_WRONG);
                        return ;
                    }
                    if(this.selectedIndex>-1){
                        this.userList[this.selectedIndex].name=this.selectedUser.name;
                        this.userList[this.selectedIndex].type=this.selectedUser.type;
                        this.userList[this.selectedIndex].pass=this.selectedUser.pass;
                        alert("已保存");
                    }
                }
                else if(act=='cancel'){
                    this.$emit('sub_event',{'act':'close_kfs'});
                }
                else if(act=='sure'){
                    // console.log(this.userList);
                    let param={
                        userNum:this.userList.length,
                        userInfoArr:[]
                    };

                    for(let i in this.userList){
                        let user={
                            name:this.userList[i].name,
                            password:this.userList[i].pass,
                            type:this.userList[i].type,
                            srcGroupFlag:0,
                        }
                        if(this.userList[i].screenArr.length==0){
                            user.srcGroupFlag=0;
                        }
                        else{
                            for(let k in this.userList[i].screenArr){
                                let no=this.userList[i].screenArr[k]-0;
                                let f=0x1;
                                user.srcGroupFlag=user.srcGroupFlag | (f<<(no+1));
                            }
                        }
                        param.userInfoArr.push(user);
                    }

                    console.log(param);
                    this.$http.post("userAdminWr.cgi",param,()=>{
                        this.$emit('sub_event',{'act':'close_kfs'});
                    });


                }
            }
        }
    }
</script>

<style>
    .user_dialog{width:720px;}
    .user_dialog .user_body{display:flex;}
    .user_dialog fieldset{width:380px;margin-right:20px;border:1px solid #f3f2f0;}
    .user_dialog legend{margin-left:10px;}
    .user_dialog fieldset:last-child{margin-right:0;}
    .user_dialog .user_left,.user_dialog .user_right{    margin: 10px;
        border: 1px solid #dcdcdc;
        padding: 10px;
        height: 300px;}
    .user_body table{width:100%;text-align:center;}
    .user_body td,.user_body th{height:25px;line-height:25px;cursor:pointer;}
    .user_body .item{margin-bottom:15px;}
    .user_body .item .el-input--mini{width:180px;}
    .user_body .item  > span{display:inline-block;width:90px;    word-break: break-word;vertical-align: middle;}
    .user_body tr:hover,.user_body tr.selected{background-color:#f3f2f0;}
</style>