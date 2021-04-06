<template>
  <!-- 区县-单选-通用组件 -->
  <div class="country-radio">
    <!-- <div class="label">区县</div> -->
    <div class="country-box">
      <el-radio-group
        v-model="country.father"
        :disabled="fatherDisabled()"
        class="country-1"
        @change="fatherChange"
      >
        <el-radio-button
          v-for="(item, index) in countryData"
          :key="index"
          :label="item.value"
        />
      </el-radio-group>
      <el-radio-group
        v-model="country.child"
        :disabled="childDisabled()"
        class="country-2"
        @change="childChange"
      >
        <el-radio-button
          v-for="(item, index) in countryChild"
          :key="index"
          :label="item"
        />
      </el-radio-group>
    </div>
  </div>
</template>
<script>
import countryData from './country.json'
export default {
  props: {
    form: { type: Object, default: null },
    commonItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      countryData: countryData, // 区县数据
      countryChild: [],
      oldCountry: '',

      country: {
        father: '所有',
        child: ''
      }
    }
  },
  watch: {
    form: {
      handler(val) {
        if (val.country !== this.country.father) {
          if (val.country === '所有' || val.country !== this.country.child) {
            this.chooseInit()
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    // const arr1 = this.countryData[1].children.slice(1)
    // const arr2 = this.countryData[2].children.slice(1)
    // const arr3 = this.countryData[3].children.slice(1)
    // // console.log(arr1, arr2, arr3)
    // this.$set(this.countryData[0], 'children', ['所有'].concat(arr1).concat(arr2).concat(arr3))
    // this.countryChild = arr1.concat(arr2).concat(arr3)
    this.chooseInit()
  },
  methods: {
    // 判断父级是否不可点击
    fatherDisabled() {
      let offon = true
      if (!this.commonItem.isAddPower) {
        offon = false
      } else {
        const country = localStorage.getItem('country')
        if (country === '市局') {
          offon = false
        }
      }

      return offon
    },
    // 判断子级模块是否不可点击
    childDisabled() {
      let offon = true
      if (!this.commonItem.isAddPower) {
        offon = false
      } else {
        const country = localStorage.getItem('country')
        if (country === '市局') {
          offon = false
        } else {
          countryData.forEach(items => {
            if (items.children) {
              items.children.forEach(item => {
                if (item === country) {
                  this.countryChild = items.children
                  this.country.father = items.value
                  this.country.child = item
                }
              })
            }
          })
        }
      }

      return offon
    },
    // 默认选中数据初始化
    chooseInit() {
      let offon = false
      // 01-默认选中为区域
      countryData.forEach(items => {
        if (items.value === this.form[this.commonItem.key]) {
          this.country.father = items.value
          offon = true
          if (items.children) {
            this.countryChild = items.children
            this.country.child = items.children[0]
          } else {
            this.countryChild = []

            this.country.child = ''
          }
        }
      })
      // 02-默认选中为区县
      if (!offon) {
        countryData.forEach(items => {
          if (items.children) {
            items.children.forEach((item, index) => {
              if (index !== 0 && item === this.form[this.commonItem.key]) {
                this.country.father = items.value
                this.countryChild = items.children
                this.country.child = item
              }
            })
          }
        })
      }
    },
    // 父级数据变化事件
    fatherChange(val) {
      // if (this.commonItem.isDisabled) { return }
      this.country.child = ''
      this.countryData.forEach(item => {
        if (val === item.value) {
          this.countryChild = item.children
          if (item.children) {
            this.form[this.commonItem.key] = item.children.slice(1).toString()
            this.country.child = item.children[0]
          } else {
            this.form[this.commonItem.key] = val
          }
        }
      })
      this.$emit('cuntryChange')
    },
    // 子级数据变化事件
    childChange(val) {
      this.form[this.commonItem.key] =
        val === '所有' ? this.countryChild.slice(1).toString() : val
      this.$emit('cuntryChange')
    }
  }
}
</script>
<style lang="scss" scoped>
.country-radio {
  display: flex;
  .country-box {
    .el-radio-group {
      display: block;
    }
    >>> .el-radio-group.country-2 {
      .el-radio-button .el-radio-button__inner {
        border: none;
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background: none;
        box-shadow: -1px 0 0 0 white;
      }
    }
  }
  .label {
    display: block;
    width: 33px;
    min-width: 33px;
  }
}
</style>
