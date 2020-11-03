<template>
  <div class="setting-json"
       v-if="isShow">
    <el-input v-model="settingJson"
              type="textarea"
              :rows="18"
              placeholder="js脚本" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      settingJson: '',
      isShow: false
    }
  },
  props: {
    form: {
      type: Object,
      default: null
    }
  },
  watch: {
    form: {
      handler () {
        this.setSettingJson()
      },
      deep: true
    },
    settingJson: {
      handler () {
        console.log('123')
        this.setForm()
      },
      deep: true

    }
  },
  methods: {
    //组件显示事件
    show (offon) {
      this.isShow = offon;
      if (offon) this.setSettingJson()

    },
    setSettingJson () {
      this.settingJson = JSON.stringify(this.form, null, "\t")
    },
    setForm () {
      if (!this.settingJson) return false;
      try {
        const obj = JSON.parse(this.settingJson)
        this.$emit('setForm', obj)
      } catch (e) {
        this.$message({
          message: 'JSON数据格式错误',
          type: 'error'
        })
      }
    }
  }
}
</script>
