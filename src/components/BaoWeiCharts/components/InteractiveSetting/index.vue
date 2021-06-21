<template>
  <div>
    <el-dialog
      v-drag
      :append-to-body="true"
      :visible.sync="dialogVisible"
      class="dialog-common interactive-setting-dialog"
    >
      <div slot="title" class="headerTitle">模块数据交互配置</div>
      <ul class="dialog-box">
        <li class="list header">
          <div class="left">
            当前模块
          </div>
          <div class="right">
            交互模块
          </div>
          <div class="icon">
            <i
              class="el-icon-circle-plus-outline theme-color"
              @click="addInteractive"
            />
          </div>
        </li>
        <li
          v-for="(items, index) in interactiveData"
          :key="index"
          class="list"
          @click="fatherIndex = index"
        >
          <div class="left">
            <div class="params-choose">
              <span>参数选择:</span>
              <el-select v-model="items.paramsChoose" placeholder="参数选择">
                <el-option
                  v-for="(x, num) in beforeParamsData"
                  :key="num"
                  :value="x.val"
                  :label="x.lab+'('+x.val+')'"
                />
              </el-select>
            </div>
            <div class="trigger-event">
              <span>触发方式:</span>
              <el-select
                v-model="items.triggerEvent"
                :disabled="!statisticsAll||statisticsAll.contentAreaConfig.displayMode !== 'table'"
                placeholder="触发方式"
              >
                <el-option
                  v-for="x in triggerEventAll()"
                  :key="x.val"
                  :value="x.val"
                  :label="x.lab"
                />
              </el-select>
            </div>
          </div>
          <div class="right">
            <colums-setting
              :table-data="items.otherModuleConfig"
              :table-cloums="tableCloums"
            />

          </div>
          <div class="icon icon2">
            <i
              class="el-icon-delete remove"
              @click="removeInteractive(index)"
            />
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" @click="onSubmit">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <js-methods-setting
      ref="jsMethodsSetting"
      setting-type="4"
      @submit="changeJsMethods"
    />
    <!-- 对应参数选择弹窗 -->
    <corresponding-param-setting ref="correspondingParamSetting" @onSubmit="correspondingSubmit" />
  </div>
</template>
<script>
import InteractiveSettingMixins from './InteractiveSettingMixins'
import ColumsSetting from '../ColumsSetting'
import CorrespondingParamSetting from './CorrespondingParamSetting'
import JsMethodsSetting from '../JsMethodsSetting'
export default {
  components: { ColumsSetting, JsMethodsSetting, CorrespondingParamSetting },
  mixins: [InteractiveSettingMixins]
}
</script>
<style lang="scss" scoped>
.interactive-setting-dialog {
  >>> .el-dialog {
    width: 1005px;
    .dialog-box {
      border-top: 1px solid #0000004d;
      border-left: 1px solid #0000004d;
      padding: 0;
      margin: 0;
      .header {
        font-size: 16px;
        line-height: 40px;
        text-align: center;
      }
      .list {
        display: flex;
        list-style: none;

        > div {
          border-bottom: 1px solid #0000004d;
          border-right: 1px solid #0000004d;
        }
        .left {
          width: 300px;
          > div {
            margin: 10px;
            display: flex;
            span {
              padding-right: 5px;
              line-height:40px
            }
            .el-select {
              width: 180px;
            }
          }
        }
        .right {
          width: 600px;
        }
        .icon {
          width: 50px;
          text-align: center;
          line-height: 20px;
          i {
            font-size: 20px;
            cursor: pointer;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }
          .remove {
            color: red;
          }
        }
      }
    }
  }
}
</style>
