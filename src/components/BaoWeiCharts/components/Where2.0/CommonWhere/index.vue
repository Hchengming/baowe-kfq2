<template>
  <div>
    <!-- 区县-单选-通用组件 -->
    <country
      :form="form"
      :commonItem="commonItem"
      @cuntryChange="cuntryChange"
      v-if="commonItem.filterItem==='country-radio'"
    ></country>
  </div>
</template>
<script>
import Country from "./find/Country";
export default {
  components: { Country },
  props: {
    form: { type: Object, default: null },
    commonItem: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {};
  },
  methods: {
    cuntryChange() {
      this.$emit("formSubmit");
    },
  },
};
</script>