<template>
  <!-- 区县-下拉-通用组件 -->
  <div class="country-select">
    <div class="country-box">
      <el-select
        v-model="country.father"
        :style="{
          width: commonItem.rightWidth ? commonItem.rightWidth + 'px' : '100px'
        }"
        :disabled="fatherDisabled"
        size="small"
        placeholder="请选择"
        @change="fatherChange"
      >
        <el-option
          v-for="item in countryData"
          :key="item.value"
          :label="item.value"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-show="countryChild.length > 0"
        v-model="country.child"
        :disabled="childDisabled"
        :style="{
          width: commonItem.rightWidth ? commonItem.rightWidth + 'px' : '100px'
        }"
        size="small"
        placeholder="请选择"
        @change="childChange"
      >
        <el-option
          v-for="(x, index) in countryChild"
          :key="index"
          :label="x"
          :value="x"
        />
      </el-select>
    </div>
  </div>
</template>
<script>
import countryData from './country2'
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
      country: {
        father: '',
        child: ''
      },
      fatherDisabled: false,
      childDisabled: false,
      countryData: countryData
    }
  },
  computed: {
    countryChild() {
      let arr = []
      countryData.forEach(item => {
        if (this.country.father === item.value && item.children) {
          arr = item.children
        }
      })

      return arr
    },
    // 所有区县获取
    moreCountry() {
      const arr = []
      this.countryData.forEach(item => {
        if (item.children) {
          item.children.forEach(x => {
            if (x !== '所有') {
              arr.push(x)
            }
          })
        }
      })
      return arr
    }
  },
  mounted() {
    this.defaultCountry()
  },
  methods: {
    // 默认区县选择和权限管理
    defaultCountry() {
      let defaultValue = this.commonItem.defaultValue
      // 判断当前组件是否配置权限管理
      if (this.commonItem.isAddPower) {
        defaultValue = localStorage.getItem('country')
      }
      if (['市局', '全市', '所有'].indexOf(defaultValue) > -1) {
        defaultValue = '全市'
        this.country.father = '全市'
      } else {
        if (this.commonItem.isAddPower) {
          this.fatherDisabled = true
          this.childDisabled = true
        }
      }
      if (defaultValue) {
        this.countryData.forEach(x => {
          if (x.value === defaultValue) {
            this.country.father = x.value
            if (x.children) {
              this.country.child = '所有'
            }
            this.formValue(x.value)
          } else {
            if (x.children) {
              x.children.forEach(y => {
                if (y === defaultValue) {
                  this.country.father = x.value
                  this.country.child = y
                  this.form[this.commonItem.key] = y
                }
              })
            }
          }
        })
      }
    },
    // 片区变化事件
    fatherChange(val) {
      this.country.child = '所有'
      this.form[this.commonItem.key] = this.formValue(val)
      this.$emit('cuntryChange')
    },
    // 片区变化事件
    formValue(val) {
      let arr = []
      countryData.forEach(x => {
        if (x.value === val) {
          if (val === '全市') {
            arr = this.moreCountry
          } else {
            arr = [...x.children]
            arr.splice(0, 1)
          }
        }
      })
      return arr.toString()
    },
    // 区县变化事件
    childChange(val) {
      if (val === '所有') {
        this.form[this.commonItem.key] = this.formValue(this.country.father)
      } else {
        this.form[this.commonItem.key] = val
      }
      this.$emit('cuntryChange')
    }
  }
}
</script>
