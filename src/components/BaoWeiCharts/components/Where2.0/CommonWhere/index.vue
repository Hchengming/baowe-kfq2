<template>
  <div>
    <!-- 区县-单选-通用组件 -->
    <country
      v-if="commonItem.type==='country-radio'"
      :form="form"
      :common-item="commonItem"
      @cuntryChange="cuntryChange"
    />
  </div>
</template>
<script>
import Country from './find/Country'
export default {
  components: { Country },
  props: {
    form: { type: Object, default: null },
    commonItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  methods: {
    cuntryChange() {
      this.$emit('formSubmit')
    }
  }
}
</script>
