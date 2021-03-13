
export default {
  methods: {
    setBigData() {
      this.menuId = this.settingConfig.answerId
      this.$emit('chartsMethods', {
        methodsName: 'setBigData',
        name: '大数据编排项目初始化数据获取',
        param: {}
      })
    }
  }
}
