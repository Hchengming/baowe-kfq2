<template>
  <div>
    <div
      v-if="settingForm.mask && settingForm.mask == '1'"
      v-show="componentConfig.isShow"
      :style="{ 'z-index': settingForm.zindex }"
      class="statisticsMask"
      @click.stop="customComponentsViewClose"
    />
    <article
      v-show="componentConfig.isShow"
      ref="listWrap"
      :style="listWrapStyle"
      :class="[
        'custom-components-view',
        { 'custom-components-view-admin': isAdmin },
        ,
        { choose: componentConfig.choose }
      ]"
    >
      <div class="custom-components-wrap" @click.stop="componentClick">
        <i
          v-if="settingForm.isModuleClose"
          class="el-icon-close"
          @click.stop="customComponentsViewClose"
        />
        <!-- <div class="box-meng" style="width: 100%;height:100%;pos"></div> -->
        <div
          :class="[
            'operation',
            {
              hide: isAdmin && settingForm.isHeaderHide
            },
            {
              show: !settingForm.isHeaderHide
            },
            'clearfix'
          ]"
          @mousedown="mousedown_tz"
        >
          <span class="title">{{ settingForm.title }}</span>
          <i
            v-if="isAdmin"
            class="iconfont iconxiugai theme-color"
            @click="edit"
          />
          <el-popconfirm
            v-if="isAdmin"
            icon="el-icon-info"
            class="delete-template-popconfirm"
            icon-color="red"
            title="确认删除当前组件？"
            @confirm="deleteTemplate"
          >
            <i
              slot="reference"
              :class="[
                'el-icon-delete',
                { marginR: settingForm.isModuleClose }
              ]"
              title="删除"
            />
          </el-popconfirm>
          <!-- </div> -->
        </div>
        <div id="custom-wrap">
          <div :id="'custom-' + moduleId" />
        </div>

        <stretch
          :setting-form="settingForm"
          :stretch-elelemt="stretchElelemt"
          @stretchkeep="TZLSKeep"
        />
      </div>
      <!-- 自定义组件配置 -->
      <custom-components-setting
        ref="customComponentsSetting"
        :custom-components-config="settingForm"
        @componentFunc="componentFunc"
      />
    </article>
  </div>
</template>
<script>
import Stretch from '../Stretch'
import drag from '../../utils/drag'
import CustomComponentsSetting from '../CustomComponentsSetting'
import Vue from 'vue'
export default {
  components: { Stretch, CustomComponentsSetting },
  props: {
    settingForm: { type: Object, default: null },
    moduleId: { type: String, default: null },
    settingConfig: { type: Object, default: null },
    componentConfig: { type: Object, default: null }
  },
  data() {
    return {
      stretchElelemt: null, // 被拉伸元素
      num: 1
      // chooseClass: ''
      // customComponentsConfig: {}
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
      return style
    },
    isAdmin() {
      return this.settingConfig.systemPermissions === 'admin'
    }
  },
  watch: {
    'settingForm.temp': {
      handler() {
        this.updateContent()
      },
      deep: true
    },
    'settingForm.js': {
      handler() {
        this.updateContent()
      },
      deep: true
    }
  },
  mounted() {
    this.stretchElelemt = this.$refs['listWrap']
    this.pageGetWidget()
  },
  methods: {
    // 动态组件挂载重新挂载
    updateContent() {
      const customWrap = document.getElementById('custom-wrap')
      const doc = document.createElement('div')
      doc.id = 'custom-' + this.moduleId
      customWrap.innerHTML = ''
      customWrap.appendChild(doc)
      this.$nextTick(() => {
        this.pageGetWidget()
      })
    },
    // 组件点击事件
    componentClick() {
      if (this.isAdmin) {
        this.$emit('componentFunc', {
          method: 'componentChooseClick',
          name: '组件点击选中事件',
          param: {
            moduleId: this.componentConfig.moduleId
          }
        })
      }
    },
    // 动态组件挂载
    pageGetWidget() {
      if (this.settingForm.js && this.settingForm.temp) {
        // document.querySelector('#custom-' + this.moduleId).innerHTML = ''
        // 这个组件结构是先定义好,动态组件的template  methods以及其他
        try {
          // eslint-disable-next-line no-eval
          const componentContent = eval(
            '{var temp=' + this.settingForm.js + ';temp}'
          )
          componentContent.template = this.settingForm.temp || ''
          // 注册动态组件内容
          const DynamicComponent = Vue.extend(componentContent)
          // 将组成的组件挂载到指定的DOM
          if (document.querySelector('#custom-' + this.moduleId)) {
            new DynamicComponent().$mount('#custom-' + this.moduleId)
          }
        } catch (e) {
          console.log(e + '解析失败')
        }
      }
    },
    // 事件传递
    componentFunc(obj) {
      if (this[obj.method]) {
        this[obj.method](obj.param)
      }
    },
    // 配置弹窗保存
    customComponentsEmit(param) {
      this.$emit('componentFunc', {
        method: 'customComponentsEmit',
        param: {
          config: param.config,
          moduleId: this.moduleId,
          close: param.close
        }
      })
      this.pageGetWidget()
    },
    // 修改按钮点击事件
    edit() {
      this.$refs['customComponentsSetting'].show()
    },
    // 组件删除事件
    deleteTemplate() {
      this.$emit('componentFunc', {
        method: 'customComponentsDelete',
        param: {
          moduleId: this.moduleId
        }
      })
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
      this.$emit('componentFunc', {
        method: 'customComponentsEmit',
        param: {
          config: this.settingForm,
          moduleId: this.moduleId
        }
      })
    },
    // 弹窗关闭事件
    customComponentsViewClose() {
      this.componentConfig.isShow = false
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

  background: white;
  .custom-components-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-icon-close {
      position: absolute;
      font-size: 22px;
      right: 2px;
      top: 2px;
      color: #333333;
      cursor: pointer;
      z-index: 9999999999;
    }
    .operation {
      position: absolute;
      height: 40px;
      width: 100%;
      text-align: right;
      background: #e8e8e8;
      line-height: 40px;

      span.title {
        float: left;
        padding-left: 10px;
      }
      i {
        font-size: 24px;
        cursor: pointer;
        padding: 0 2px;
      }
      .el-icon-delete {
        color: red;
      }
      .marginR {
        margin-right: 30px;
      }
    }
    .operation.show {
      position: relative;
    }
    .operation.hide {
      display: none;
    }
  }
}
.custom-components-view-admin {
  border: 1px dashed transparent;
}
.custom-components-view-admin:hover,
.custom-components-view-admin.choose {
  border: 1px dashed rgb(59, 133, 216);
  .stretch {
    display: block;
  }
  .operation.hide {
    display: block;
  }
}
</style>
