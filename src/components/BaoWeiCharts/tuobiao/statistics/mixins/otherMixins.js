// 模块拖拽拉伸 位置配置
import drag from '../../../utils/drag'
import exportExcel from '../export/export'
import XLSX from 'xlsx'
import Vue from 'vue'
Vue.prototype.XLSX = XLSX
export default {
  data() {
    return {
      modelStyle: {
        width: 353,
        height: 230
      },
      boxOffon: false, // 内容区域显示控制
      stretchElelemt: null, // 被拉伸元素
      defaultForm: {}, // 表单项默认参数
      isMeng: false
      // chooseClass: '123'// 组件选中类名
    }
  },
  watch: {
    browserXY: {
      handler() {
        this.setDemos()
      },
      deep: true
    },
    settingForm: {
      handler() {
        this.setDemos()
      },
      deep: true
    },
    'statisticsAll.isShow': {
      handler() {
        this.$refs['where'].setWhereAll(this.statisticsAll.conditionAreaConfig)
      },
      deep: true
    }
  },
  mounted() {
    // this.stretchElelemt = this.$refs['statisticsWrap']
    // statisticsAll.isShow !== false||
  },
  computed: {
    componentsShow() {
      let offon = false
      if (this.settingForm.moduleType === '1') {
        offon = true
      } else {
        offon = this.statisticsAll.isShow !== false
      }
      return offon
    },
    listWrapStyle() {
      let style = {}
      // if (this.settingForm.top) {
      const element = this.containerElelemt
        ? this.containerElelemt
        : document.getElementsByClassName('my_main_content')[0]
      style = {
        top:
          parseFloat((this.settingForm.top * element.clientHeight) / 100) +
          'px',
        left:
          parseFloat((this.settingForm.left * element.scrollWidth) / 100) +
          'px',
        'z-index': this.settingForm.zindex,
        width: (this.settingForm.width * element.scrollWidth) / 100 + 'px',
        height: (this.settingForm.height * element.clientHeight) / 100 + 'px'
      }
      if (
        this.settingForm.moduleType === '1' &&
        this.statisticsAll.isShow === false
      ) {
        style.position = 'fixed'
        style.left = window.innerWidth + 'px'
        // style.width = 10 + 'px'
      } else {
        style.position = 'absolute'
      }
      return style
    },
    isAdmin() {
      return this.settingConfig.systemPermissions === 'admin'
    },
    // 删除判断弹出文字
    deleteTitle() {
      let title = ''
      if (
        this.statisticsAll.isRowDrillDown === '1' ||
        this.statisticsAll.drillDownKeyAll
      ) {
        title = '当前模块已配置有子级，是否强制删除当前模块和所有子级模块？'
      } else {
        title = '确定删除删除当前模块？'
      }
      return title
    }
  },
  methods: {
    // 内容模块点击事件
    statisticsBoxClick() {
      if (this.isAdmin) {
        this.$emit('componentFunc', {
          method: 'componentChooseClick',
          name: '组件点击选中事件',
          param: {
            moduleId: this.statisticsAll.moduleId
          }
        })
      }
    },
    // 本地导出excel事件
    localExportExcel() {
      const cloums = []
      this.nowClums().forEach(item => {
        cloums.push({
          field: item.key,
          headerName: item.explain
        })
      })

      exportExcel(
        cloums,
        this.statisticsAll.data,
        this.settingForm.title,
        'text',
        [],
        [],
        this
      )
    },
    // 表单内容区域高度
    boxHeight() {
      let Height = null

      // 判断是否有查询模块
      Height = this.modelStyle.height - 56
      if (
        this.statisticsAll.conditionAreaConfig &&
        this.statisticsAll.conditionAreaConfig.screenData &&
        this.statisticsAll.conditionAreaConfig.screenData.length > 0
      ) {
        let offon = false
        this.statisticsAll.conditionAreaConfig.screenData.forEach(item => {
          if (item.isShow !== '0') {
            offon = true
          }
        })
        if (offon) Height = this.modelStyle.height - 56 - this.whereHeight
      }

      // iframe模块
      if (this.settingForm.moduleType === '1') {
        Height += 55
      } else {
        // 标题栏隐藏
        if (this.settingForm.isHeaderHide) {
          Height += 46
        }
      }
      return Height
    },
    // 图表宽高设置
    setDemos() {
      const element = this.containerElelemt
        ? this.containerElelemt
        : document.getElementsByClassName('my_main_content')[0]
      this.modelStyle.height = parseFloat(
        (this.settingForm.height * element.clientHeight) / 100
      )
      this.modelStyle.width = parseFloat(
        (this.settingForm.width * element.scrollWidth) / 100
      )
    },
    // 模块拖拽事件
    mousedown_tz(e) {
      const _this = this
      if (this.isScaleStretch()) {
        const element = this.containerElelemt
          ? this.containerElelemt
          : document.getElementsByClassName('my_main_content')[0]
        drag({
          e,
          settingForm: this.settingForm,
          drag: this.$refs['statisticsWrap'],
          fatherElement: element,
          fnc: () => {
            _this.TZLSKeep()
          }
        })
      }
    },
    // 是否可拉伸缩放
    isScaleStretch() {
      let offon = this.isAdmin
      // 大数据编排项目判断
      if (this.settingConfig.isBigData) {
        offon =
          this.settingConfig.answerId ===
          this.settingConfig.bigData.bigDataTemplateId
      }
      return offon
    },
    // 模块拖拽拉伸后保存事件 反正喜欢你又不能变了
    TZLSKeep() {
      this.$emit('componentFunc', {
        method: 'updateMoule',
        name: '模块删除按钮点击事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          contentAreaConfig: this.settingForm,
          whereForm: this.whereForm
        }
      })
    },
    // 模块拉伸时添加遮罩避免卡顿
    setBoxOffon(offon) {
      this.boxOffon = offon
    }
  }
}
