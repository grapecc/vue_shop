<template>
     <div>
            <!-- 面包屑导航区 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
         </el-breadcrumb>

        <!-- 卡片视图区域 -->
             <el-card>
                <el-row >
                <el-col >
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
               </el-row>

            <!-- 表格 -->
               <tree-table class="treeTable" :data="catelist" 
            :columns="columns"
             :selection-type="false"
             :expand-type= "false"
             :show-index="true"
             index-text="#"
             border>

             <!--是否有效   slot指定模板的名字  slot-scope 接收作用于插槽里面的数据-->
              <template slot="isok" slot-scope="scope">
                <i class="el-icon-success"
                v-if = "scope.row.cat_deleted === false"
                style="color:lightgreen;"></i>
                <i class="el-icon-error" v-else 
                style="color:red;"></i>
             </template>
             <!-- 排序插槽 -->
             <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level=== 0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level=== 1">二级</el-tag>
                <el-tag type="warning" size="mini"v-else>三级</el-tag>
             </template>
             <template slot="opt" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showCateEditDialog(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
             </template>
             
              </tree-table>

               <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum"
                :page-sizes="[1, 3, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total,sizes, prev, pager, next,jumper"
                :total="total">
            </el-pagination>
        </el-card>


        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
             width="50%"
             @close="addCateDialogClosed">
             <el-form :model="addCateForm" 
                :rules="addCateFormRules" 
                ref="addCateFormRef" 
               label-width="100px">
               <el-form-item label="分类名称:" prop="cat_name">
                 <el-input v-model="addCateForm.cat_name"></el-input>
               </el-form-item>
               <el-form-item label="父级分类:" >
                   <!-- options 用来绑定数据源 -->
                <el-cascader expand-trigger= "hover"
                v-model="selectedKeys"
                :options="this.parentCateList"
                :props="cascaderProps"
                @change="parentCateChanged"
                clearable
                class="cascader"
                ></el-cascader>
              </el-form-item>
            </el-form>
           <span slot="footer" class="dialog-footer">
              <el-button @click="addCateDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addCate">确 定</el-button>
           </span>
       </el-dialog>

       <!-- 编辑对话框 -->
       <el-dialog
        title="编辑分类"
        :visible.sync="editCateDialogVisible"
        width="50%"
       >
    <el-form :model="editCateForm" :rules="editCateFormRules"
       ref="editCateFormRef" label-width="80px" >
          <el-form-item label="分类名称" >
              <el-input v-model="editCateForm.cat_name" ></el-input>
         </el-form-item>
         <!-- 提供校验规则需要添加prop -->
         <el-form-item label="分类id" >
            <el-input v-model="editCateForm.cat_pid" disabled></el-input>
         </el-form-item>
       </el-form-item>
     </el-form>
       <span slot="footer" class="dialog-footer">
      <el-button @click="editCateDialogVisible = false">取 消</el-button>
     <el-button type="primary" @click="editCateInfo">确 定</el-button>
  </span>
       </el-dialog>



    </div>
</template>


<script>
export default{
    data() {
        return {
            //查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //商品分类列表
            catelist:[],
            //总数据条数
            total:0,
            //为table指定列的定义
            columns:[
                {
                    label: '分类名称',
                    prop:'cat_name'
                 },
                 {
                    label: '是否有效',
                    ///使用类型模板
                    type:`template`,
                    //定义模板名称
                    template:'isok'
                 },
                 {
                    label: '排序',
                    ///使用类型模板
                    type:`template`,
                    //定义模板名称
                    template:'order'
                 },
                 {
                    label: '操作',
                    type:`template`,
                    template:'opt'
                 },
            ],
            //控制显隐
            addCateDialogVisible:false,
            editCateDialogVisible:false,
            //添加分类的表单数据对象
            addCateForm:{
                //将要分类的名称
                cat_name:'',
                //父级分类的id
                cat_pid:0,
                //分类层级
                cat_level:0

            },
            editCateForm:{
                cat_id: 0,
              cat_name: '',
               cat_pid: 0,
             cat_level: 0
            },
            //添加分类规则对象
            addCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'},
                ]
            },
            editCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'},
                ]
            },
            ///父级分类的列表
            parentCateList: [],
            parentCateList2:[],
            //指定练级选择器的配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                checkStrictly:true,
            },
            //选中的父级分类的id数组
            selectedKeys: [],

           
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        //获取商品分类列表
       async getCateList(){
          const{data : res} = await this.$http.get('categories',{ params: this.queryInfo })
          if(res.meta.status !== 200){
              return this.$message.error('获取分类列表失败！')
          }
        //   console.log(res.data)
          this.catelist = res.data.result
          //为总数条数赋值
          this.total = res.data.total
        },
        //监听pagesize  
        handleSizeChange(newSzie){
            this.queryInfo.pagesize = newSzie
            //重新加载数据
            this.getCateList()
        }, 
        //监听pagenum
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        //点击按钮，展示添加分类的对话框
        showAddCateDialog(){
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        //获取父级分类的数据列表
        async getParentCateList(){
            const {data :res}= await 
            this.$http.get('categories',{ 
                params: { type: 2}
            })

            if(res.meta.status !== 200 ){
                return this.$message.error("获取父级分类数据失败")
            }

            // console.log(res.data)
            this.parentCateList = res.data
        },
        //选择项发生变化触发这个函数
        parentCateChanged(){
            console.log(this.selectedKeys)
            //如果selectedKeys长度大于0，证明选中父级分类
            if(this.selectedKeys.length > 0){
                ///pid 每次取最后的那个值 所以按照索引进行取最后那个的值
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                 //为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        //添加按钮，添加新的分类
         addCate(){
            // console.log(this.addCateForm)
            //进行预校验
            this.$refs.addCateFormRef.validate(async valid =>{
                if(!valid) return
                const {data: res} = await this.$http.post('categories',
                this.addCateForm)
                if(res.meta.status !== 201){
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加成功')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        //监听关闭事件 重置表单数据
        addCateDialogClosed(){
            //将表单的内容进行清空
            this.$refs.addCateFormRef.resetFields()
            //选中的key置为空                
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_level = 0
        },
        async showCateEditDialog(id){
            this.getParentCateList()
            const{data:res} =await this.$http.get('categories/'+id)
            if (res.meta.status !== 200) {
                return this.$message.error('查询分类信息失败')
            }
            console.log(res.data)  
            this.editCateForm = res.data
            this.editCateDialogVisible =true
        },
        editCateInfo(){
            this.$refs.editCateFormRef.validate(async valid=>{
                    if(!valid) return
                    //发起修改用户信息的数据请求
                    const{data :res} = await this.$http.put(
                        'categories/'+this.editCateForm.cat_id,
                          {
                            cat_name:this.editCateForm.cat_name,
                            cat_pid:this.editCateForm.cat_pid
                          }
                        )
                    if(res.meta.status!==200){
                        return this.$message.error('修改失败')
                    }
                   this.editCateDialogVisible = false
            })
        },
        ///删除
        async removeCateById(id){
            const confirmResult= await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
             const{data :res } =await this.$http.delete('categories/'+id
             )

             if (res.meta.status !== 200) {
                return this.$message.error('删除分类失败')
                 }

              this.$message.success('删除分类成功')
              this.getCateList()
        }

    }
}
</script>


<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}

</style>