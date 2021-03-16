<template>
  <div
    :ref="'listWrap'"
    :style="listWrapStyle"
    :class="['category-axis',{'category-axis-admin':isAdmin}]"
    @mousedown="mousedown_tz"
  >
    <div class="operation">
      <i class="iconfont iconxiugai theme-color" @click="edit" />
      <i
        class="el-icon-set-up theme-color"
        title="模块数据交互"
        @click="Interactive()"
      />
      <el-popconfirm
        icon="el-icon-info"
        class="delete-template-popconfirm"
        icon-color="red"
        title="确认删除类目轴？"
        @confirm="deleteTemplate"
      >
        <i slot="reference" title="删除" class="el-icon-delete" />
      </el-popconfirm>
    </div>
    <ul
      class="list"
    >
      <li v-for="(item, index) in settingForm.axisData" :key="index">
        <span
          :class="['text', { active: listChooseIndex == index }]"
          @click="listClick(item, index)"
        >
          <span>{{ item.displayValue }}</span>
        </span>
      </li>
    </ul>
    <axis-setting
      ref="AxisSetting"
      :axis-config="settingForm"
      :module-id="moduleId"
      @componentFunc="componentFunc"
    />
  </div>
</template>
<script>
// import './index.scss'
// import dragStretchMixins from '../TimeAxis/dragStretchMixins'
import AxisSetting from '../AxisSetting'
import drag from '../../utils/drag'
export default {
  components: { AxisSetting },
  // mixins: [dragStretchMixins],
  props: {
    settingForm: {
      type: Object,
      default: null
    },
    moduleId: {
      type: String,
      default: null
    },
    settingConfig: {
      type: Object,
      default: null
    },
    containerElelemt: { type: HTMLElement, default: null }
  },
  data() {
    return {
      listChooseIndex: null,
      isAdmin: this.settingConfig.systemPermissions === 'admin'
    }
  },
  computed: {
    listWrapStyle() {
      const element = this.containerElelemt
        ? this.containerElelemt
        : document.getElementsByClassName('my_main_content')[0]
      const style = {
        top:
          parseFloat((this.settingForm.top * element.clientHeight) / 100) +
          'px',
        left:
          parseFloat((this.settingForm.left * element.scrollWidth) / 100) +
          'px',
        'z-index': this.settingForm.zindex,
        width: (this.settingForm.width * element.scrollWidth) / 100 + 'px'
      }
      return style
    }
  },
  methods: {
    mousedown_tz(e) {
      const _this = this
      if (this.isAdmin) {
        const element = this.containerElelemt
          ? this.containerElelemt
          : document.getElementsByClassName('my_main_content')[0]
        drag({
          e,
          settingForm: this.settingForm,
          drag: this.$refs['listWrap'],
          fatherElement: element,
          fnc: () => {
            _this.TZLSKeep()
          }
        })
      }
    },
    // 拖拽完成后保存事件
    TZLSKeep() {
      this.$emit('componentFunc', {
        method: 'categoryConfigSubmit',
        name: '类目轴配置提交事件',
        param: {
          config: this.settingForm,
          moduleId: this.moduleId
        }
      })
    },
    // 类目点击事件
    listClick(item, index) {
      this.listChooseIndex = index
      // this.$emit('axisClick', item, this.moduleId)
      this.$emit('componentFunc', {
        method: 'axisClick',
        name: '类目轴点击事件',
        param: {
          data: item,
          moduleId: this.moduleId
        }
      })
    },
    // 删除按钮点击事件
    deleteTemplate() {
      this.$emit('componentFunc', {
        method: 'deleteCategory',
        name: '类目轴删除事件',
        param: {
          moduleId: this.moduleId
        }
      })
    },
    // 编辑按钮点击事件
    edit() {
      this.$refs['AxisSetting'].show()
    },
    // 配置数据点击确认事件
    componentFunc(obj) {
      this.$emit('componentFunc', obj)
    },
    // 交互配置按钮点击事件
    Interactive() {
      // const object = {
      //   moduleId: this.moduleId
      // }
      this.$emit('componentFunc', {
        method: 'categoryAxisInteractiveIconClick',
        name: '交互配置按钮点击事件',
        param: {
          moduleId: this.moduleId
        }
      })
      // this.$emit('categoryAxisInteractiveIconClick', object)
    }
  }
}
</script>
<style lang="scss" scoped>
$--color-primary: #4472c4;
.category-axis {
    position: absolute;
    .operation {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 99;
        background: #ffffffbd;
        i {
            font-size: 24px;
            cursor: pointer;
            padding: 0 2px;
        }
        .el-icon-delete {
            color: red;
        }
    }
    .list {
        display: flex;
        margin: 0 20px;
        height: 50px;
        padding: 0;
        list-style: none;
        li {
            padding-right: 40px;
            background: url(./images/t1.png) no-repeat right center;
            margin-right: 8px;
            list-style: none;
            .text {
                display: block;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: white;
                font-size: 14px;
                border: 1px solid $--color-primary;
                text-align: center;
                position: relative;
                cursor: pointer;
                span {
                    position: relative;
                    display: block;
                    width: 40px;
                    margin-left: 5px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
        li:last-child {
            background: none;
            margin: 0;
            padding-right: 0;
        }
        li .text.active {
            background-color: $--color-primary;
            color: white;
        }
    }
    @media screen and (max-width: 1366px) {
        .list {
            margin: 0;
            li {
                padding-right: 24px;
                background-position: 144% 50%;
                margin-right: 4px;
                .text {
                    width: 40px;
                    height: 40px;
                    span {
                        margin-left: 0;
                        font-size: 12px;
                    }
                }
            }
        }
    }
}

.category-axis-admin {
    &:hover {
        cursor: move;
        .operation {
            display: block;
        }
    }
}
</style>
