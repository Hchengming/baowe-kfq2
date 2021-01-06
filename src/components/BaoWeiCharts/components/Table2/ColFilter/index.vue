<template>
  <div v-show="isShow" class="colFilter">
    <el-tree
      :data="tableColums"
      :default-expand-all="true"
      :props="defaultProps"
      :node-key="nodeKey()"
      show-checkbox
      @check-change="handleCheckChange"
    />
  </div>
</template>
<script>
export default {
  props: {
    tableColums: {
      type: Array, default: null
    },
    settingForm: {
      type: Object, default: null
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isShow: false
    }
  },
  methods: {
    nodeKey() {
      let key = ''
      if (this.settingForm.tablefunctionalComponents && this.settingForm.tablefunctionalComponents.length > 0) {
        key = 'id'
        this.defaultProps.label = 'label'
      } else {
        key = 'key'
        this.defaultProps.label = 'explain'
      }
      return key
    },
    // 节点选中变化事件
    handleCheckChange(val, offon) {
      console.log(val, offon, 'checkChange')
    }
  }
}
</script>
<style lang="scss" scoped>
   .colFilter{
     position: absolute;
     right: 0;
     top: 40px;
     background:white;
     z-index: 9;
     padding: 10px;
     box-shadow: 0 0 5px #3b85d8 ;
   }
</style>
