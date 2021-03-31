<template>
  <div v-show="isShow" class="colFilter">
    <el-tree
      :data="treeData"
      :default-expand-all="true"
      :props="defaultProps"
      :node-key="nodeKey()"
      :default-checked-keys="defaultCheckedKeys"
      show-checkbox
      @check="handleCheckChange"
    />
  </div>
</template>
<script>
export default {
  props: {
    tableColums: {
      type: Array,
      default: null
    },
    settingForm: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultCheckedKeys: [],
      isShow: false
    }
  },
  methods: {
    // 递归遍历树形数据
    reduiction(data, fn) {
      data.forEach((item, index) => {
        fn(item, index)
        if (item.children && item.children.length > 0) {
          this.reduiction(item.children, fn)
        }
      })
    },
    // 弹窗显示事件
    show(tableColums) {
      this.isShow = !this.isShow
      if (!this.isShow) return
      this.treeData = tableColums
      this.defaultCheckedKeys = []

      this.reduiction(this.treeData, item => {
        if (item.isShow) {
          if (
            this.settingForm.tableHeaderConfig &&
            this.settingForm.tableHeaderConfig.hierarchy > 1
          ) {
            this.defaultCheckedKeys.push(item.id)
          } else {
            this.defaultCheckedKeys.push(item.key)
          }
        }
      })
    },
    nodeKey() {
      let key = ''
      if (
        this.settingForm.tableHeaderConfig &&
        this.settingForm.tableHeaderConfig.hierarchy > 1
      ) {
        key = 'id'
        this.defaultProps.label = 'label'
      } else {
        key = 'key'
        this.defaultProps.label = 'explain'
      }
      return key
    },
    // 节点点击事件
    handleCheckChange(val, node) {
      // console.log(val, offon)
      if (
        this.settingForm.tableHeaderConfig &&
        this.settingForm.tableHeaderConfig.hierarchy > 1
      ) {
        this.reduiction(this.treeData, item => {
          item.isShow = node.checkedKeys.indexOf(item.id) > -1
          // if (item.id === val.id) {
          //   item.isShow = !item.isShow
          // if (item.children && item.children.length > 0) {
          //   item.children.forEach(xx => {
          //     xx.isShow = !xx.isShow
          //   })
          // }
          // console.log(item.isShow)
          // this.reduiction(item.children, (xx) => {

          // })
          // }
        })
      } else {
        this.treeData.forEach(item => {
          if (item.key === val.key) item.isShow = !item.isShow
        })
      }
      this.$emit('handleCheckChange', this.treeData)
    }
  }
}
</script>
<style lang="scss" scoped>
.colFilter {
  position: absolute;
  right: 0;
  top: 40px;
  background: white;
  z-index: 9;
  padding: 10px;
  box-shadow: 0 0 5px #3b85d8;
  max-height: 600px;
  overflow: auto;
}
</style>
