<template>
  <div class="fieldset-list">
    <fieldset class="param-config-setting">
      <!-- paramConfig -->
      <legend class="theme-color">请求参数配置</legend>
      <el-button
        v-if="componentType !== 'iframe'"
        size="small"
        @click="getparamConfig"
      >
        参数获取
      </el-button>
      <br>
      <ul class="zdpz_list param-config-list">
        <li class="zdpz_list_header">
          <span>参数名</span>
          <span>释义</span>
          <span>值</span>
          <span>数据类型</span>
          <span>是否使用</span>
        </li>
        <li
          v-for="(item, index) in form.paramConfig"
          :key="index"
          class="zdpz_list_content"
        >
          <span>
            <el-input
              v-model="item.paramKey"
              size="mini"
              placeholder="参数名"
            />
          </span>
          <span>
            <el-input
              v-model="item.description"
              size="mini"
              placeholder="释义"
            />
          </span>
          <span>
            <el-input
              v-model="item.paramValue"
              placeholder="请选择"
              size="small"
              class="input-with-select"
              :title="item.paramValue"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click.native="treeShow(item, index)"
              />
            </el-input>
            <!-- <el-input size="mini"
                            placeholder="值"
            v-model="item.paramValue"></el-input>-->
          </span>
          <span>
            <el-input
              v-model="item.dataType"
              size="mini"
              placeholder="数据类型"
            />
          </span>
          <span>
            <el-checkbox v-model="item.isUse" @change="useChange" />
          </span>
        </li>
      </ul>
    </fieldset>

    <fieldset v-if="componentType !== 'iframe'" class="keys-config-setting">
      <legend class="theme-color">颜色配置</legend>
      <slot name="keys" />
    </fieldset>

    <!-- 树形弹窗 -->
    <tree-model
      ref="treeModel"
      :tree-data="treeData"
      @elTreeSubmit="elTreeSubmit"
    />
  </div>
</template>
<script>
import ParamKeyConfigMixins from './ParamKeyConfigMixins.js'
import TreeModel from '../TreeModel/index'
export default {
  components: { TreeModel },
  mixins: [ParamKeyConfigMixins],
  props: {
    itemApiData: {
      type: Array,
      default: null
    },
    form: {
      type: Object,
      default: null
    },
    statisticsAll: {
      type: Object,
      default: null
    },
    whereForm: {
      type: Object,
      default: null
    },
    parentParamsAll: {
      type: Object,
      default: null
    },
    componentType: {
      type: String,
      default: null
    }
  }
}
</script>
