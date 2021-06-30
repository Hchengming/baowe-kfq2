import dataPresentation from '../SettingForm/dataPresentation.json'
export default {
  props: {
    beforeParamsData: {
      type: Array,
      default: null
    },
    interactiveModuleAll: {
      type: Array,
      default: null
    },
    interactiveData: {
      type: Array,
      default: null
    },
    statisticsAll: {
      type: Object,
      default: null
    }
  },
  data() {
    const _this = this
    return {
      dialogVisible: false,
      fatherIndex: null, // 配置行索引
      nowIndex: null, // 被交互选中模块索引
      // triggerEventAll: [{
      //   lab: '点击触发',
      //   val: 'click'
      // }],
      tableCloums: [
        {
          key: 'moduleId',
          label: '模块名称',
          width: 180,
          formType: 'select',
          selectArr: [],
          change(items) {
            _this.moduleNameChange(items)
          }
        },
        {
          key: 'moduleType',
          label: '模块类型',
          width: 100,
          formType: 'select',
          disabled: true,
          selectArr: []
        },
        {
          key: 'corParams',
          label: '交互对应参数',
          width: 180,
          disabled(items) {
            return items.moduleType === 'iframe'
          },
          formType: 'inputButton',
          click(items, index, item) {
            _this.nowIndex = index
            let interactiveParams = []
            _this.interactiveModuleAll.forEach(obj => {
              if (items.moduleId === obj.moduleId) {
                interactiveParams = obj.interactiveParams
              }
            })
            _this.$refs.correspondingParamSetting.show(
              items.corParams,
              interactiveParams
            )
          }
          // formType(items) {
          //   return ['iframe', 'topBar', 'timeAxis', 'categoryAxis'].indexOf(items.moduleType) > -1 ? 'input' : 'select'
          // },
          // selectArr: []
        },
        {
          key: 'jsMethods',
          label: 'js脚本',
          width: 200,
          formType: 'input',
          inputType: 'textarea',
          rows: 1,
          // disabled(items) {
          //   return items.moduleType !== 'iframe'
          // },
          click(items, index) {
            // if (items.moduleType === 'iframe') {
            _this.nowIndex = index
            _this.$refs['jsMethodsSetting'].show(items)
            // }
          }
        },
        {
          key: 'hideShow',
          label: '显示/隐藏',
          width: 100,
          formType: 'select',
          // disabled(items) {
          //   return ['pie', 'ring', 'histogram', 'bar', 'line', 'radar', 'table', 'list', 'destailTable'].indexOf(items.moduleType) === -1
          // },
          selectArr: [
            {
              lab: '显示',
              val: '1'
            },
            {
              lab: '隐藏',
              val: '0'
            }
          ]
        }
      ],
      interactiveObj: {
        paramsChoose: '', // 已选择参数
        triggerEvent: 'click', // 触发事件
        otherModuleConfig: [] // 其他模板交互数据
      },
      // 当前被选中模块可选择对应参数集合
      interactiveParams: []
    }
  },
  mounted() {
    this.setModyleTypeArr()
  },
  methods: {
    // 事件触发方式
    triggerEventAll() {
      let arr = [
        {
          lab: '点击触发',
          val: 'click'
        }
      ]
      if (
        this.statisticsAll &&
        this.statisticsAll.contentAreaConfig.displayMode === 'table'
      ) {
        arr = [
          {
            lab: '点击触发',
            val: 'click'
          },
          {
            lab: '单元格点击事件',
            val: 'cellClick'
          },
          {
            lab: '行点击事件',
            val: 'rowClick'
          }
        ]
        if (this.statisticsAll && this.statisticsAll.contentAreaConfig.operateButton) {
          this.statisticsAll.contentAreaConfig.operateButton.forEach(item => {
            arr.push({
              lab: `${item.name}操作点击事件`,
              val: item.name
            })
          })
        }
      }
      return arr
    },
    // 模块类型集合数据配置
    setModyleTypeArr() {
      this.tableCloums[1].selectArr = [
        {
          lab: 'iframe框',
          val: 'iframe'
        }
      ]
      dataPresentation.forEach(item => {
        this.tableCloums[1].selectArr.push({
          lab: item.title,
          val: item.type
        })
      })
    },
    // 取消
    close() {
      this.dialogVisible = false
    },
    // 确 定
    onSubmit() {
      this.dialogVisible = false
      this.$emit('interactiveSubmit')
    },
    // 当前模块显示事件
    show() {
      this.$nextTick(() => {
        this.dialogVisible = true
        // 获取所有可交互模块
        const arr = []
        this.interactiveModuleAll.forEach(item => {
          arr.push({
            lab: item.moduleName,
            val: item.moduleId
          })
        })
        this.tableCloums[0].selectArr = arr
      })
    },
    // js脚本配置后返回数据
    changeJsMethods(data) {
      this.interactiveData[this.fatherIndex].otherModuleConfig[
        this.nowIndex
      ].jsMethods = data
    },
    // 模块类型选择变化事件
    moduleNameChange(items) {
      items.corParams = ''
      this.interactiveModuleAll.forEach(obj => {
        if (items.moduleId === obj.moduleId) {
          items.moduleType = obj.type
        }
      })
    },
    // 交互配置新增事件
    addInteractive() {
      this.interactiveData.push({
        paramsChoose: '', // 已选择参数
        triggerEvent: 'click', // 触发事件
        otherModuleConfig: [] // 其他模板交互数据
      })
    },
    // 配置删除事件
    removeInteractive(index) {
      this.interactiveData.splice(index, 1)
    },
    // 参数配置选中确认事件
    correspondingSubmit(corParams) {
      this.interactiveData[this.fatherIndex].otherModuleConfig[
        this.nowIndex
      ].corParams = corParams
    }
  }
}
