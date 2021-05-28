<template>
  <!-- 区县-单选-通用组件 -->
  <div
    ref="countryRadio"
    class="country-radio"
    style="display: flex;padding:10px"
  >
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
      <br>
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
export default {
  data() {
    return {
      countryData: [
        {
          value: '所有',
          children: []
        },
        {
          value: '主城都市区',
          children: [
            '所有',
            '渝中区',
            '大渡口区',
            '江北区',
            '沙坪坝区',
            '高新区',
            '九龙坡区',
            '南岸区',
            '北碚区',
            '渝北区',
            '巴南区',
            '两江新区',
            '涪陵区',
            '长寿区',
            '江津区',
            '合川区',
            '永川区',
            '南川区',
            '綦江区',
            '大足区',
            '璧山区',
            '铜梁区',
            '潼南区',
            '荣昌区',
            '万盛区',
            '双桥区'
          ]
        },
        {
          value: '渝东北',
          children: [
            '所有',
            '万州区',
            '开州区',
            '梁平区',
            '城口县',
            '丰都县',
            '垫江县',
            '忠县',
            '云阳县',
            '奉节县',
            '巫山县',
            '巫溪县'
          ]
        },
        {
          value: '渝东南',
          children: [
            '所有',
            '黔江区',
            '武隆区',
            '石柱县',
            '秀山县',
            '酉阳县',
            '彭水县'
          ]
        }
      ], // 区县数据
      countryChild: [],
      oldCountry: '',
      country: {
        father: '所有',
        child: ''
      },
      commonItem: {
        isAddPower: false,
        key: 'country'
      },
      form: {
        country: ''
      },
      mapArr: []
    }
  },
  mounted() {
    const arr1 = this.countryData[1].children.slice(1)
    const arr2 = this.countryData[2].children.slice(1)
    const arr3 = this.countryData[3].children.slice(1)
    const arr = ['所有']
      .concat(arr1)
      .concat(arr2)
      .concat(arr3)
    this.$set(
      this.countryData[0],
      'children',
      arr
    )
    this.countryChild = arr
    this.mapArr = []
    this.chooseInit()
    this.setStyle()
  },
  methods: {
    setStyle() {
      this.$nextTick(() => {
        const countryRadios = this.$refs['countryRadio']
        if (!countryRadios) return
        const inner = countryRadios.querySelectorAll(
          '.country-2 .el-radio-button'
        )

        inner.forEach(x => {
          x.querySelector('.el-radio-button__inner').style.border = 'none'
          x.querySelector('.el-radio-button__inner').style['box-shadow'] = '-1px 0 0 0 white'
          // console.log(x.querySelector('.el-radio-button__inner').style)
        })
        document.querySelector('.country-2 .is-active .el-radio-button__inner').style['box-shadow'] = '-1px 0 0 0 white'
      })
    },
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
          this.countryData.forEach(items => {
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
      this.countryData.forEach(items => {
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
        this.countryData.forEach(items => {
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
      this.country.child = ''
      this.mapArr = []
      this.countryData.forEach(item => {
        if (val === item.value) {
          this.countryChild = item.children
          if (item.children) {
            this.form[this.commonItem.key] = item.children.slice(1).toString()
            this.country.child = item.children[0]
            this.mapArr = item.children.slice(1)
          } else {
            this.form[this.commonItem.key] = val
            this.mapArr = [val]
          }
        }
      })
      if (val === '所有') {
        this.form[this.commonItem.key] = this.countryRadioValue()
      }
      this.setStyle()
      this.submit()
    },
    // 子级数据变化事件
    childChange(val) {
      this.form[this.commonItem.key] =
        val === '所有' ? this.countryChild.slice(1).toString() : val
      this.mapArr = val === '所有' ? this.countryChild.slice(1) : [val]
      this.submit()
      this.setStyle()
    },
    submit() {
      // 组件交互
      // eb4b6552f509458382bdd84769213794  地图
      const arr = [
        '37480bb3090549539adef30f9e997e1e',
        '4e8fd00de6354ff9b1ca472013c1115b',
        '371fe2bc92c64eb6b6a7fb7bf825b49e',
        '49adeb92d5944b16b8e8240a12b345c5',
        '5cf346dd54ff45e89d6e5b52aee720a4',
        'eb4b6552f509458382bdd84769213794'
      ]
      const obj1 = {
        interactiveModuleId: '1b65a852-eca4-41b9-aee8-69e05208e58d', // 交互组件id
        param: {
          // 传递参数
          areaName: this.form.country
        }
      }
      localStorage.setItem('customComponentsParam', JSON.stringify(obj1))
      let num = 1
      arr.forEach(moduleId => {
        num += 1
        setTimeout(() => {
          const obj = {
            interactiveModuleId: moduleId, // 交互组件id
            param: {
              // 传递参数
              AreaName: this.form.country
            }
          }
          localStorage.setItem('customComponentsParam', JSON.stringify(obj))
        }, 100 * num)
      })
      const map = document.getElementById('ifrmmap')
      map.contentWindow.postMessage(
        `locationToArea|${JSON.stringify(this.mapArr)}`,
        '*'
      )
    },
    // 数据值数组化
    countryRadioValue() {
      this.mapArr = []
      let str = ''
      this.countryData.forEach(item => {
        if (item.children) {
          item.children.forEach(x => {
            if (x !== '所有') {
              if (str === '') {
                str = x
              } else {
                str += ',' + x
              }
            }
          })
        }
      })

      return str
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
