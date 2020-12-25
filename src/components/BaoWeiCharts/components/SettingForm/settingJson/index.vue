<template>
  <div class="setting-json" :style="{ top: scrollTop + 'px' }">
    <div class="setting-json-box">
      <p
        :class="[
          'setting-json-show',
          'theme-color',
          { 'setting-json-false': isShow }
        ]"
        :style="{ top: `50% + ${scrollTop}px` }"
        @click="settingJsonShow"
      >
        {{ isShow ? '配置数据收起' : '配置数据展示' }}
      </p>

      <el-input
        v-if="isShow"
        v-model="settingJson"
        type="textarea"
        :rows="18"
        placeholder="js脚本"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    form: {
      type: Object,
      default: null
    },
    scrollTop: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      settingJson: '',
      isShow: false
    }
  },
  watch: {
    form: {
      handler() {
        this.setSettingJson()
      },
      deep: true
    },
    settingJson: {
      handler() {
        this.setForm()
      },
      deep: true
    }
  },
  methods: {
    // 配置数据 json展示模块显示事件
    settingJsonShow() {
      this.isShow = !this.isShow
      if (this.isShow) this.setSettingJson()
    },
    setSettingJson() {
      this.settingJson = JSON.stringify(this.form, null, '\t')
    },
    setForm() {
      if (!this.settingJson) return false
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
