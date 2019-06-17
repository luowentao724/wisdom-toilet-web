<template>
<div class="app-container calendar-list-container " >

    <el-row :gutter="20" >
        <el-col :span="21">  
          <div id="section" class="tab_border">
            <el-tabs v-model="activeName" tab-position="left"  @tab-click="handleClick">
              <el-tab-pane label="泵站参数配置" name="first">
                <el-row>
                  <span style="margin-left: 8px;">总运行时间</span>
                </el-row>
                <el-form v-if="isShow" :model="pumpForm" :rules="rulesPump" ref="formPump" label-width="100px" width="200px">
                  <el-form-item v-for="(i,value,index) in pumpForm" v-bind:key="index"  :prop="value"  :label="'泵'+(index+1)+'总运行时间'" >
                     <el-input style="width: 200px;" type="text" v-model="pumpForm[value]" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="updatePump('formPump')">保存修改</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="便器参数配置" name="second">
                <el-row>
                  <span style="margin-left: 8px;">总冲洗次数</span>
                </el-row>
                <el-row>
                  <el-form :model="totilForm" :rules="rulesTotil" ref="formTotil" label-width="100px">
                    <el-form-item v-for="(i,value,index) in totilForm" v-bind:key="index"  :prop="value" :label="'便器'+(index+1)"  >
                      <el-input style="width: 200px;"  type="text" v-model="totilForm[value]" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="updateTotil('formTotil')">保存修改</el-button>
                    </el-form-item>
                  </el-form>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
      
</div>
</template>
<script>
import { getTotilNumPage, getPumpStationDataList, updateListTotil, updateListPump } from 'api/things/energyReport/index';
import { isInteger } from 'utils/util.js';
import { mapGetters } from 'vuex';
export default {
  name: 'params',
  props: {
    dtuId: {
      type: String,
      default: 0
    }
  },
  data() {
    return {
      activeName: 'first', // tabs 组件选中tab值
      isShow: false,
      totilForm: {},
      totilFormId: [],
      rulesTotil: {},

      pumpForm: {},
      pumpFormId: [],
      rulesPump: {},

      totilList: [],
      pumpList: []
    }
  },
  watch: {
    // dtuId
    dtuId(newVal, oldVal) {
      this.initDataList();
    }
  },
  created() {
    this.initDataList();
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  components: {
  },
  methods: {
    // 点击 tabs 标签栏方法
    handleClick() {
      switch (this.activeName) {
        case 'first':
          break;
        case 'second':
          break;
        case 'third':
          break;
        default:
          break;
      }
    },
    // 获取DTU参数,
    initDataList() {
      getPumpStationDataList({ dtuId: this.dtuId }).then(response => {
        response.map((item, index) => {
          this.pumpFormId[index] = item.id;
          this.pumpForm['totalRunTime' + index] = item.totalRunTime;
          this.rulesPump['totalRunTime' + index] =
          [{ required: true, validator: isInteger, trigger: 'blur' }
          ];
        })
        this.isShow = true; // 数据处理完再显示页面
        console.log(this.pumpForm);
      });

      getTotilNumPage({ dtuId: this.dtuId }).then(response => {
        response.map((item, index) => {
          this.totilFormId[index] = item.id;
          this.totilForm['totalNum' + index] = item.totalNum;
          this.rulesTotil['totalNum' + index] =
          [{ required: true, validator: isInteger, trigger: 'blur' }
          ];
        })
      });
    },
    updatePump(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          for (let i = 0, len = this.pumpFormId.length; i < len; i++) {
            this.pumpList[i] = { id: this.pumpFormId[i], totalRunTime: this.pumpForm['totalRunTime' + i] }
          }
          console.log(JSON.stringify(this.pumpList));
          updateListPump(this.pumpList).then(() => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    updateTotil(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          for (let i = 0, len = this.totilFormId.length; i < len; i++) {
            this.totilList[i] = { id: this.totilFormId[i], totalNum: this.totilForm['totalNum' + i] }
          }
          updateListTotil(this.totilList).then(() => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    }

  }
}
</script>
