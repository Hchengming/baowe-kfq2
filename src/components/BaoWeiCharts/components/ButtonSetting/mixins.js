export default {
  data() {
    return {
      buttonTypeArr: [
        'default',
        'primary',
        'success',
        'info',
        'warning',
        'danger'
      ],
      iconArr: [
        {
          label: '定位',
          value: 'iconFrame1'
        }, {
          label: '详情',
          value: 'iconxiangqing'
        }, {
          label: '删除',
          value: 'iconshanchu'
        }, {
          label: '新增',
          value: 'iconzengjia'
        }, {
          label: '编辑',
          value: 'iconbianji'
        }, {
          label: '文档',
          value: 'iconwendang'
        }, {
          label: '宗地',
          value: 'iconzongdi'
        }
      ],
      // renderTypeOptions: [
      //   {
      //     label: '按钮',
      //     value: 'button'
      //   },{
      //     label: '按钮',
      //     value: 'button'
      //   }
      // ],
      // isShow: false,
      nowIndex: 0
      // operateButton: []
    }
  },
  methods: {
    // js脚本配置弹出界面
    jsMethodsSettingShow(item, index) {
      this.nowIndex = index
      this.$refs['jsMethodsSetting'].show(item)
    },
    // 脚本配置确认事件
    changeJsMethods(jsMethods) {
      this.$set(this.operateButton[this.nowIndex], 'jsMethods', jsMethods)
      // this.operateButton[this.nowIndex].jsMethods = jsMethods
    },
    // 其他按钮新增事件
    btnAdd() {
      this.operateButton.push({
        name: '',
        methodsName: '',
        jsMethods: '',
        showBorder: '1',
        renderType: '0',
        icon: '',
        type: 'primary'
      })
    },
    // 其他按钮删除事件
    btnRemove(index) {
      this.operateButton.splice(index, 1)
    },
    sortChange(item, index, num, offon) {
      if (offon) return
      this.operateButton.splice(index, 1)
      this.operateButton.splice(index + num, 0, item)
    },
    // 按钮配置确认事件
    onSubmit() {
      this.isShow = false
      this.$emit('submit', this.operateButton)
    }
  }
}
