<template>
  <article ref="listWrap" :style="listWrapStyle" class="custom-components-view custom-components-view-admin">
    <div class="custom-components-wrap">
      <div class="operation" @mousedown="mousedown_tz">
        <i class="iconfont iconxiugai theme-color" @click="edit" />
        <el-popconfirm
          icon="el-icon-info"
          class="delete-template-popconfirm"
          icon-color="red"
          title="确认删除当前组件？"
          @confirm="deleteTemplate"
        >
          <i slot="reference" title="删除" class="el-icon-delete" />
        </el-popconfirm>
      </div>
      <stretch
        :setting-form="settingForm"
        :stretch-elelemt="stretchElelemt"
        @stretchkeep="TZLSKeep"
      />
    </div>
  </article>
</template>
<script>
import Stretch from '../Stretch'
import drag from '../../utils/drag'
export default {
  components: { Stretch },
  props: {
    settingForm: { type: Object, default: null },
    moduleId: { type: String, default: null },
    settingConfig: { type: Object, default: null }
  },
  data() {
    return {
      stretchElelemt: null // 被拉伸元素
    }
  },
  computed: {
    // 外层元素样式
    listWrapStyle() {
      const element = document.getElementsByClassName('my_main_content')[0]
      const style = {
        top:
          parseFloat((this.settingForm.top * element.scrollHeight) / 100) +
          'px',
        left:
          parseFloat((this.settingForm.left * element.scrollWidth) / 100) +
          'px',
        'z-index': this.settingForm.zindex,
        width: (this.settingForm.width * element.scrollWidth) / 100 + 'px',
        cursor: this.cursor,
        height: (this.settingForm.height * element.scrollHeight) / 100 + 'px'
      }
      // console.log(this.settingForm)
      return style
    }
  },
  mounted() {
    this.stretchElelemt = this.$refs['listWrap']
  },
  methods: {
    // 修改按钮点击事件
    edit() {

    },
    // 组件删除事件
    deleteTemplate() {

    },
    // 模块拖拽事件
    mousedown_tz(e) {
      const _this = this
      if (this.isAdmin) {
        drag({
          e,
          settingForm: this.settingForm,
          drag: this.$refs['listWrap'],
          fatherElement: document.getElementsByClassName('my_main_content')[0],
          fnc: () => {
            _this.TZLSKeep()
          }
        })
      }
    },
    // 拖拽、拉伸后提交事件
    TZLSKeep() {
      console.log(this.settingForm, ' this.settingForm')
      // this.$emit('tabsSettingSubmit', this.settingForm, null, this.moduleId)
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-components-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 300px;
  border: 1px dashed transparent;
  background:white;
  .custom-components-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .operation {
      position: absolute;
      height: 40px;
      width: 100%;
      text-align: right;
      background: #e8e8e8;
      line-height: 40px;
      // display: none;
              i {
            font-size: 24px;
            cursor: pointer;
            padding: 0 2px;
        }
        .el-icon-delete {
            color: red;
        }
    }
  }
}
.custom-components-view-admin:hover {
  border: 1px dashed rgb(59, 133, 216);
  .stretch {
    display: block;
  }
}
</style>
