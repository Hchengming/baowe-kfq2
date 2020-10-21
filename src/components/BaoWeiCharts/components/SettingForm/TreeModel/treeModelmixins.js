export const treeModelmixins = {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'paramValue'
      },
      isShow: false
    }
  },
  methods: {
    // 页面显示事件
    show(data) {
      this.isShow = true
      this.$nextTick(() => {
        this.$refs.elTree.setCheckedKeys([])
        if (data.paramValue) {
          this.treeData.forEach(item => {
            if (data.paramValue === item.paramValue) {
              this.$refs.elTree.setCheckedKeys([item.id])
            }
          })
        }
      })
    },
    // 树形选中保存事件
    onSubmit() {
      const data = this.$refs.elTree.getCheckedNodes()
      this.$emit('elTreeSubmit', data[0])
      this.isShow = false
    },
    handleCheckChange(data) {
      this.$refs.elTree.setCheckedKeys([data.id])
      // console.log(data)
    },
    // 树形自定义配置
    renderContent(h, { node }) {
      return (
        <span class='param-tree-node'>
          <span class='txt1 theme-color'>{node.data.paramKey}</span>
          <span class='txt2'>({node.data.paramValue})</span>
        </span>
      )
    }
  }
}
