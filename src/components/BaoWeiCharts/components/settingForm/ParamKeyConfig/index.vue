<template>
  <div class="fieldset-list">
    <fieldset class="param-config-setting">
      <!-- paramConfig -->
      <legend class="theme-color">请求参数配置</legend>
      <el-button size="small"
                 @click="getparamConfig" v-if="componentType!=='iframe'">参数获取</el-button><br />
      <ul class="zdpz_list param-config-list">
        <li class="zdpz_list_header">
          <span>参数名</span>
          <span>释义</span>
          <span>值</span>
          <span>数据类型</span>
          <span>是否使用</span>
        </li>
        <li class="zdpz_list_content"
            v-for="(item,index) in form.paramConfig"
            :key="index">
          <span>
            <el-input size="mini"
                      placeholder="参数名"
                      v-model="item.paramKey"></el-input>
          </span>
          <span>
            <el-input size="mini"
                      placeholder="释义"
                      v-model="item.description"></el-input>
          </span>
          <span>
            <el-input placeholder="请选择"
                      size="small"
                      v-model="item.paramValue"
                      class="input-with-select">
              <el-button slot="append"
                         @click.native="treeShow(item,index)"
                         icon="el-icon-search"></el-button>
            </el-input>
            <!-- <el-input size="mini"
                            placeholder="值"
                            v-model="item.paramValue"></el-input> -->
          </span>
          <span>
            <el-input size="mini"
                      placeholder="数据类型"
                      v-model="item.dataType"></el-input>
          </span>
          <span>
            <el-checkbox @change="useChange" v-model="item.isUse"></el-checkbox>
          </span>
        </li>
      </ul>
    </fieldset>

   <fieldset class="keys-config-setting" v-if="componentType!=='iframe'">
       <legend class="theme-color">字段配置</legend>
       <slot name="keys"></slot>
   </fieldset>


    <!-- 树形弹窗 -->
    <tree-model ref="treeModel"
                @elTreeSubmit="elTreeSubmit"
                :treeData="treeData"></tree-model>
  </div>
</template>
<script>
import JSMixins from './mixins.js'
import TreeModel from '../TreeModel/index.vue'
export default {
  mixins: [JSMixins],
  components: { TreeModel },
  props: {
    itemApiData: {
      type: Array
    },
    form: {
      type: Object
    },
    statisticsAll: {
      type: Object
    },
    whereForm: {
      type: Object
    },
    parentParamsAll:{
      type: Object
    },
    componentType:{
      type: String
    }
  }
}
</script>
