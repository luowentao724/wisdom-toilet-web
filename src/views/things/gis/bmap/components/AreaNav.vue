
<template>
    <el-tree 
    :data="data" 
    :props="defaultProps"
    :node-key="defaultProps.id"
    @node-click="handleNodeClick"
    :render-content="renderContent"
    :default-expand-all="true"
    :highlight-current="true"
    ></el-tree>
</template>

<script>
import { getAll } from 'api/things/area/index';
import { getAll as getAllDtu } from 'api/things/stations/index';
export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: '_label',
        id: '_id'
      },
        // 点击次数计数
      count: 0
    };
  },
  methods: {
    renderContent(h, { node, data, store }) {
        // console.log("当前节点类型：",node.data._type);
        // TODO 图标按需要更改
      const icon = node.data._type == 'area' ? 'el-icon-menu' : 'el-icon-search';
      return h('span', [
        h('span', { attrs: { class: icon } }),
        h('span', node.label)
      ]);
    },
    handleNodeClick(data) {
        // console.log(data);
      if (data._type === 'station') {
          // 触发点击子站事件，移动地图
        this.$emit('click', data);
          // 模拟双击
        this.mockDoubleClick(data);
      }
    },
      /**
       * 模拟触发双击事件
       * 当两次点击事件间隔小于300毫秒即算符合双击条件
       */
    mockDoubleClick(data) {
      this.count++;
      setTimeout(() => {
        if (this.count >= 2) {
            this.$emit('double-click', data);
          }
        this.count = 0
      }, 300)
    },
      /**
       * 获取区域树数据
       */
    getTreeData() {
      getAll().then(areas => {
        getAllDtu().then(stations => {
            // 将DTU数据和区域数据组和成树结构
            this.data = this.buildTree(stations, areas);
          });
      });
    },
      /**
       * 将DTU数据根据关联的ID转化到树的节点下
       * @param stations {Array} DTU数据
       * @param areas {Array} 区域数据
       */
    buildTree(stations, areas) {
      this.handleStationData(stations);
      this.handleAreaData(areas);
      const list = [].concat(areas, stations);
      const rootId = -1;
      const tree = [];
        // 双层for循环构建树
      for (const item of list) {
        if (rootId == item.parentId) {
            tree.push(item);
          }
        for (const item2 of list) {
            if (item2._pid == item._id) {
              if (!item.children) {
                item.children = [];
              }
              item.children.push(item2);
            }
          }
      }
      return tree;
    },
      /**
       * 区域数据处理
       */
    handleAreaData(areas) {
      const type = 'area';
      for (const item of areas) {
        item._type = type;
        item._id = type + item.id;
        item._label = item.areaName;
        item._pid = type + item.parentId;
      }
    },
      /**
       * 子站数据处理
       */
    handleStationData(stations) {
      const type = 'station';
      const type2 = 'area';
      for (const item of stations) {
        item._type = type;
        item._id = type + item.id;
        item._label = item.totilName;
        item._pid = type2 + item.areaId;
      }
    }
  },
  mounted() {
    this.getTreeData();
  }
};
</script>
