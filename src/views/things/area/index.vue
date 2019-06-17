<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
     <el-button-group>
      <el-button type="primary" v-if="areaManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
      <el-button type="primary" v-if="areaManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
      <el-button type="primary" v-if="areaManager_btn_del" :disabled="currentId == -1" icon="delete" @click="handleDelete">删除</el-button>
    </el-button-group>
  </div>

<el-row>
  <el-col :span="8" style='margin-top:15px;'>
    <el-input style='margin-bottom:15px;'
      placeholder="输入区域名称进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree 
      style='overflow: auto;height: 700px; position: static;'
      class="filter-tree"
      :data="treeData"
      node-key="id"
      :current-node-key="this.currentId"
      highlight-current
      :expand-on-click-node="false"
      :props="defaultProps"
      :filter-node-method="filterNode"
      ref="areaTree"
      @node-click="getNodeData"
      default-expand-all
      >
    </el-tree>
    <!-- <el-tree   v-loading="list.loading" ref='orgsTree' :data='orgTree.options'
                :props='orgTree.props' :load='getOrgs' node-key='id' lazy :default-expanded-keys='orgTree.defaultExpandedKeys'
                :highlight-current='true' @node-click='orgTreeNodeClick' :render-content='renderContent'>
              </el-tree> -->
  </el-col>
  <el-col :span="15" style='margin-top:15px;margin-left: 15px;'>
     <el-card class="box-card">
    <el-form :label-position="labelPosition" label-width="80px" :model="form" :rules="rules" ref="form">
      <el-form-item label="上级区域" prop="parentName">
          <el-input v-model="form.parentName" disabled placeholder="请输入上级区域"></el-input>
      </el-form-item>
      <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" :disabled="formEdit"  placeholder="请输入区域名称"></el-input>
      </el-form-item>
          
      <el-form-item label="备注"   prop="remark">
          <el-input v-model="form.remark" :disabled="formEdit" placeholder="请输入备注"></el-input>
      </el-form-item>
       
       <el-form-item v-if="formStatus == 'update'">
        <el-button type="primary" @click="update">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button type="primary" @click="create">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
     </el-card>
  </el-col>
</el-row>
  </div>
</template>

<script>
import {
  fetchTree, getObj, addObj, delObj, putObj
} from 'api/things/area/index';
import { getObjId } from 'api/pubThings';

import { mapGetters } from 'vuex';
export default {
  name: 'menu',
  components: {
    // 'menu-element': () => import('./components/element')
  },
  data() {
    return {
      filterText: '', // tree模糊搜索文本
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      treeData: [],
      areaTypeOptions: ['10', '11', '12', '13', '14'], // 包括国家、省级、市、县、镇5个级别，分别用10，11，12，13，14来表示
      defaultProps: {
        children: 'children',
        label: 'areaName'
      },
      labelPosition: 'right',
      form: {
        id: undefined,
        parentId: undefined,
        parentName: undefined,
        areaType: undefined,
        areaName: undefined,
        remark: undefined,
        children: []
      },
      rules: {
        areaName: [
          {
            required: true,
            message: '请输入区域名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            min: 0,
            max: 200,
            message: '最多输入200 个字符',
            trigger: 'blur'
          }
        ]
      },
      currentId: -1,
      areaManager_btn_add: false,
      areaManager_btn_edit: false,
      areaManager_btn_del: false,
      arrIds: ''
    }
  },
  watch: {
    filterText(val) {
      console.log(val);
      this.$refs.areaTree.filter(val);
    }
  },
  created() {
    this.getList();
    this.areaManager_btn_add = this.elements['areaManager:btn_add'];
    this.areaManager_btn_del = this.elements['areaManager:btn_del'];
    this.areaManager_btn_edit = this.elements['areaManager:btn_edit'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      fetchTree({ areaName: this.filterText }).then(data => {
        this.treeData = data;
        console.log(JSON.stringify(this.treeData))
      });
    },
    setForm(data) {
      this.form.id = data.id;
      this.thisNodeId = this.form.id;
      this.form.parentId = data.parentId;
      this.form.areaType = data.areaType;
      this.form.areaName = data.areaName;
      this.form.remark = data.remark;
      this.form.children = data.children;
      this.currentId = this.form.id;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.areaName.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update';
      }
      getObj(data.parentId).then(response => {
        this.setForm(data)
        if (response.data && response.data.areaName) {
          this.form.parentName = response.data.areaName;
        } else {
          this.form.parentName = data.areaName;
        }
        console.log(this.form);
      });
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = 'update';
      }
    },
    handlerAdd() {
      this.formEdit = false;
      this.formStatus = 'create';
      getObjId().then(response => {
        this.form.id = response.data;
        this.form.parentId = this.currentId;// 父级区域id
        this.form.parentName = this.form.areaName;
        this.form.areaName = undefined;// 区域名称
        this.form.remark = undefined; // 备注
        if (this.form.areaType) {
          this.form.areaType += 1;// 区域类型
        } else {
          this.form.areaType = 10;
        }
      }).catch(err => {
        throw err;
      });
    },
    getDeleteIds(arr) {
      while (arr && arr.length > 0) {
        for (const i of arr) {
          console.log(i.id);
          this.arrIds += i.id + ',';

          this.getDeleteIds(i.children)
        }
        break;
      }
    },
    handleDelete() {
      this.$confirm('此操作将永久删除当前节点和所有子节点数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(JSON.stringify(this.form));
        this.arrIds = this.form.id + ',';
        this.getDeleteIds(this.form.children)
        this.arrIds = this.arrIds.substring(0, this.arrIds.length - 1)
        console.log(this.arrIds);
        delObj(this.arrIds).then(() => {
          this.getList();
          this.resetForm();
          this.onCancel();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        });
      });
    },
    update() {
      putObj(this.form.id, this.form).then(() => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    create() {
      console.log(JSON.stringify(this.form))
      addObj(this.form).then(() => {
        this.getList();
        this.currentId = this.form.id;
        this.onCancel();
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = '';
    },
    resetForm() {
      this.form = {
        id: undefined,
        parentId: undefined,
        parentName: undefined,
        areaType: undefined,
        areaName: undefined,
        remark: undefined,
        children: []
      };
      this.currentId = -1;
    }
  }
}
</script>