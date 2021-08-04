<template>
  <div class="wrap">
    <div class="box-top">
      <p
        v-for="(item, index) in timeData.slice(0, 6)"
        :key="index"
        :style="{ background: item.isWarning ? '#E6A23C' : '#67C23A' }"
      >
        {{ item.date }}
      </p>
    </div>
    <div class="box-center">
      <p
        v-for="(item, index) in timeData.slice(6, 27)"
        :key="index"
        :style="{ background: item.isWarning ? '#E6A23C' : '#67C23A' }"
      >
        {{ item.date }}
      </p>
    </div>
    <div class="box-top box-bottom">
      <p
        v-for="(item, index) in timeData.slice(27)"
        :key="index"
        :style="{ background: item.isWarning ? '#E6A23C' : '#67C23A' }"
      >
        {{ item.date }}
      </p>
    </div>
    <video
      id="video1"
      ref="video"
      :src="src"
      autoplay
      muted
      style=" width: 500; height: 300px; "
      controls
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      // src: 'https://dtgy1q9vuxi5a.cloudfront.net/147196.mp4',
      src: '@/../static/video/movie.mp4',
      num: 1,
      timeData: [
        {
          date: 1,
          isWarning: false
        }
      ]
    }
  },
  mounted() {
    this.setTimeData()
    const video1 = document.getElementById('video1')
    video1.onplay = () => {
      console.log('start')
    }
    video1.onended = () => {
      this.num++
      switch (this.num) {
        case 1:
          this.$refs.video.src = '@/../static/video/movie.mp4'
          break
        case 2:
          this.$refs.video.src = '@/../static/video/video1.mp4'
          break
        case 3:
          this.$refs.video.src = '@/../static/video/video2.mp4'
          break
        case 4:
          this.$refs.video.src = '@/../static/video/video3.mp4'
          this.num = 0
          break
      }
    }
  },
  methods: {
    setTimeData() {
      this.timeData = []
      for (let i = 1; i <= 33; i++) {
        this.timeData.push({
          date: i <= 31 ? i : '',
          isWarning: i < 12
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 217px;
  // transform: scale(0.7);
}
.box-top {
  width: 93px;
  display: flex;
  flex-wrap: wrap;
  border-right: 1px solid #666666;
  margin: 0 auto;
}
.box-center {
  width: 217px;
  display: flex;
  flex-wrap: wrap;
  border-right: 1px solid #666666;
  border-bottom: 1px solid #666666;
  margin: 0 auto;
}
p {
  width: 30px;
  height: 30px;
  border-top: 1px solid #666666;
  border-left: 1px solid #666666;
  text-align: center;
  line-height: 30px;
  color: white;
}
.box-bottom p {
  border-top: none;
  border-left: 1px solid #666666;
  border-bottom: 1px solid #666666;
}
</style>
