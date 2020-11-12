<template>
    <div>
          <!-- 面包屑导航区 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

          <!-- 卡片区域 -->

          <el-card>
              <!-- 警告区域 -->
            <el-alert
             title="注意：只允许为第三极分类设置相关参数！"
             type="warning" :closable="false" show-icon>
           </el-alert>
           <!-- 选择商品分类区域 -->
            <el-row >
               <el-col  class="cat_opt">
                    <span>选择商品分类：</span>
                    <el-cascader expand-trigger= "hover"
                    v-model="selectedCateKeys"
                    :options="cateList"
                    :props="cateProps"
                    @change="CateChanged"
                    clearable
                    class="cascader"
                    ></el-cascader>
               </el-col>
           </el-row>

           <!--tab页签区域  -->
           <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
              <!-- 添加动态参数面板 -->
             <el-tab-pane label="动态参数" name="many">
               <el-button type="primary" 
               :disabled = "isBtnDisabled" @click="addDialogVisible = true">
                 添加参数
               </el-button>  
               <!-- 动态参数表格 -->
               <el-table :data="manyTableData" border stripe>
                   <!-- 展开列 -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag v-for="(item,i) in scope.row.attr_vals" 
                            :key="i" closable @close="handleClose(i,scope.row)">
                                {{item}}
                            </el-tag>
                            <!-- 输入的文本框 -->
                            <el-input
                             class="input-new-tag"
                             v-if="scope.row.inputVisible"
                             v-model="scope.row.inputValue"
                             ref="saveTagInput"
                             size="small"
                             @keyup.enter.native="handleInputConfirm
                             (scope.row)"
                             @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column  label="操作" >
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini"
                            icon="el-icon-edit"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button type="danger" size="mini"
                            icon="el-icon-delte"  @click="removeParams(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
               </el-table>
             </el-tab-pane>
             <!-- 添加静态参数面板 -->
             <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" 
                :disabled = "isBtnDisabled"  @click="addDialogVisible = true">
                   添加属性
                </el-button>
                <el-table :data="onlyTableData" border stripe>
                    <!-- 展开列 -->
                     <el-table-column type="expand">
                         <!-- 作用域插槽 -->
                         <template slot-scope="scope">
                            <el-tag v-for="(item,i) in scope.row.attr_vals" 
                            :key="i" closable @close="handleClose(i,scope.row)">
                                {{item}}
                            </el-tag>
                            <!-- 输入的文本框 -->
                            <el-input
                             class="input-new-tag"
                             v-if="scope.row.inputVisible"
                             v-model="scope.row.inputValue"
                             ref="saveTagInput"
                             size="small"
                             @keyup.enter.native="handleInputConfirm
                             (scope.row)"
                             @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                     </el-table-column>
                     <el-table-column type="index"></el-table-column>
                     <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
                     <el-table-column  label="操作" >
                         <template slot-scope="scope">
                             <el-button type="primary" size="mini"
                             icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)" >编辑</el-button>
                             <el-button type="danger" size="mini"
                             icon="el-icon-delte" @click="removeParams(scope.row.attr_id)" >删除</el-button>
                         </template>
                     </el-table-column>
                 </el-table>   
             </el-tab-pane>
           </el-tabs>
         </el-card> 
         <el-dialog
            :title="'添加'+titleText"
            :visible.sync="addDialogVisible"
            width="50%" @close="addDialogClosed"
            >
            <el-form :model="addForm" :rules="addFormRules" 
            ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                  <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
             </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="addParams">确 定</el-button>
             </span>
        </el-dialog>
         <!-- 编辑 -->
        <el-dialog
            :title="'编辑'+titleText"
            :visible.sync="editDialogVisible"
            width="50%"
            >
            <el-form :model="editForm" :rules="editFormRules" 
            ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" >
                  <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
             </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="editParams">确 定</el-button>
             </span>
        </el-dialog>
         
    </div>
</template>


<script>
    export default{
        data() {
            return {
                //商品分类列表
                cateList:[],
                //级联选择框的配置对象
                cateProps:{
                    value:'cat_id',
                     label:'cat_name',
                     children:'children',
                     checkStrictly:true,
                },
                //级联选择器双向绑定数组
                selectedCateKeys:[],
                activeName:'many' ,
                ///动态数据
                manyTableData:[],
                onlyTableData:[],
                addDialogVisible:false,
                editDialogVisible:false,
                ///表单数据对象
                addForm:{},
                editForm:{},
                //添加表单验证规则对象
                addFormRules:{
                    attr_name:[
                        {required:true ,message:'请输入参数名称',trigger :'blur'}
                    ]
                },
                editFormRules:{
                    attr_name:[
                        {required:true ,message:'请输入参数名称',trigger :'blur'}
                    ]
                },
                // 放在再遍历中新增下面的》》》解决联动绑值的问题
                // //控制按钮文本切换
                // inputVisible:false,
                // //文本框输入的内容
                // inputValue:''

            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList(){
              const{data : res}= await this.$http.get('categories')
              if(res.meta.status !== 200 ){
                  return this.$message.err('获取失败!')
              }
              this.cateList = res.data
            //   console.log(res.data)
            },
            //级联选择器选中项变化
            CateChanged(){
                this.getParamsData()
            },
            handleTabClick(){
               console.log(this.activeName)   
               this.getParamsData()
            },
            async getParamsData(){
                // console.log(this.selectedCateKeys)
                ///证明选中的不是三级分类
                if(this.selectedCateKeys.length !== 3){
                    this.selectedCateKeys = []
                    this.manyTableData=[]
                    this.onlyTableData=[]
                    return
                }
                //证明选中的是三级分类
                //categories/:id/attributes
               const{data :res}= await this.$http.get(`categories/${this.cateId}/attributes`,
                {params:{sel: this.activeName}})


                if(res.meta.status!== 200){
                    return this.$message.err('获取参数列表失败！')
                }
                ///将item.attr_vals分隔成新的数组
                res.data.forEach(item  => {
                    ///解决空字符串问题
                    item.attr_vals = item.attr_vals?
                    item.attr_vals.split(' '):[]
                    /////防止每个进行联动绑值
                    //控制文本框的显示与隐藏
                    item.inputVisible =false
                    //文本框输入的值
                    item.inputValue = ''
                })
                console.log(res.data)
                if(this.activeName === 'many'){
                    this.manyTableData = res.data
                }else{
                    this.onlyTableData = res.data
                }
            },
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            addParams(){
                //表单预验证
                this.$refs.addFormRef.validate(async valid =>
                {
                    if( !valid) return
                   const{data:res} = await this.$http.post(`categories/${this.cateId}/attributes`
                      ,{
                         attr_name:this.addForm.attr_name,
                         attr_sel:this.activeName
                     })
                     if(res.meta.status !== 201){
                         return this.$message.error('添加参数失败!')
                     }
                     this.addDialogVisible = false
                     this.getParamsData()
                     return this.$message.success('添加参数成功！')
                     
                })
            },
            async showEditDialog(id){
                
                const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,
                {
                    params:{ attr_sel:this.activeName}
                })
                
                if(res.meta.status !== 200){
                    return this.$message.error('查询获取失败')
                }
                this.editDialogVisible =true
                this.editForm = res.data 
                console.log(res.data)
                return this.$message.success('获取成功！')
            },
            editParams(){
                this.$refs.editFormRef.validate( async valid =>{
                    if(!valid) return
                    //发起修改用户信息的数据请求
                    const{data :res} = await this.$http.put(
                        `categories/${this.cateId}/attributes/
                        ${this.editForm.attr_id}`,
                          {
                            attr_name:this.editForm.attr_name,
                            attr_sel:this.activeName,
                    })
                    console.log(res.data)
                    if(res.meta.status!==200){
                        return this.$message.error('修改失败')
                    }
                   this.editDialogVisible = false
                   this.getParamsData()
                   return this.$message.success('修改成功！')
               })
            },
            async removeParams(id){
                const confirmResult= await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                //type指定前面的小图标
                type: 'warning'
             }).catch(err => err)
             //如果用户确认删除，返回值为字符串 confirm
             //如果用户取消了删除，则返回值为字符串 cancel

              console.log(confirmResult)
             if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除!')
              }
             // console.log('确认了删除')
             const{data :res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`
             )

             if (res.meta.status !== 200) {
                return this.$message.error('删除参数失败!')
                 }

              this.$message.success('删除参数成功!')
              this.getParamsData()
            },
            //文本框是去焦点/摁enter触发
            handleInputConfirm(row){
                if(row.inputValue.trim().length === 0){
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                ///如果没有return 这证明输入的内容，需要做后续处理
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                this.saveAttrVals(row)
            },
            ///
            async saveAttrVals(row){
                 //需要发起请求保存到数据中
                 const{data:res}= await this.$http.put(`categories/${this.cateId}
                /attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                })
                if(res.meta.status !== 200){
                    return this.$message.error('修改参数失败！')
                }
                   this.$message.success('修改参数项成功！')
            },
            showInput(row){
                row.inputVisible = true
                //$nextTick   方法的作用，就是当页面上的元素重新渲染之后，才会指定回调函数中的代码
               //()<=>_
                this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
              });
            },
            //删除对应的参数可选项
            handleClose(i,row){
                row.attr_vals.splice(i,1)
                this.saveAttrVals(row)
            }
        },
        //计算属性
        computed: {
            //如果按钮需要被禁用，联级为三级启用 返回true ，否则返回false
            isBtnDisabled(){
                ///三元运算符
                return  this.selectedCateKeys.length !== 3 ? true:false
                // if(this.selectedCateKeys.length !== 3){
                //     return true
                // }
                // return false
            },
            cateId(){
                return this.selectedCateKeys.length === 3 ?  this.selectedCateKeys[2]:null
                // if(this.selectedCateKeys.length === 3 ){
                //     return this.selectedCateKeys[2]
                // }
                //     return null
            },
            titleText(){
                return this.activeName == 'many' ? '动态参数' : '静态参数'
            }

        },
    }
</script>


<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
.el-tag{
    margin: 10px;
}
.input-new-tag{
    width: 120px;
}
</style>