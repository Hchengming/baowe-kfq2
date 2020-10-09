<template>
  <!-- 筛选 -->
  <div>
    <el-dialog class="screenForm dialog-common"  
               ref="screenFormDialog"
               :append-to-body="true"
               :visible.sync="isShow">
           <div class="headerTitle" slot="title" @mousedown="dragElement">
                     筛选项配置信息
               </div>    
         <div class="screenForm-top">
           <span>是否显示查询按钮</span> 
            <el-radio-group 
                          v-model="isShowInsertButton"
                          size="small">
            <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>   
                      
          </el-radio-group>
           </div>  
      <div class="screenBox">
        <fieldset class="form-setting">
          <legend class="theme-color">表单配置</legend>
          <el-form ref="form">
            <table class="form-table">
              <tr class="t-header">
                <td v-for="item in tableClums"
                    :style="{width:item.width+'px'}"
                    :key="item.title">
                  <span v-if="item.title!=='操作'">{{item.title}}</span>
                  <i @click="addScreen"
                     v-if="item.title==='操作'"
                     class="iconfont iconzengjia theme-color t-head-cz-icon"></i>
                </td>
              </tr>
              <tr class="t-body"
                  v-for="(items,index) in screenData"
                  :key="index">
                <td v-for="item in tableClums"
                    :style="{width:item.width+'px'}"
                    :key="item.title">
                  <!-- 表单类型 -->
                  <el-select v-if="item.key=='type'"
                             @change="typeChange(items)"
                             v-model="items[item.key]"
                             size="small"
                              :placeholder="item.title">
                    <el-option v-for="option in typeData"
                               :key="option.value"
                               :label="option.label"
                               :value="option.value"></el-option>
                  </el-select>
                  <!-- 左右侧宽度 -->

                  <el-input-number v-if="item.key==='labelWidth'"
                                   v-model="items[item.key]"
                                   controls-position="right"
                                   :precision="0"
                                   size="small"></el-input-number>
                  <el-input-number v-if="item.key==='rightWidth'"
                                   v-model="items[item.key]"
                                   controls-position="right"
                                   :disabled="items.type==='radio'||items.type==='checkbox'"
                                   :precision="0"
                                   size="small"></el-input-number>
                  <!-- 字段名、标签、 -->
                  <el-input v-if="'key,label,defaultValue'.indexOf(item.key)>-1"
                            v-model="items[item.key]"
                            :placeholder="item.title"
                            @blur="labelChange(index,item,items)"
                            size="small"></el-input>
                  <!-- 下级筛选引用-->
                  <!-- <el-checkbox v-if="item.key=='sfxjcx'"
                             v-model="items[item.key]"></el-checkbox> -->
                  <el-select v-if="item.key=='sfxjcx'||item.key=='isInsert'"
                             v-model="items[item.key]"
                             size="small"
                              :placeholder="item.title">
                    <el-option label="是"
                               value="1"></el-option>
                    <el-option label="否"
                               value="0"></el-option>
                  </el-select>
                  <!-- 单选、多选显示样式 -->
                   <el-select v-if="item.key=='styleType'"
                             v-model="items[item.key]"
                             :disabled="items.type!=='radio'&&items.type!=='checkbox'"
                             size="small"
                              :placeholder="item.title">
                    <el-option label="默认样式"
                               value="0"></el-option>
                    <el-option label="带有边框"
                               value="1"></el-option>
                                <el-option label="按钮组"
                               value="2"></el-option>
                  </el-select>
                  
                  <!-- 是否结束时间-->
                  <el-select v-if="item.key=='sfjssj'"
                             v-model="items[item.key]"
                             :disabled="items.type!=='date'&&items.type!=='dateTime'"
                             size="small"
                             @change="isOverTimeChange(items,item)"
                              :placeholder="item.title">
                    <el-option label="是"
                               value="1"></el-option>
                    <el-option label="否"
                               value="0"></el-option>
                  </el-select>
                  <!-- 选择框配置数据 -->
                  <div v-if="item.key=='changeData'">
                    <el-input v-if="!items.dataUrl&&!items.arr"
                              :disabled="['input','number','textarea'].indexOf(items.type)>-1"
                              readonly
                              @click.native="itemDataChange(items,index)"
                              size="small"></el-input>
                    <el-input v-if="item.dataUrl"
                              readonly
                              v-model="items.dataUrl"
                              @click.native="itemDataChange(items,index)"
                              size="small"></el-input>
                    <section v-if="items.arr"
                             :title="JSON.stringify(items.arr)">
                      <el-input readonly
                                v-model="items.arrStr"
                                @click.native="itemDataChange(items,index)"
                                size="small"></el-input>
                    </section>
                  </div>

                  <!-- 操作区域 -->
                  <div class="rightIcon"
                       v-if="item.title=='操作'">
                    <i @click="sortPrev(items,index,index==0)"
                       :class="['iconfont','iconshangyi','theme-color',{'disabled':index==0}]"></i>
                    <i @click="sortNext(items,index,screenData.length-1==index)"
                       :class="['iconfont','iconxiayi','theme-color',{'disabled':screenData.length-1==index}]"></i>
                    <i @click="screenDelete(items,index)"
                       class="el-icon-delete"></i>
                  </div>
                </td>
              </tr>
            </table>

          </el-form>
        </fieldset>
        <fieldset>
          <legend class="theme-color">其他按钮配置配置</legend>
           <button-setting :operateButton="btnSettingData" settingType="2"></button-setting>
        </fieldset>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <div>
        </div>
        <div class="right">
          <el-button @click="isShow=false"
                     size="small">取 消</el-button>
          <el-button type="primary"
                     @click="onSubmit"
                     size="small">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <settingData ref="settingData"
                 @itemDataConfig="itemDataConfig"></settingData>
  </div>
</template>
<script>
import settingData from './settingData'
import ButtonSetting from '../ButtonSetting/index.vue'
import { dragDialog } from '../../utils/mixins.js'
export default {
  components: { settingData ,ButtonSetting},
  mixins: [dragDialog],
  props: {
    screenAll:{
      type: Object
    }
  },
  data () {
    return {
      dialogRef: 'screenFormDialog',
      isShow: false,
      tableClums: [{
        title: '表单类型',
        key: 'type',
        width: 100
      }, {
        title: '字段名',
        key: 'key',
        width: 80
      }, {
        title: '标签',
        key: 'label',
        width: 100
      }, {
        title: '左侧标签宽度',
        key: 'labelWidth',
        width: 100
      }, {
        title: '右侧宽度',
        key: 'rightWidth',
        width: 100
      }, {
        title: '配置数据/接口',
        key: 'changeData',
        width: 100
      }, {
        title: '默认值',
        key: 'defaultValue',
        width: 100
      }, {
        title: '下级参数',
        key: 'sfxjcx',
        width: 80
      }, {
        title: '显示样式',
        key: 'styleType',
        width: 100
      }, {
        title: '是否结束时间',
        key: 'sfjssj',
        width: 100
      },{
          key: 'isInsert',
          title: '是否直接查询',
          width: 100
        },{
        title: '操作',
        width: 75
      }],
      // 表单类型
      typeData: [
        {
          value: 'input',
          label: '输入框'
        },
        {
          value: 'select',
          label: '下拉框'
        },
        {
          value: 'radio',
          label: '单选框'
        },
        {
          value: 'checkbox',
          label: '多选框'
        },
        {
          value: 'number',
          label: '数字输入框'
        },{
          value: 'date',
          label: '时间选择框'
        },{
          value: 'dateTime',
          label: '时间日期选择框'
        }
        // {
        //   value: 'tree',
        //   label: '树形选择框'
        // },
        // {
        //   value: 'textarea',
        //   label: '多行文本框'
        // }
      ],
      btnSettingData: [], // 其他按钮配置数据
      isShowInsertButton:'1',//是否显示查询按钮  1:是 0：否
      screenData: [
        {
          type: 'input',
          key: '',
          label: '',
          sfxjcx: '0', // 是否作为下级查询条件 0:否 1：是
          labelWidth: null, // 标签宽度
          rightWidth: null // 右侧选择框、输入框宽度
        }
      ]
    }
  },
  methods: {
   
    //是否结束时间变化事件
    isOverTimeChange(items,item){
       if(items[item.key] === '1'){
         items.label = ''
       }
    },
   
   
    // 标签名变化事件--获取自适应右侧标签宽度
    labelChange (index, item, items) {
      // .key,items[item.key]
      if (item.key === 'label') {
        const length = items.label.length
        this.$set(items, 'labelWidth', length * 16+1)
      }
    },
    // 弹窗显示事件
    show (conditionAreaConfig) {
      this.isShow = true
       this.isShowInsertButton=conditionAreaConfig.isShowInsertButton?conditionAreaConfig.isShowInsertButton:'1'
      if (conditionAreaConfig) {
        this.screenData = conditionAreaConfig.screenData ? conditionAreaConfig.screenData : []
        this.btnSettingData = conditionAreaConfig.btnSettingData ? conditionAreaConfig.btnSettingData : []
        this.screenData.forEach(item => {
          if (item.arr) {
            item.arrStr = JSON.stringify(item.arr)
          }
        })
      }
      // console.log(this.isShowInsertButton)
    },
    // 表单类型变化事件
    typeChange (item) {
      if(['date','dateTime'].indexOf(item.type) === -1){
        item.sfjssj = ''
      }
      switch (item.type) {
        case 'input':
          delete item.dataUrl
          delete item.arr
          break
        case 'number':
          delete item.dataUrl
          delete item.arr
          break
        case 'date':
          delete item.dataUrl
          delete item.arr
          break
        case 'dateTime':
          delete item.dataUrl
          delete item.arr
          break
        case 'radio':
          item.rightWidth = null
          break
        case 'checkbox':
          item.rightWidth = null
          break
      }
    },
    // 表单确认事件
    onSubmit () {
      let offon = false
      // 筛选表单配置数据校验
      // console.log(this.screenData)
      this.screenData.forEach(item => {
        delete item.arrStr
        if (!item.key || !item.type) {
          offon = true
        }
        if (['radio', 'checkbox', 'select'].indexOf(item.type) > -1) {
          if (!item.dataUrl && !item.arr) {
            offon = true
          }
        }
      })
      // 其他按钮配置数据校验
      let offon2 = false
      this.btnSettingData.forEach(item => {
        if (!item.name || !item.methodsName || !item.type) {
          offon2 = true
        }
      })
      if (offon || offon2) {
        let err1 = ''
        let err2 = ''
        if (offon) err1 = '表单配置写完整(字段名不能为空，单选、多选、下拉框配置数据不能为空);'
        if (offon2) err2 = '其他按钮配置数据未填写完整'
        this.$message({
          type: 'error',
          message: err1 + err2
        })
      } else {
        let datas = JSON.parse(JSON.stringify({
          screenData: this.screenData,
          btnSettingData: this.btnSettingData,
          isShowInsertButton:this.isShowInsertButton
        }))
        // console.log(datas);
        this.$emit('screenKeep', datas)
        this.isShow = false
      }
    },
    // 新增按钮点击事件
    addScreen () {
      this.screenData.push({
        type: 'input',
        key: '',
        label: '',
        sfxjcx: '0' // 是否作为下级查询条件
        // dataUrl: "" //数据接口
      })
    },
    // 向上排序
    sortPrev (item, index, offon) {
      if (offon) return
      this.screenData.splice(index, 1)
      this.screenData.splice(index - 1, 0, item)
    },
    // 向下排序
    sortNext (item, index, offon) {
      if (offon) return
      this.screenData.splice(index, 1)
      this.screenData.splice(index + 1, 0, item)
    },
    // 删除项点击事件
    screenDelete (item, index) {
      this.screenData.splice(index, 1)
    },
    // 数据配置框获取焦点事件
    itemDataChange (item, index) {
      if (['input', 'number', 'textarea'].indexOf(item.type) > -1) return
      this.$refs.settingData.show(item, index)
    },
    // 数据配置确认事件
    itemDataConfig (obj) {
      if (obj.dataUrl) {
        this.$set(this.screenData[obj.index], 'arr', undefined)
        this.$set(this.screenData[obj.index], 'dataUrl', obj.dataUrl)
      } else {
        this.$set(this.screenData[obj.index], 'dataUrl', undefined)
        this.$set(this.screenData[obj.index], 'arr', obj.arr)
        this.$set(
          this.screenData[obj.index],
          'arrStr',
          JSON.stringify(obj.arr)
        )
      }
    }
  }
}
</script>
