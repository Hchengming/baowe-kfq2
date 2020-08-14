<template>
  <div>
    <el-dialog title="树形选择弹窗"
               :append-to-body="true"
               :visible.sync="isShow">
      <el-tree ref="elTree"
               :data="data"
               show-checkbox
               node-key="id"
               :default-expanded-keys="[1,2, 3]"
               :default-checked-keys="[]"
               :props="defaultProps"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <div class="right">
          <el-button @click="isShow=false">取 消</el-button>
          <el-button type="primary"
                     @click="onSubmit">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isShow: false,
      fatherItem: {},
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 页面显示事件
    show (item) {
      this.fatherItem = item
      this.isShow = true
    },
    // 树形选中保存事件
    onSubmit () {
      let data = this.$refs.elTree.getCheckedNodes()
      let str
      data.forEach(item => {
        if (!item.children || item.children.length === 0) {
          str ? str = str + ',' + item.label : str = item.label
        }
      })
      this.$emit('treeModelSubmit', str, this.fatherItem)
      this.isShow = false
      //  console.log(this.$refs.elTree.getCheckedNodes())
    },
    getCheckedNodes (data) {
      console.log(data)
    }
  }
}
</script>
