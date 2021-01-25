<template>
  <article ref="listWrap" :style="listWrapStyle" class="tabs-view">
    <div class="tabs-view-wrap">
      <div

        :class="[
          'tabs-setting-top',
          { power: isAdmin },
          { 'title-hide': !settingForm.titleIsShow }
        ]"
        @mousedown="tabs_mousedown_tz"
      >
        <div class="top-wrap">
          <span class="title theme-color">{{ settingForm.title }}</span>
          <div v-if="isAdmin" class="right-icon">
            <i
              class="iconfont iconxiugai theme-color"
              title="修改"
              @click="edit"
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
        </div>
      </div>
      <stretch
        :setting-form="settingForm"
        :stretch-elelemt="stretchElelemt"
        @stretchkeep="TZLSKeep"
      />
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in settingForm.titleData"
          :key="index"
          :label="item.label"
          :name="item.tabsCode"
          :style="elTabPaneStyle"
        >
          <!-- <div class="el-tab-pane-icon">
            <i class="el-icon-circle-plus-outline" @click="drawerShow=true"/>
          </div> -->
          <page-view
            v-if="item.tabsCode===activeName"
            :module-id="moduleId"
            :page-module-data="pageModuleData"
            :add-setting-form="addSettingForm"
            :setting-config="settingConfig"
            :tabs-code="item.tabsCode"
            @componentFunc="componentFunc" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- tabs切换配置 组件 -->
    <tab-setting
      ref="tabsSetting"
      :tabs-form="settingForm"
      @tabsSubmit="tabsSettingSubmit"
    />

  </article>
</template>
<script>
import TabsMixins from './TabsMixins'
import Stretch from '../Stretch'
import TabSetting from '../TabSetting'
import PageView from '../PageView'
export default {
  components: { Stretch, TabSetting, PageView },
  mixins: [TabsMixins],
  props: {
    settingForm: { type: Object, default: null },
    moduleId: { type: String, default: null },
    settingConfig: { type: Object, default: null },
    pageModuleData: { type: Object, default: null },
    addSettingForm: { type: Object, default: null }
  }
}
</script>
<style lang="scss" scoped>
.tabs-view {
  position: absolute;
  background: white;
  box-shadow: 0 0 3px #333333;
  box-sizing: border-box;
  border: 1px dashed transparent;
  .tabs-view-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .tabs-setting-top {
      box-sizing: border-box;
      border-bottom: 1px solid #d8d8d8;

      padding: 0 10px;
      .top-wrap {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        height: 40px;
         line-height: 40px;
      }
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .right-icon {
        font-size: 20px;
        i {
          cursor: pointer;
        }
        .el-icon-delete {
          color: red;
        }
      }
    }
    .tabs-setting-top.title-hide {
      width: 100%;
      background: white;
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 5;
    }
    .suofang {
      position: absolute;
      height: 30px;
      width: 30px;
      z-index: 9999999;
    }
    .tabs-setting-top.power {
      cursor: move;
    }
    >>>.el-tabs {
      padding: 5px;
      box-sizing: border-box;
      height: calc(100% - 40px);
      .el-tabs__header{
        margin: 0;
      }
      .el-tab-pane{
        position: relative;

      }
    }
  }
  .tabs-view-wrap:hover {
    .tabs-setting-top.title-hide {
      display: block;
    }
  }
}
.tabs-view:hover {
  border: 1px dashed rgb(59, 133, 216);
  .stretch {
    display: block;
  }
}
</style>
