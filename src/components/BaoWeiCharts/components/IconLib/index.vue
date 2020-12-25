<template>
  <div class="icon-container">
    <el-dialog
      title="图标库"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="showSelectIcon"
      width="60%"
      center
      @open="open"
    >
      <ul class="icon-list">
        <li
          v-for="(item, index) in iconList"
          :key="item.className"
          :class="{ active: currentIndex === index }"
          @click="selectIcon(item, index)"
        >
          <i :class="item.className" />
          <span class="icon-name">{{ item.className }}</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dataMixins from './mixins.js'
export default {
  mixins: [dataMixins],
  props: {
    showSelectIcon: {
      type: Boolean,
      default: null
    },
    iconData: {
      type: Array,
      default: null
    }
  },
  methods: {
    selectIcon(item, index) {
      this.currentIndex = index
      this.selectIconData = item.className
    },
    open() {
      if (this.iconData) {
        this.currentIndex = this.iconList.findIndex(item => {
          return item.className === this.iconData
        })
      }
    },
    confirm() {
      this.$emit('selectIcon', this.selectIconData)
      this.$emit('update:showSelectIcon', false)
    },
    close() {
      this.$emit('update:showSelectIcon', false)
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding: 1px 0 !important;
  max-height: 58vh;
}

.icon-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #eaeefb;
}

.icon-list li {
  width: 16.75%;
  height: 90px;
  margin-right: -1px;
  margin-bottom: -1px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  text-align: center;
  cursor: pointer;
}

.icon-list li:hover,
.icon-list li.active {
  color: #61bbff;
}

.icon-list li i {
  display: block;
  font-size: 32px;
  margin: 10px 0;
}

.icon-list li span {
  display: block;
  word-break: break-word;
  padding: 0 3px;
}
</style>
