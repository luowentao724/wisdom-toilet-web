<template>
    <div>
    <el-dialog :title="title" :visible.sync="visible" :before-close="cancelClick">
      <el-form :model="form" :rules="rules" ref="form" :label-width="formLabelWidth" >
      <el-form-item label="DTU名称" prop="totilName">
        <el-input v-model="form.totilName" placeholder="请输入DTU名称" :maxlength="36"></el-input>
      </el-form-item>
      <el-form-item label="设备标识码UID" prop="totilId">
        <el-input v-model="form.totilId" placeholder="请输入设备标识码UID" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="DTU图片" prop="totilPic">
        <!-- <el-upload
          class="avatar-uploader"
          :action="this.file.uploadFileUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.systemLogo" :src="form.systemLogo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
        <el-input v-model="form.totilPic" placeholder="请输入DTU图片地址" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="是否公开" prop="isPublic" >
        <el-radio-group v-model="form.isPublic">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="SIM号" prop="sim">
        <el-input v-model="form.sim" placeholder="请输入SIM号" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="数据规则" prop="dataRuleId">
        <el-select v-model="form.dataRuleId" placeholder="请选择">
          <el-option
            v-for="item in dataRuleList"
            :key="item.id"
            :label="item.ruleName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="维护联系人" prop="relName">
        <el-input v-model="form.relName" placeholder="请输入维护联系人" :maxlength="36"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="relPhone">
        <el-input v-model="form.relPhone" placeholder="请输入电话" :maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="relEmail">
        <el-input v-model="form.relEmail" placeholder="请输入邮箱" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="所属客户" prop="customerId">
        <el-select v-model="form.customerId" placeholder="请选择">
          <el-option
            v-for="item in customerList"
            :key="item.id"
            :label="item.customerName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="泵站数量" prop="bumpNums">
        <el-input-number v-model="form.bumpNums"  :min="1" :max="6"></el-input-number>
      </el-form-item>
      <el-form-item label="便器数量" prop="totilNums">
        <el-input-number v-model="form.totilNums"  :min="1" :max="30"></el-input-number>
      </el-form-item>
      <el-form-item label="所在区域" prop="areaId">
        <el-cascader
          :options="areaTreeData"
          :props="areaProp"
          :clearable="true"
          :change-on-select="true"
          @change="selectArea">
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="areaInfo" >
        <el-input v-model="form.areaInfo" placeholder="请输入详细地址" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入备注" v-model="form.remark" :maxlength="200"> </el-input>
      </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelClick">取 消</el-button>
        <el-button type="primary" @click="handleClick">确 定</el-button>
      </div>
    </el-dialog>

  </div>

    
</template>

<script>
  import { getId, addObj } from 'api/things/stations/index';
  import { fetchTree } from 'api/things/area/index';
  import { getAll } from 'api/things/customer/index';
  import { getAll as getRules } from 'api/things/dataRule/index';
  
  export default {
    props: {
      show: Boolean,
      lat: [String, Number],
      lng: [String, Number]
    },
    data() {
      return {
        // 客户列表数据
        customerList: [],
        // 区域树数据
        areaTreeData: [],
        // 区域自定义级联选项
        areaProp: {
          label: 'areaName',
          value: 'id',
          children: 'children'
        },
        // 数据规则列表
        dataRuleList: [],
        title: '添加DTU',
        _visible: false,
        formLabelWidth: '120px',
        form: {
          id: undefined, // 子站(公厕)id
          dataRuleId: undefined, // 对应数据规则id
          sim: undefined, // sim号
          isPublic: 1, // 是否公开(1公开 0不公开)
          areaInfo: undefined, // 所在地址
          codeSn: undefined, // sn码
          totilName: undefined, // 公厕名称
          totilId: undefined, // 公厕编号
          areaId: undefined, // 区域位置id
          totilNum: undefined, // 便器数量
          bumpNum: undefined, // 泵站数量
          customerId: undefined, // 所属客户id
          remark: undefined, // 备注
          createTime: undefined, // 创建时间
          createMan: undefined, // 创建人id
          totilPic: undefined, // 照片地址
          totilTypeId: undefined, // 公厕类型编号
          totilState: 0, // NULL公厕状态 1在线 0 离线
          relName: undefined, // NULL联系人姓名
          relPhone: undefined, // NULL联系人电话
          relEmail: undefined, // NULL联系人邮箱
          lng: undefined, // 经度
          lat: undefined // 维度
        },
        rules: {
          totilName: [{ required: true, message: 'DTU名称不能为空' }],
          totilId: [{ required: true, message: '设备标识码UID不能为空' }],
          sim: [{ required: true, message: 'SIM号不能为空' }],
          dataRuleId: [{ required: true, message: '数据规则不能为空' }],
          relName: [{ required: true, message: '维护联系人不能为空' }],
          relPhone: [{ required: true, message: '电话不能为空' }],
          customerId: [{ required: true, message: '所属客户不能为空' }],
          bumpNums: [{ required: true, message: '泵站数量不能为空' }],
          totilNums: [{ required: true, message: '便器数量不能为空' }],
          areaId: [{ required: true, message: '所在区域不能为空' }]
        }
      };
    },
    computed: {
      visible: {
        get() {
          return this.show;
        },
        set(val) {
          this._visible = val;
        }
      },
      lat_c() {
        return this.lat;
      },
      lng_c() {
        return this.lng;
      }
  
    },
    methods: {
      getId() {
        getId().then(id => {
          this.form.id = id;
        });
      },
      /**
       * 选择区域
       */
      selectArea(val) {
        // console.log("级联选择值：",val)
        this.form.areaId = undefined;
        if (val && val.length) {
          this.form.areaId = val[val.length - 1];
        }
        // console.log("form.areaId：",this.form.areaId)
      },
      /**
       * 确定保存DTU
       */
      handleClick() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.lat = this.lat_c;
            this.form.lng = this.lng_c;
            const obj = Object.assign({}, this.form);
            console.log('保存的数据：', obj);
            addObj(obj).then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
                // 保存后回调
              this.$emit('success', obj);
            }).catch(e => {
              console.log(e);
                // 失败后调用
              this.$emit('fail', 1);
            })
          } else {
            return false;
          }
        });
        this.resetForm();
      },
      /**
       * 取消操作
       */
      cancelClick() {
        this.$emit('fail', 0);
        this.resetForm();
      },
      /**
       * 重置表单，重置表单后数据与form预设的值一致
       */
      resetForm() {
        this.$refs.form && this.$refs.form.resetFields();
      },

      /**
       * 获取所有客户列表
       */
      getCustomerList() {
        getAll().then(data => {
          this.customerList = data;
        });
      },

      /**
       * 获取区域数据所有数据
       * 用于级联
       */
      getAreaTreeData() {
        fetchTree().then(data => {
          this.areaTreeData = data;
        });
      },

      /**
       * 获取所有客户列表
       */
      getDataRuleList() {
        getRules().then(data => {
          this.dataRuleList = data;
        });
      }

    },
    mounted() {
      // 获取DTU主键Id
      this.getId();
      // 获取客户列表数据
      this.getCustomerList();

      // 获取区域树数据
      this.getAreaTreeData();

      // 获取数据规则列表
      this.getDataRuleList();
    }
  };
</script>