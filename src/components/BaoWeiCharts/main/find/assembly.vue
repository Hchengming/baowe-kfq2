<template>
  <ul class="assembly_wrap">
    <!-- <li
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
    </li> -->
    <li
      v-for="(item,index) in listData"
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
      choosetype: '',
      listData: [{
        type: 'tableChart',
        name: '图表组件集',
        icon: 'icontubiao'
      }, {
        type: 'topBar',
        name: '顶部栏组件',
        icon: 'icondingbulan'
      }, {
        type: 'axis',
        name: '类目轴',
        icon: 'icondangan'
      }, {
        type: 'timeAxis',
        name: '时间轴',
        icon: 'icondangan'
      }
      // , {
      //   type: 'tabs',
      //   name: 'Tabs切换',
      //   icon: 'icondangan'
      // }
      ]
    }
  },
  methods: {
    addAssembly(type) {
      this.$emit('addAssembly', type)
    }
  }
}
</script>
