<template>
  <ul class="assembly_wrap">
    <li
      v-for="(item,index) in assemblyData"
      :key="index"
      :class="['theme-bg',{'theme-box-shadow':choosetype==index}]"
      @click="addAssembly(item.type)"
      @mouseout="choosetype=null"
      @mousemove="choosetype=index"
    >
      <i :class="['iconfont',item.icon, 'theme-color']" />
      <p>{{ item.name }}</p>
      <div class="mengban">+</div>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    assemblyData: {
      type: Array, default: null
    }
  },
  data() {
    return {
      choosetype: ''
    }
  },
  methods: {
    addAssembly(type) {
      this.$emit('addAssembly', type)
    }
  }
}
</script>
