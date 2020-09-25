export default {
  data() {
    return {}
  },
  methods: {
    //接口名称变化事件
    urlNameChange(val) {
      //  console.log(val)
      this.itemApiData.forEach(item => {
        if (item.apeName === val) {
          this.form.url = item.aaaRequestUrl
          this.form.options = item.method
        }
      })
    },
    //接口路径变化事件
    urlChange(val) {
      this.itemApiData.forEach(item => {
        if (item.aaaRequestUrl === val) {
          this.form.options = item.method
          this.form.urlName = item.apeName
        }
      })
    },
    //字段获取事件
    getKeysData() {
      this.itemApiData.forEach(item => {
        if (item.aaaRequestUrl === this.form.url && item.param) {
          this.$emit('getKeysData', item.param)
        }
      })
    }
  }
}
