<template>
  <div>
    <el-dialog v-drag
               title="图表字段配置"
               class="other-key-setting-dialog"
               :append-to-body="true"
               :visible.sync="isShow">
      <el-form ref="otherKeySettingForm"
               :model="form"
               label-width="110px">
        <el-form-item v-for="(item,index) in otherFormConfig"
                      :key='index'
                      class="row-textarea"
                      :label="item.label">
          <!-- 输入框 -->
          <el-input v-if="item.formType === 'input'"
                    v-model="form[item.key]"
                    v-show="!item.isHide"
                    :type="item.inputType"
                    :rows="item.rows"
                    :title="form[item.key]"
                    :placeholder="placeholder(item)" />
          <i v-if="item.isJscript"
             class="el-icon-full-screen theme-color"
             @click="enlarge('cellRenderer')" />
          <!-- 下拉框 -->
          <el-select v-if="item.formType == 'select'"
                     v-model="form[item.key]"
                     :disabled="item.disabled"
                      v-show="!item.isHide"
                       :title="form[item.key]"
                     :placeholder="placeholder(item)"
                     size="small"
                     >
            <el-option v-for="x in item.selectArr"
                       :key="x.val"
                       :value="x.val"
                       :label="x.lab" />
          </el-select>
           <!-- 带右侧按钮输入框 -->
          <el-input v-if="item.formType === 'inputButton'"
           v-show="!item.isHide"
                    v-model="form[item.key]"
                    :placeholder="placeholder(item)"
                     :title="form[item.key]"
                    size="small"
                    class="input-with-select"
                    >
            <el-button slot="append"
                       icon="el-icon-search"
                       @click.native="inputClick(form,item,index)" />
          </el-input>
         
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <div class="right">
          <!-- <el-button @click="isShow=false">取 消</el-button> -->
          <el-button type="primary"
                     @click="onSubmit">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <js-methods-setting ref="jsMethodsSetting"
                        setting-type="3"
                        @submit="changeJsMethods" />
  </div>
</template>
<script>
import OtherKeySettingMixins from './OtherKeySettingMixins'
import JsMethodsSetting from '../../JsMethodsSetting'
export default {
  components: { JsMethodsSetting },
  mixins: [OtherKeySettingMixins],
  props: {
    // form: {
    //   type: Object,
    //   default: null
    // },
    // otherFormConfig:{
    //    type: Array,
    //   default: null
    // }
  },
}
</script>
