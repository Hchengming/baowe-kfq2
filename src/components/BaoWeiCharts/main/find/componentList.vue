<template>
  <div class="component-list-wrap">
    <i class="el-icon-close" @click="close" />
    <el-tree
      ref="tree"
      :data="treeData"
      :props="defaultProps"
      :highlight-current="true"
      :expand-on-click-node="false"
      node-key="componentId"
      class="filter-tree"
      default-expand-all
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span
          :class="{ 'is-hide': !data.isShow && data.componentId.length > 10 }"
        >{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  props: {
    settingConfig: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      treeData: [
        {
          componentName: '组件列表',
          componentId: '0',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'componentName'
      },
      nowComponentId: '',
      chooseItem: {}
    }
  },
  methods: {
    // 关闭
    close() {
      this.$emit('close')
    },
    // 树形节点选中事件
    treeCurrentKey(componentId) {
      this.$nextTick(() => {
        this.nowComponentId = componentId
        this.$refs.tree.setCurrentKey(componentId)
      })
    },
    // 树形节点点击事件
    handleNodeClick(item) {
      if (item.componentId && item.componentId.length > 10) {
        this.$emit('componentListClick', item)
      }
    },
    // 树形数据初始化事件
    init(params) {
      const childData = []
      // 1、图表组件集数据筛选
      if (params.pageData.length > 0) {
        const obj = {
          componentName: '图表组件集',
          componentId: '1-1',
          children: []
        }
        params.pageData.forEach((x, index) => {
          // if (x.contentAreaConfig.isShow === '1') {
          obj.children.push({
            componentName: x.contentAreaConfig.title || '未命名' + index,
            nowShow: true,
            isShow: x.contentAreaConfig.isShow === '1',
            componentId: x.moduleId,
            type: 'char'
          })
          // }
        })
        childData.push(obj)
      }
      // 2、自定义组件
      if (params.customComponentsData.length > 0) {
        const obj = {
          componentName: '自定义组件',
          componentId: '1-2',
          children: []
        }
        params.customComponentsData.forEach((x, index) => {
          // if (x.contentAreaConfig.isShow === '1') {
          obj.children.push({
            componentName: x.config.title || '未命名' + index,
            nowShow: true,
            isShow: x.config.isShow !== '0',
            componentId: x.moduleId,
            type: 'custom'
          })
          // }
        })
        childData.push(obj)
      }
      this.treeData[0].children = childData
      this.$nextTick(() => {
        if (this.nowComponentId) {
          this.$refs.tree.setCurrentKey(
            this.nowComponentId
          )
        }
      })
      // console.log(this.treeData, childData, 'this.treeData')
    }
  }
}
</script>
<style lang="scss" scoped>
.component-list-wrap {
  padding: 5px 10px 10px 10px;
  width: 220px;
  height: 380px;
  position: fixed;
  bottom: 3px;
  right: 3px;
  // background: #00000059;
  // color: white;
  background: white;
  z-index: 999;
  box-shadow: 0 0 3px #666666;
  text-align: right;
  .el-icon-close {
    font-size: 20px;
    cursor: pointer;
    display: inline-block;
    position: relative;
    z-index: 9;
  }
  >>> .el-tree.el-tree--highlight-current {
    text-align: left;
    background: transparent;
    margin-top: -10px;
    // .el-tree-node.is-current {
    //   background: #e9e9e9 ;
    //    color: #409EFF;
    // }
    .el-tree-node.is-current > .el-tree-node__content {
      background: #e5edf7;
    }
    .is-hide {
      color: #d5d5d5;
    }
  }
}
</style>
