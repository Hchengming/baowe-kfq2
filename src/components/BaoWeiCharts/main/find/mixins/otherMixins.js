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
    // 组件方法暴露
    componentFunc(obj) {
      this[obj.method](obj.param)
    },
    // 容器组件内事件传递
    pageViewAdd(obj) {
      this.parentContainerType = 'container'
      this.parentModuleId = obj.moduleId
      this.parentTabsCode = obj.tabsCode
      this.moduleAddClick(obj.type, obj)
    }
  }
}
