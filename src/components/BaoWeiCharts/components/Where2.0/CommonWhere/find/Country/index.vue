<template>
  <!-- 区县-单选-通用组件 -->
  <div class="country-radio">
    <div class="label">区县</div>
    <div class="country-box">
      <el-radio-group v-model="country.father" @change="fatherChange">
        <el-radio-button
          v-for="(item, index) in countryData"
          :key="index"
          :label="item.value"
        ></el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="country.child" @change="childChange">
        <el-radio-button
          v-for="(item, index) in countryChild"
          :key="index"
          :label="item"
        ></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
import countryData from "./country.json";
export default {
  props: {
    form: { type: Object, default: null },
    commonItem: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      countryData: countryData, //区县数据
      countryChild: [],
      country: {
        father: "所有",
        child: "",
      },
    };
  },
  mounted() {
    countryData.forEach((items) => {
      if (items.value === this.form[this.commonItem.key]) {
        this.country.father = items.value;
        if (items.children) {
          this.countryChild = items.children;
          this.country.child = items.children[0];
        }
      } else if (items.children) {
        items.children.forEach((item) => {
          if (item === this.form[this.commonItem.key]) {
            this.country.father = items.value;
            this.countryChild = items.children;
            this.country.child = item;
          }
        });
      }
    });
    // this.form[this.commonItem.key] = this.country.father;
    // this.$nextTick(() => {
    //   let doc = document.querySelectorAll(".el-radio-button__inner");
    //   let arr = [];
    //   doc.forEach((item) => {
    //     arr.push(item.innerHTML.replace(/\s*/g, ""));
    //   });
    //   console.log(JSON.stringify(arr));
    // });
  },
  methods: {
    //父级数据变化事件
    fatherChange(val) {
      this.country.child = "";
      this.countryData.forEach((item) => {
        if (val === item.value) {
          this.countryChild = item.children;
          if (item.children) {
            this.country.child = item.children[0];
          }
        }
      });
      this.form[this.commonItem.key] = val;
      this.$emit("cuntryChange");
    },
    //子级数据变化事件
    childChange(val) {
      this.form[this.commonItem.key] =
        val === "所有" ? this.country.father : val;
      this.$emit("cuntryChange");
    },
  },
};
</script>
<style lang="scss" scoped>
.country-radio {
  display: flex;
  .country-box {
    .el-radio-group {
      display: block;
    }
  }
  .label {
    display: block;
    width: 33px;
    min-width: 33px;
  }
}
</style>