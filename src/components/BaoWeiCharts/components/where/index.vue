<template>
  <div :class="['staticWhere',{'active':isShow==true}]">
    <el-form
      ref="form"
      :model="whereAll.form"
      label-width="70px"
    >
      <el-form-item
        v-for="(item,index) in whereAll.data"
        :key="index"
        :label="item.label"
      >
        <!-- 输入框 -->
        <el-input
          v-if="item.type=='input'"
          v-model="whereAll.form[item.key]"
          size="small"
        />
        <!-- 下拉框 -->
        <el-select
          v-if="item.type=='select'"
          v-model="whereAll.form[item.key]"
          size="small"
          placeholder="请选择"
        >
          <el-option
            v-for="option in item.arr"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <!-- 单选框 -->
        <el-radio-group
          v-if="item.type=='radio'"
          v-model="whereAll.form[item.key]"
        >
          <el-radio
            v-for="radioItem in item.arr"
            :key="radioItem.value"
            size="small"
            :label="radioItem.value"
          >{{ radioItem.label }}</el-radio>
        </el-radio-group>
        <!-- 多选框 -->
        <!-- <p v-if="item.type=='checkbox'"> {{item.arr[0].value}}</p> -->
        <el-checkbox-group
          v-if="item.type=='checkbox'"
          v-model="whereAll.form[item.key]"
        >
          <el-checkbox
            v-for="(obj,index) in item.arr"
            :key="index"
            size="small"
            :label="obj.value"
          >{{ obj.label }}</el-checkbox>
        </el-checkbox-group>
        <!-- 数字输入框 -->
        <el-input-number
          v-if="item.type=='number'"
          v-model="whereAll.form[item.key]"
          size="small"
        />
        <!-- 多行文本框 -->
        <el-input
          v-if="item.type=='textarea'"
          v-model="whereAll.form[item.key]"
          type="textarea"
          size="small"
          :rows="2"
          placeholder="请输入"
        />
        <!-- 树形弹窗 -->
        <el-input
          v-if="item.type=='tree'"
          v-model="whereAll.form[item.key]"
          placeholder="请选择"
          readonly
          size="small"
          class="input-with-select"
          @click.native="treeShow(item)"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
          />
        </el-input>
      </el-form-item>
    </el-form>
    <treeModel
      ref="treeModel"
      @treeModelSubmit="treeModelSubmit"
    />
    <div class="staticWhereBottom">
      <el-button
        size="small"
        @click="reset"
      >重 置</el-button>
      <el-button
        type="primary"
        size="small"
        @click="onSubmit"
      >查 询</el-button>
    </div>
  </div>
</template>
<script>
import treeModel from './treeModel'
export default {
  components: { treeModel },
  data() {
    return {
      isShow: false,
      whereAll: {
        data: [],
        form: {}
      },

      formClone: {}
    }
  },
  methods: {
    treeModelSubmit(str, item) {
      this.whereAll.form[item.key] = str
    },
    // 树形弹窗弹出事件
    treeShow(item) {
      this.$refs.treeModel.show(item)
    },
    // 弹窗显示事件
    show(screenData, offon) {
      if (
        !screenData ||
        typeof screenData !== 'object'
      ) {
        screenData = []
      }
      this.isShow = offon
      const whereData = JSON.parse(JSON.stringify(screenData))
      this.whereAll.form = {}
      whereData.forEach(item => {
        if (item.defaultValue) {
          this.$set(this.whereAll.form, item.key, item.defaultValue)
        } else {
          if (item.type === 'number') {
            this.$set(this.whereAll.form, item.key, null)
          }
          if (item.type === 'checkbox') {
            this.$set(this.whereAll.form, item.key, [])
          } else {
            this.$set(this.whereAll.form, item.key, '')
          }
        }
      })
      this.$set(this.whereAll, 'data', whereData)
      this.formClone = JSON.parse(JSON.stringify(this.whereAll.form))
      // console.log(this.whereAll.form);
    },
    // 重置按钮点击事件
    reset() {
      this.whereAll.form = JSON.parse(JSON.stringify(this.formClone))
    },
    // 查询按钮点击事件
    onSubmit() {
      const form = JSON.parse(JSON.stringify(this.whereAll.form))
      this.$emit('whereSubmit', form)
      this.isShow = false
    }
  }
}
</script>
