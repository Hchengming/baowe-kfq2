<template>
  <div>
      <!-- 区县-单选-通用组件 -->
    <div class="country-radio">
      <div class="label">区县</div>
      <div class="country-box">
        <el-radio-group v-model="country.father">
          <el-radio-button
            v-for="(item, index) in countryData"
            :key="index"
            :label="item.value"
          ></el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>
<script>
import countryData from "./country.json";
export default {
  data() {
    return {
      countryData: countryData, //区县数据
      country:{
          father:'',
          child:''
      }
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   let doc = document.querySelectorAll(".el-radio-button__inner");
    //   let arr = [];
    //   doc.forEach((item) => {
    //     arr.push(item.innerHTML.replace(/\s*/g, ""));
    //   });
    //   console.log(JSON.stringify(arr));
    // });
  },
};
</script>