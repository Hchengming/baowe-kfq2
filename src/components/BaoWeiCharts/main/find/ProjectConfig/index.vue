<template>
  <div class="project-config-wrap">
    <div class="theme-choose">
      <div>
        <span>主题风格</span>
        <el-radio-group v-model="nowProjectConfig.theme" @change="themeChange">
          <el-radio
            v-for="(item, index) in themeData"
            :key="index"
            :label="item.value"
            border
            size="medium"
          >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </div>
      <div>
        <span>项目初始进入页面</span>
        <el-input
          v-model="nowProjectConfig.defaultMenuName"
          :clearable="true"
          placeholder="请点击选择默认初始菜单页面"
          @change="defaultMenuNameChange"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click.native="startMenuCodeChoose"
          />
        </el-input>
      </div>
      <div class="js-methods">
        <span>页面初始化js脚本</span>
        <el-input
          v-model="nowProjectConfig.jsMethods"
          clearable
          placeholder="function(){}"
          type="textarea"
        />
      </div>

      <div class="bottom-confirm">
        <el-button type="primary" @click="onSubmit">确 认</el-button>
      </div>
    </div>
    <!-- 初始化页面选择 -->
    <Popup ref="Popup" title="初始化页面选择">
      <el-tree
        ref="selMenuTree"
        :data="menuData"
        :default-expand-all="true"
        :props="defaultProps"
        :expand-on-click-node="false"
        node-key="menuCode"
        highlight-current
        @node-click="handleNodeClick"
      />
    </Popup>
  </div>
</template>
<script>
import Popup from '@/components/BaoWeiCharts/components/Popup'
export default {
  components: {
    Popup
  },
  props: {
    nowProjectConfig: {
      type: Object,
      default: null
    },
    menuData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      // 项目主题风格选择数据
      themeData: [
        {
          label: '深蓝色主题风格',
          value: 2
        },
        // {
        //   label: "默认主题风格",
        //   value: "0",
        // },
        {
          label: '大屏展示类背景风格',
          value: 1
        },
        {
          label: '深蓝色主题风格2',
          value: 3
        },
        {
          label: '主题4',
          value: 4
        }
      ],
      // 树形默认值
      defaultProps: {
        children: 'children',
        label: 'menuName'
      }
    }
  },
  methods: {
    // 项目主体配置确认事件
    onSubmit() {
      this.$emit('projectConfigSubmit', this.nowProjectConfig)
    },
    // 主题风格变化事件
    themeChange() {
      this.$emit('projectConfigChange', this.nowProjectConfig)
    },
    // 项目初始页面选择弹窗进入页面
    startMenuCodeChoose() {
      this.$refs['Popup'].isShow = true
      this.$nextTick(() => {
        this.$refs['selMenuTree'].setCurrentKey(
          this.nowProjectConfig.defaultMenuCode || null
        )
      })
    },
    // 默认选择菜单变化事件
    defaultMenuNameChange() {
      if (!this.nowProjectConfig.defaultMenuName) {
        this.nowProjectConfig.defaultMenuCode = ''
      }
    },
    // 菜单选中点击事件
    handleNodeClick(item) {
      this.$set(this.nowProjectConfig, 'defaultMenuCode', item.menuCode)
      this.$set(this.nowProjectConfig, 'defaultMenuName', item.menuName)

      console.log(this.nowProjectConfig, 'this.nowProjectConfig')
    }
  }
}
</script>
<style lang="scss">
.project-config-wrap {
  padding: 0 20px;
  height: 100%;
  position: relative;
  .theme-choose {
    > div {
      margin-bottom: 10px;
      > span {
        color: black;
        font-size: 16px;
        // padding-bottom: 5px;
        display: inline-block;
        line-height: 30px;
      }
      .el-radio.is-bordered {
        margin-left: 0;
        margin-top: 5px;
      }
    }
    .js-methods {
      // margin-top: 10px;
      .el-textarea {
        // margin-top: 5px;
        textarea {
          height: 300px;
        }
      }
    }
  }
  .bottom-confirm {
    display: flex;
    justify-content: flex-end;
    //   margin-top: 20px;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
