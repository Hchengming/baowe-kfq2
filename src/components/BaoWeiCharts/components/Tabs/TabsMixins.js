import drag from '../../utils/drag'
export default {
  data() {
    return {
      drawerShow: false, // 新增抽屉显示
      stretchElelemt: null, // 被拉伸元素
      isAdmin: true, // 权限控制
      activeName: '', // 选中选项编码
      wrapRefs: 'listWrap', // 当前组件的refs
      fatherClassName: 'my_main_content' // 相对定位父级元素类名(当前项目具有唯一性)

    }
  },
  mounted() {
    this.stretchElelemt = this.$refs['listWrap']
    this.isAdmin = this.settingConfig.systemPermissions === 'admin'
    if (this.settingForm.titleData.length > 0) {
      this.activeName = this.settingForm.titleData[0].tabsCode
    }
  },
  computed: {

    // el-tabs-pone 样式
    elTabPaneStyle() {
      const element = document.getElementsByClassName('my_main_content')[0]
      const wrapHeight = (this.settingForm.height * element.scrollHeight) / 100
      return {
        height: this.settingForm.titleIsShow ? wrapHeight - 92 + 'px' : wrapHeight - 51 + 'px'
      }
    },
    // 外层元素样式
    listWrapStyle() {
      const element = document.getElementsByClassName('my_main_content')[0]
      const style = {
        top:
          parseFloat((this.settingForm.top * element.scrollHeight) / 100) +
          'px',
        left:
          parseFloat((this.settingForm.left * element.scrollWidth) / 100) +
          'px',
        'z-index': this.settingForm.zindex,
        width: (this.settingForm.width * element.scrollWidth) / 100 + 'px',
        cursor: this.cursor,
        height: (this.settingForm.height * element.scrollHeight) / 100 + 'px'
      }
      // console.log(this.settingForm)
      return style
    }
  },
  methods: {
    // 标签切换选中事件
    chooseActive(tabsCode) {
      this.activeName = tabsCode
    },
    // 容器组件内事件传递
    componentFunc(obj) {
      this.$emit('componentFunc', obj)
    },
    // 模块拖拽事件
    tabs_mousedown_tz(e) {
      const _this = this
      if (this.isAdmin) {
        drag({
          e,
          settingForm: this.settingForm,
          drag: this.$refs['listWrap'],
          fatherElement: document.getElementsByClassName('my_main_content')[0],
          fnc: () => {
            _this.TZLSKeep()
          }
        })
      }
    },
    // 修改按钮点击事件
    edit() {
      this.$refs['tabsSetting'].show()
    },
    // tabs配置保存
    tabsSettingSubmit(config, close) {
      this.$emit('tabsSettingSubmit', config, close, this.moduleId)
    },
    // 删除确认事件
    deleteTemplate() {
      this.$emit('delete', this.moduleId)
    },
    // tabs点击事件
    handleClick() {
      const fnc = this.settingForm.tabsJs
      if (fnc && fnc.replace(/\s*/g, '')) {
        try {
          // eslint-disable-next-line no-eval
          const test = eval('(false || ' + fnc + ')')
          test({
            activeName: this.activeName,
            settingForm: this.settingForm,
            _this: this
          })
        } catch (e) {
          this.$message({
            type: 'error',
            message: '组件数据加载完成后执行脚本问题：' + e
          })
        }
      }
    },
    // 拖拽、拉伸后提交事件
    TZLSKeep() {
      this.$emit('tabsSettingSubmit', this.settingForm, null, this.moduleId)
    },
    mousedown_left_ls() {

    },
    mousedown_right_ls() {

    }
  }
}
