<template>
  <div>
    <h1 style="font-size:30px;color:red;padding-top:30px">123456</h1>
    <h1 @click="onclick('ef9241805c5411ebb8d91360184ee685')">{{ msg }}</h1>
    <h1 @click="onclick('02b76e70518811eb96a90f4fc37dfaae')">时间轴交互</h1>
    <h1 @click="onclick('a7d51d400c5411ebb6838de450485cc9')">顶部栏交互</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '图表组件集交互测试',
      num: 1
    }
  },
  methods: {
    onclick(moduleId) {
      this.num++
      const obj = {
        interactiveModuleId: moduleId, // 交互组件id
        param: {
          asd: this.num
        }
      }
      localStorage.setItem('customComponentsParam', JSON.stringify(obj))
    }
  }
}
</script>
