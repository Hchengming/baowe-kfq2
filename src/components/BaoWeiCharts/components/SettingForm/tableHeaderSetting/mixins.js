export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'paramValue'
      },
      tableHeaderConfig: {
        hierarchy: 1,
        headerSetting: [
          {
            label: '表头',
            id: '0',
            hierarchy: 0,
            children: []
          }
        ]
      },
      chooseItem: {}, //当前选中项
      isShow: false
    }
  },
  methods: {
    // 页面显示事件
    show() {
      this.isShow = true
      if (this.form.tableHeaderConfig) {
        this.tableHeaderConfig.hierarchy = this.form.tableHeaderConfig.hierarchy
        this.tableHeaderConfig.headerSetting = this.form.tableHeaderConfig.headerSetting
      }
    },
    // 树形选中保存事件
    onSubmit() {
      this.form.tableHeaderConfig = this.tableHeaderConfig
      this.isShow = false
      // this.$emit('setTableHeaderConfig', this.tableHeaderConfig)
      // console.log(this.tableHeaderConfig)
    },
    handleCheckChange() {},
    //新增按钮点击事件
    append(data) {
      //判断是否为一级表头   一级表头不能进行配置
      if (this.tableHeaderConfig.hierarchy === 1) {
        this.$message({
          message: '当前为一级表头，不能进行多级表头配置',
          type: 'error'
        })
        return false
      }
      this.chooseItem = data
      let type =
        data.hierarchy < this.tableHeaderConfig.hierarchy - 1 ? '0' : '1'
      this.$refs['edit'].show(null, type)
      // console.log(data)
    },
    //修改按钮点击事件
    update(data) {
      this.chooseItem = data
      let type = data.hierarchy < this.tableHeaderConfig.hierarchy ? '0' : '1'
      this.$refs['edit'].show(data.label, type)
      // console.log(data)
    },
    //删除按钮点击事件
    remove(data) {
      this.chooseItem = data
      this.reduiction(this.tableHeaderConfig.headerSetting, item => {
        if (item.children.length > 0) {
          item.children.forEach((val, index) => {
            if (val.id == data.id) {
              item.children.splice(index, 1)
            }
          })
        }
      })
    },
    //递归遍历树形数据
    reduiction(data, fn) {
      data.forEach((item, index) => {
        fn(item, index)
        // console.log('======')
        if (item.children && item.children.length > 0) {
          this.reduiction(item.children, fn)
        }
      })
    },
    //标题新增/修改弹窗保存事件
    headerNameSubmit(dataArr, dialogType) {
      // console.log(dataArr)
      if (dialogType === 'add') {
        //01 新增保存
        this.reduiction(this.tableHeaderConfig.headerSetting, item => {
          if (item.id === this.chooseItem.id) {
            dataArr.forEach(obj => {
              item.children.push({
                label: obj.headerName,
                key: obj.key,
                hierarchy: item.hierarchy + 1,
                id: `${this.chooseItem.id}-${item.children.length + 1}`,
                children: []
              })
            })
          }
        })
        // console.log(this.tableHeaderConfig.headerSetting)
      } else {
        //01 修改保存
        this.reduiction(this.tableHeaderConfig.headerSetting, item => {
          if (item.id === this.chooseItem.id) {
            item.label = dataArr[0].headerName
          }
        })
      }
    },
    //树形自定义配置
    renderContent(h, { node, data }) {
      let key = data.key ? `(${data.key})` : ''
      return (
        <span class="custom-tree-node">
          <span class="left_title">
            {node.data.label}
            {key}
          </span>
          <span class="tree-right-btn">
            <el-button
              size="mini"
              type="text"
              disabled={data.key ? 'disabled' : false}
              on-click={() => this.append(data)}
            >
              新增
            </el-button>

            <el-button
              size="mini"
              type="text"
              disabled={data.id === '0' || data.key ? 'disabled' : false}
              on-click={() => this.update(data)}
            >
              修改
            </el-button>

            <el-button
              size="mini"
              type="text"
              disabled={
                (data.children && data.children.length > 0) || data.id === '0'
                  ? 'disabled'
                  : false
              }
              on-click={() => this.remove(data)}
            >
              删除
            </el-button>
          </span>
        </span>
      )
    }
  }
}
