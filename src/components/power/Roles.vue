<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type ="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" border stripe >
                <!-- 展开列 -->
                <el-table-column type="expand" >
                    <template slot-scope="scope ">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1, i1) in scope.row.children"
                        :key="item1.id">
                        
                            <!-- 一行总共24列 -->
                            <!-- 渲染一级权限 -->
                            <el-col :span="5" >
                               <el-tag  closable
                               @close="removeRightById(scope.row , item1.id)">{{item1.authName}}</el-tag>
                               <i class="el-icon-caret-right"></i>
                            </el-col>
                             <!-- 渲染二级权限 和三级权限-->
                            <el-col :span="19">
                                <el-row  :class="[i2 === 0 ?'':'bdtop','vcenter']" v-for="(item2, i2) in item1.children "
                                :key="item2.id" >
                                    <el-col :span="6">
                                        <el-tag type="success"  closable
                                        @close="removeRightById(scope.row , item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag  v-for="(item3, i2) in item2.children " 
                                         :key="item3.id" type="warning" closable
                                         @close="removeRightById(scope.row , item3.id)">
                                         {{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                      <pre>
                      </pre>
                    </template>
                </el-table-column> 
                <el-table-column label="#" type="index" ></el-table-column> 
                <el-table-column label="角色名称" prop="roleName" ></el-table-column> 
                <el-table-column label="角色描述" prop="roleDesc" ></el-table-column> 
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)" >删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>    
        </el-card>
        <!-- 添加角色对话框 -->
         <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="85px">
                <el-form-item label="用户角色" prop="roleName">
                  <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 内容的底部区 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
         </el-dialog>
        <!-- 修改角色对话框 -->
         <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
         width="50%" @close="editDialogCloserd"
         >
            <el-form :model="editForm" :rules="editFormRules"
             ref="editFormRef" label-width="80px" >
                <el-form-item label="用户ID" >
                    <el-input v-model="editForm.roleId" disabled></el-input>
               </el-form-item>
               <!-- 提供校验规则需要添加prop -->
               <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="editForm.roleName"></el-input>
               </el-form-item>
               <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="editForm.roleDesc"></el-input>
             </el-form-item>
           </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo">确 定</el-button>
       </span>
         </el-dialog>

         <!-- 分配权限的对话框 -->
         <el-dialog
          title="分配权限"
          :visible.sync="setRightDialogVisible"
          width="50%"
          >
          <el-tree :data="rightsList" :props="treeProps"  show-checkbox
          node-key="id" default-expand-all
          :default-checked-keys="defKeys"></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
         </span>
        </el-dialog>
    </div>
</template>

<style>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>

<script>
   export default{
       data(){
           return{
            //所有角色列表数据
            roleList:[],
            //所有权限的数据
            rightsList:[],
            //树形控件绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            //默认选中id数组
            defKeys:[],
            //控制显隐
            addDialogVisible:false,
            editDialogVisible:false,
            setRightDialogVisible:false,
            addForm:{
                roleId:'',
                roleName:'',
                roleDesc:''
            },
            editForm:{
            },
            
            addFormRules:{
                roleName:[
                  {required:true,message:'角色名称为必输项',trigger:'blur'},
                  {min:3,max:10,message:'用户名长度在3-10字符之间',trigger:'blur'}
                ],
                roleDesc:[
                 {required:true,message:'角色描述不能为空！',trigger:'blur'},
                ]
            },
            editFormRules:{
                roleName:[ {required:true,message:'角色名称为必输项',trigger:'blur'},
              ],
                roleDesc:[
                 {required:true,message:'角色描述不能为空！',trigger:'blur'},
                ]
            }
             
    
         }  
       },
       created() {
           this.getRolesList()
       },
       methods: {
           //获取所有角色的列表
         async getRolesList(){
             const { data: res } = await this.$http.get('roles')
            //  console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败！')
              }
              this.roleList = res.data
              // console.log(this.roleList)
          },
         addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
         addRole(){
            this.$refs.addFormRef.validate(async valid =>{
                //如果校验失败
                if(!valid) return
                //可以发起添加用户请求

               const{data: res} = await this.$http.post('roles',this.addForm)
                
                if(res.meta.status !== 201){
                    this.$message.error('添加用户失败！')
                }
                this.$message.success('添加用户成功！')
                //隐藏添加用户的对话框
                this.addDialogVisible = false
                //重新获取用户的列表数据
                this.getRolesList()
            })
          },
           //展示编辑用的对话框
         async showEditDialog(id){
            // console.log(id)
           const{data: res} = await this.$http.get('roles/'+id)
            if(res.meta.status !==200){
                return this.$message.error('查询用户信息失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
          },
          //监听修改用户对话框的关闭事件
         editDialogCloserd(){
                this.$refs.editFormRef.resetFields()
            },
         editRoleInfo(){
                this.$refs.editFormRef.validate(async valid=>{
                    if(!valid) return
                    //发起修改用户信息的数据请求
                    const{data :res} = await this.$http.put(
                        'roles/'+this.editForm.roleId,
                          {
                            roleName:this.editForm.roleName,
                            roleDesc:this.editForm.roleDesc
                          }
                        )
                       
                    if (res.meta.status !==200 ) {
                        return this.$message.error('更新用户信息失败')
                    }
                    //关闭对话框
                    this.editDialogVisible = false
                    //提示修改成功
                    this.$message.success('更新用户信息成功')
                    //刷新数据了表
                    this.getRolesList()
                    
                })
            },
            //根据id删除用户的权限
         async  removeRightById(role,rightId){
                //弹框提示是否删除
                const confirmResult =await  this.$confirm('此操作将永久删除该文件',
                 '删除', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
             }).catch(err => err)

             if(confirmResult !=='confirm'){
                return this.$message.info('取消了删除')
             }
             //  console.log("确认了删除")
             const{data :res} = await this.$http.delete
             (`roles/${role.id}/rights/${rightId}`)
             if(res.meta.status  !== 200){
                return this.$message.error('删除权限失败！')
             }
            //  this.getRolesList()
            //防止拓展页合上直接将res最新的数据赋值给role对象
            role.children = res.data
        },
            //根据id删除对应的用户信息
         async removeUserById(id){
                // console.log(id)
               const confirmResult= await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                //type指定前面的小图标
                type: 'warning'
             }).catch(err => err)
             //如果用户确认删除，返回值为字符串 confirm
             //如果用户取消了删除，则返回值为字符串 cancel

             //  console.log(confirmResult)
             if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除')
              }
             // console.log('确认了删除')
             const{data :res } =await this.$http.delete('roles/'+id
             )

             if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败')
                 }

              this.$message.success('删除用户成功')
              this.getRolesList()
            },
        //展示分配权限的对话框
         async showSetRightDialog(role){
             //获取所有权限的数据
            const{data:res}= await this.$http.get('rights/tree')
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限数据失败！ ')
            }
            //把获取的权限数据保存到data中
            this.rightsList = res.data
            console.log(this.rightsList)
            //递归获取三级权限节点的Id
            this.getLeafKeys(role,
              this.defKeys)
             this.setRightDialogVisible = true
         },
        //通过递归的形式，获取角色下的所有三级权限的id，
        //并保存到defKeys数组中
        getLeafKeys(node,arr){
            //判断node下面还有没有孩子，没有孩子则为三级权限
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item =>
            this.getLeafKeys(item,arr))
        }
     }
}
</script>