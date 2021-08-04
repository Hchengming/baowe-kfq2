export default {
  data() {
    return {
      parentContainerType: 'page', // 父级容器类型 page:页面  container 容器组件
      parentModuleId: '', // 当前新增模块父级容器id
      parentTabsCode: '', // 父级选项卡编码
      pageModuleData: {
        timeAxis: this.timeSource, // 时间间轴
        categoryAxis: this.axisSource, // 类目轴
        pageData: []// 图表
      }// 当前页面模块渲染数据
    }
  },
  methods: {
    // 组件点击选中事件
    componentChooseClick(param) {
      this.$refs['componentList'].treeCurrentKey(param.moduleId)
      this.componentListClick({ componentId: param.moduleId || param.componentId })
    },
    // 组件列表点击选中事件
    componentListClick(param) {
      // 自定义组件
      if (this.customComponentsData.length > 0) {
        this.customComponentsData.forEach(x => {
          this.$set(x, 'choose', false)
          x.isShow = x.config.isShow !== '0'
          if (x.moduleId === param.componentId) {
            x.isShow = true
            x.choose = true
          }
        })
      }
      // 图表组件集
      const pageData = this.$refs['middleware'].pageData
      if (pageData && pageData.length > 0) {
        pageData.forEach(x => {
          this.$set(x, 'choose', false)
          x.isShow = x.contentAreaConfig.isShow !== '0'
          if (x.moduleId === param.componentId) {
            x.isShow = true
            x.choose = true
          }
        })
      }
      // tabs容器
      const tabsSettingData = this.$refs['middleware'].tabsSettingData
      if (tabsSettingData && tabsSettingData.length > 0) {
        tabsSettingData.forEach(x => {
          this.$set(x, 'choose', false)
          if (x.moduleId === param.componentId) {
            x.choose = true
          }
        })
      }
      // 顶部栏
      if (this.topBarAll.moduleId) {
        this.$set(this.topBarAll, 'choose', false)
        if (this.topBarAll.moduleId === param.componentId) {
          this.topBarAll.choose = true
        }
      }
      // 时间轴
      if (this.timeSource.length > 0) {
        this.timeSource.forEach(x => {
          this.$set(x.timeAxisConfig, 'choose', false)
          if (x.moduleId === param.componentId) {
            x.timeAxisConfig.choose = true
          }
        })
      }
      // 类目轴
      if (this.axisSource.length > 0) {
        this.axisSource.forEach(x => {
          this.$set(x, 'choose', false)
          if (x.moduleId === param.componentId) {
            x.choose = true
          }
        })
      }
    },
    // 组件方法暴露
    componentFunc(obj) {
      if (this[obj.method]) {
        this[obj.method](obj.param)
      } else {
        // console.log(obj)
        obj.methodsName = obj.method
        this.$emit('elementMethods', obj)
      }
    },
    // 容器组件内事件传递
    pageViewAdd(obj) {
      this.parentContainerType = 'container'
      this.parentModuleId = obj.moduleId
      this.parentTabsCode = obj.tabsCode
      this.moduleAddClick(obj.type, obj)
    },
    // 大数据编排项目初始化数据获取
    setBigData() {
      this.$refs['middleware'].setBigData()
    },
    // 判断右下角新增模块是否可用
    hoverMenuIsShow() {
      let offon = false
      offon = this.settingConfig.systemPermissions === 'admin'
      // 特殊情况--用于大数据编排项目
      if (this.settingConfig.isBigData && offon) {
        offon = this.settingConfig.answerId === this.settingConfig.bigData.bigDataTemplateId
      }
      return offon
    }

  }
}
