<template>
  <div class="project-config-wrap">
    <div class="theme-choose">
      <span>主题风格</span>
      <el-radio-group v-model="projectConfig.theme" @change="themeChange">
        <el-radio
          border
          size="medium"
          v-for="(item, index) in themeData"
          :key="index"
          :label="item.value"
          >{{ item.label }}</el-radio
        >
      </el-radio-group>
      <div class="bottom-confirm">
         <el-button type="primary" @click="onSubmit"
          >确 认</el-button> 
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      projectConfig: {
        theme: "0",
      },
      // 项目主题风格选择数据
      themeData: [
        {
          label: "默认主题风格",
          value: "0",
        },
        {
          label: "大屏展示类背景风格",
          value: "1",
        },
        {
          label: "矿项目主题风格",
          value: "2",
        },
      ],
    };
  },
  methods:{
      //项目主体配置确认事件
      onSubmit(){
        // this.$emit('projectConfigSubmit',this.projectConfig)
      },
      //主题风格变化事件
      themeChange(){
         this.$emit('projectConfigChange',this.projectConfig)
      }
  }
};
</script>
<style lang="scss">
.project-config-wrap {
  padding: 0 20px;
  height: 100%;
  position: relative;
  .theme-choose {
    > span {
      color: black;
      font-size: 16px;
    }
    .el-radio.is-bordered {
      margin-left: 0;
      margin-top: 5px;
    }
  }
  .bottom-confirm{
      display: flex;
      justify-content: flex-end;
    //   margin-top: 20px;
      position: absolute;
      bottom: 20px;
      right:20px;
  }
}
</style>