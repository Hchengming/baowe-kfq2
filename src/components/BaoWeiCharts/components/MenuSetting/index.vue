<template>
  <div>
    <el-tree :data="treeData"
             :default-expand-all="true"
             :render-content="renderContent"
             :props="defaultProps"
             :expand-on-click-node="false"
             @node-click="handleNodeClick"></el-tree>
    <menu-form-model :menuFormAll="menuFormAll"
                     @menuFormSubmit="menuFormSubmit"></menu-form-model>
  </div>
</template>
<script>
import MenuFormModel from "./MenuFormModel";
import axios from "axios";
// import "@/../static/js/config.js";
import defaultMenuData from './menuData.json'
export default {
  components: { MenuFormModel },
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  data () {
    return {
      commonUrl: 'http://localhost:3000',
      nowMenuid: "", //点击项当前id
      //菜单配置项
      menuFormAll: {
        menuForm: {
          menuCode: "",
          menuName: "",
          menuIcon: ""
        },
        type: "",
        isShow: false
      },
      //树形默认值
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      //树形菜单数据
      treeData: [
        {
          menuName: "所有菜单",
          menuCode: "000",
          menuid: "000",
          children: []
        }
      ]
    };
  },
  mounted () {
    this.getTreeMenu();
  },
  methods: {
    //菜单树数据查询事件
    getTreeMenu () {

      this.$set((this.treeData[0].children = defaultMenuData));
      this.$emit("getMenuData", defaultMenuData)
      return;
      // axios.post(this.commonUrl + "/menu/insertMenu").then(res => {
      //   let status = res.data.status;
      //   let reqData = res.data.data;

      //   if (status == 0) {
      //     this.$set((this.treeData[0].children = reqData));
      //     this.$emit("getMenuData", reqData)
      //   }
      // });
    },
    //树形单行配置
    renderContent (h, { node, data }) {
      // console.log(data);
      let iconClass = "iconfont " + data.menuIcon;
      return (
        <span class="custom-tree-node">

          <span class="left_title">
            <i class={iconClass}></i>
            {node.label}
          </span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data)}
            >
              新增
            </el-button>
            <el-button
              size="mini"
              type="text"
              disabled={data.menuName == "所有菜单" ? "disabled" : false}
              on-click={() => this.update(data)}
            >
              修改
            </el-button>
            <el-popconfirm
              on-onConfirm={() => this.remove(node, data)}
              title="这是一段内容确定删除吗？"
            >
              <el-button
                size="mini"
                type="text"
                slot="reference"
                disabled={
                  (data.children && data.children.length > 0) ||
                    data.menuName == "所有菜单"
                    ? "disabled"
                    : false
                }
              >
                删除
              </el-button>
            </el-popconfirm>
          </span>
        </span>
      );
    },
    //菜单新增事件
    append (data) {
      this.nowMenuid = data.menuid;
      this.menuFormAll.type = "add";
      this.menuFormAll.isShow = true;
    },
    //菜单修改事件
    update (data) {
      this.menuFormAll.type = "update";
      this.nowMenuid = data.menuid;
      this.getMenuItem()
      //  console.log(data)
    },
    //当前菜单详情数据获取
    getMenuItem () {
      axios
        .post(this.commonUrl + "/menu/destailMenu", { menuid: this.nowMenuid })
        .then(res => {
          let status = res.data.status;
          let reqData = res.data.data;

          if (status == 0) {

            this.menuFormAll.menuForm.menuCode = reqData.menuCode;
            this.menuFormAll.menuForm.menuName = reqData.menuName;
            this.menuFormAll.menuForm.menuIcon = reqData.menuIcon
            this.menuFormAll.isShow = true;
          }
        });
    },
    //新增、修改菜单保存事件
    menuFormSubmit (form, fn) {
      let reqData = {
        menuName: form.menuName,
        menuCode: form.menuCode,
        menuIcon: form.menuIcon,
        menuid: this.nowMenuid
      };
      let url = "";
      if (this.menuFormAll.type == "add") {
        url = "/menu/addMenu";
      } else {
        url = "/menu/updateMenu";
      }
      axios.post(this.commonUrl + url, reqData).then(res => {
        let status = res.data.status;
        // let resData = res.data.data;

        if (status == 0) {
          this.$message({
            message: "菜单编辑成功",
            type: "success"
          });
          if (fn) {
            fn();
          }
          this.getTreeMenu();
        }
      });
    },

    //菜单删除事件
    remove (node, data) {
      axios
        .post(this.commonUrl + "/menu/removeMenu", { menuid: data.menuid })
        .then(res => {
          let status = res.data.status;
          // let reqData = res.data.data;

          if (status == 0) {
            this.$message({
              message: "菜单删除成功",
              type: "success"
            });
            this.getTreeMenu();
          }
        });
    },
    handleNodeClick () { }
  }
};
</script>