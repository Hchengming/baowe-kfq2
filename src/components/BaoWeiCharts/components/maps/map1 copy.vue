<template>
  <el-amap
    vid="amapDemo"
    :zoom="zoom"
    :center="center"
    class="amap-demo"
  >
    <el-amap-marker
      v-for="(marker, index) in markers"
      :key="index"
      :title="marker.title"
      :position="marker.position"
      :vid="index"
    />
  </el-amap>
</template>

  <style>
.amap-demo {
  height: 300px;
}
</style>

<script>
export default {
  data() {
    return {
      zoom: 12,
      center: [106.564313, 29.642688],
      markers: [
        {
          position: [106.564313, 29.642688],
          title: '宝威科技有限公司',
          icon: '//vdata.amap.com/icons/b18/1/2.png'
        }
      ]
    }
  }
}
</script>
