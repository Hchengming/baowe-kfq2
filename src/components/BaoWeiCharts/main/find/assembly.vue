<template>
  <ul class="assembly_wrap">
    <li
      :class="['theme-bg',{'theme-box-shadow':choosetype==0}]"
      @click="addAssembly('tableChart')"
      @mouseout="choosetype=null"
      @mousemove="choosetype=0"
    >
      <i class="iconfont icontubiao theme-color" />
      <p>图表组件集</p>
      <div class="mengban">+</div>
    </li>
    <li
      :class="['theme-bg',{'theme-box-shadow':choosetype==1}]"
      @click="addAssembly('topBar')"
      @mouseout="choosetype=null"
      @mousemove="choosetype=1"
    >
      <i class="iconfont icondingbulan theme-color" />
      <p>顶部栏组件</p>
      <div class="mengban">+</div>
    </li>
    <!--  -->
    <!-- <li @click="addAssembly('map')"  :class="['theme-bg',{'theme-box-shadow':choosetype==1}]" @mouseout="choosetype=null"  @mousemove="choosetype=1">
      <i class="iconfont icontubiao theme-color"></i>
      <p>地图组件</p>
      <div class="mengban">+</div>
    </li> -->
  </ul>
</template>
<script>
export default {
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
