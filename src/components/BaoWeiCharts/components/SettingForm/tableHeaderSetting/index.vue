<template>
  <div>
    <el-dialog
      v-drag
      :append-to-body="true"
      :visible.sync="isShow"
      title="多表头配置"
      class="table-header-setting-dialog"
    >

      <div>
        表头层级：
        <el-input-number
          v-model="tableHeaderConfig.hierarchy"
          :min="1"
          :max="10"
          :precision="0"
          size="small"
          controls-position="right"
        />
      </div>
      <fieldset>
        <legend class="theme-color">表头配置</legend>
        <!-- <el-button type="primary"
                   @click="addItem"
                   class="header-setting-add"
                   icon="el-icon-plus"></el-button> -->
        <el-tree
          ref="elTree"
          :data="tableHeaderConfig.headerSetting"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :render-content="renderContent"
          :props="defaultProps"
          node-key="id"
          draggable
          @node-click="handleCheckChange"
        />
      </fieldset>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <div class="right">
          <el-button @click="isShow=false">取 消</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
          >确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <edit
      ref="edit"
      :form="form"
      :table-header-config="tableHeaderConfig"
      @submit="headerNameSubmit"
    />
  </div>
</template>
<script>
import JSMixins from './mixins.js'
import Edit from './edit/index.vue'
/**
 * 表头配置
 * 1、表头配置中已配置字段只能为末级，不可添加下级标题；
 * 2、表头配置中末级只能为已配置字段，不可自定义添加
*/
export default {
  components: { Edit },
  mixins: [JSMixins],
  props: {
    form: {
      type: Object,
      default: null
    }
  }

}
</script>
