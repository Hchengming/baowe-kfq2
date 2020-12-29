<template>
  <div>
    <el-tree
      :data="treeData"
      :default-expand-all="true"
      :render-content="renderContent"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    />
    <menu-form-model
      :menu-form-all="menuFormAll"
      @menuFormSubmit="menuFormSubmit"
    />
  </div>
</template>
<script>
import MenuFormModel from './MenuFormModel'
import serviceAxios from '@/utils/request.js'
// import "@/../static/js/config.js";
// import defaultMenuData from './menuData.json'
export default {
  components: { MenuFormModel },
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  data() {
    return {
      commonUrl: '',
      nowMenuId: '', // 点击项当前id
      // 菜单配置项
      menuFormAll: {
        menuForm: {
          menuCode: '',
          menuName: '',
          menuIcon: ''
        },
        type: '',
        isShow: false
      },
      // 树形默认值
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      // 树形菜单数据
      treeData: [
        {
          menuName: '所有菜单',
          menuCode: '000',
          menuId: '',
          children: []
        }
      ]
    }
  },
  mounted() {
    this.commonUrl = this.settingConfig.systomMenuApi
    this.getTreeMenu()
  },
  methods: {
    // 菜单树数据查询事件
    getTreeMenu() {
      serviceAxios.post(this.commonUrl + '/menu/insertMenu', { answerId: this.settingConfig.answerId }).then(res => {
        // console.log(res)
        const code = res.code
        const reqData = res.data
        if (code === 20000) {
          this.$set((this.treeData[0].children = reqData))
          this.$emit('getMenuData', reqData)
        }
      })
    },
    // 树形单行配置
    renderContent(h, { node, data }) {
      // console.log(data);
      const iconClass = 'iconfont ' + data.menuIcon
      return (
        <span class='custom-tree-node'>

          <span class='left_title'>
            <i class={iconClass}></i>
            {node.label}
          </span>
          <span>
            <el-button
              size='mini'
              type='text'
              on-click={() => this.append(data)}
            >
              新增
            </el-button>
            <el-button
              size='mini'
              type='text'
              disabled={data.menuName === '所有菜单' ? 'disabled' : false}
              on-click={() => this.update(data)}
            >
              修改
            </el-button>
            <el-popconfirm
              on-confirm={() => this.remove(node, data)}
              title='这是一段内容确定删除吗？'
            >
              <el-button
                size='mini'
                type='text'
                slot='reference'
                disabled={
                  (data.children && data.children.length > 0) ||
                    data.menuName === '所有菜单'
                    ? 'disabled'
                    : false
                }
              >
                删除
              </el-button>
            </el-popconfirm>
          </span>
        </span>
      )
    },
    // 菜单新增事件
    append(data) {
      this.nowMenuId = data.menuId
      this.menuFormAll.type = 'add'
      this.menuFormAll.isShow = true
    },
    // 菜单修改事件
    update(data) {
      this.menuFormAll.type = 'update'
      this.nowMenuId = data.menuId

      this.menuFormAll.menuForm.menuCode = data.menuCode
      this.menuFormAll.menuForm.menuName = data.menuName
      this.menuFormAll.menuForm.menuIcon = data.menuIcon
      this.menuFormAll.isShow = true
      console.log(this.menuFormAll)
    },
    // 新增、修改菜单保存事件
    menuFormSubmit(form, fn) {
      const reqData = {
        menuName: form.menuName,
        menuCode: form.menuCode,
        menuIcon: form.menuIcon,
        menuId: this.nowMenuId
      }
      let url = ''
      if (this.menuFormAll.type === 'add') {
        url = '/menu/addMenu'
        reqData.answerId = this.settingConfig.answerId
      } else {
        url = '/menu/updateMenu'
      }
      serviceAxios.post(this.commonUrl + url, reqData).then(res => {
        const code = res.code
        if (code === 20000) {
          this.$message({
            message: '菜单编辑成功',
            type: 'success'
          })
          if (fn) {
            fn()
          }
          this.getTreeMenu()
        }
      })
    },

    // 菜单删除事件
    remove(node, data) {
      serviceAxios
        .post(this.commonUrl + '/menu/deleteMenu', { menuId: data.menuId })
        .then(res => {
          if (res.code === 20000) {
            this.$message({
              message: '菜单删除成功',
              type: 'success'
            })
            this.getTreeMenu()
          }
        })
    },
    handleNodeClick() { }
  }
}
</script>
