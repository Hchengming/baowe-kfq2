<template>
  <div
    v-loading="isLoad"
    id="jdjg-scdht"
    style="height: 100%;"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
  >
    <div>
      <div class="scdht-box">
        <ul class="trunk">
          <li class="list1">
            <div>
              <p>项目总数</p>
              <p>{{ projectTotal }}</p>
            </div>
          </li>
          <li
            v-for="(items, indexs) in listData"
            :key="indexs"
            :class="['lists', 'list' + (indexs + 2)]"
          >
            <div
              v-if="items.title"
              class="title"
              @click="titleClick(items, items.title)"
            >
              {{ items.title }}
            </div>
            <div v-if="items.top && items.top[0]" class="top child">
              <div class="list-box green" @click="listClick(items, 'top-0')">
                <p class="txt1">{{ items.top[0].label }}</p>
                <p class="txt2">{{ items.top[0].value }}</p>
              </div>
            </div>
            <div v-if="items.top && items.top[1]" class="top1 child">
              <div class="list-box orange" @click="listClick(items, 'top-1')">
                <p class="txt1">{{ items.top[1].label }}</p>
                <p class="txt2">{{ items.top[1].value }}</p>
              </div>
            </div>
            <div v-if="items.bottom && items.bottom[0]" class="bottom1 child">
              <div class="list-box blue" @click="listClick(items, 'bottom-0')">
                <p class="txt1">{{ items.bottom[0].label }}</p>
                <p class="txt2">{{ items.bottom[0].value }}</p>
              </div>
            </div>
            <div v-if="items.bottom && items.bottom[1]" class="bottom2 child">
              <div class="list-box orange" @click="listClick(items, 'bottom-1')">
                <p class="txt1">{{ items.bottom[1].label }}</p>
                <p class="txt2">{{ items.bottom[1].value }}</p>
              </div>
            </div>
            <div v-if="items.bottom3" class="child bottom3">
              <p class="xian" />
              <p class="xian2" />
              <div class="list-box orange" @click="listClick(items, 'bottom-2')">
                <p class="txt1">{{ items.bottom3[0].label }}</p>
                <p class="txt2">{{ items.bottom3[0].value }}</p>
              </div>
            </div>
            <!-- 闲置 -->
            <div v-if="items.leaveUnused" class="leave-unused">
              <div class="leave-unused-wrap">
                <p class="xian" />
                <p class="xian1" />
                <!-- <p class="xian2"></p>
                <p class="xian3"></p> -->
                <div class="leave-unused-box">
                  <div>
                    <div
                      class="list-box red"
                      @click="listClick(items, 'leaveUnused-xzList')"
                    >
                      <p class="txt1">{{ items.leaveUnused.xzList.label }}</p>
                      <p class="txt2">{{ items.leaveUnused.xzList.value }}</p>
                    </div>
                    <div class="list-box-wrap">
                      <div
                        class="list-box orange"
                        @click="listClick(items, 'leaveUnused-xzyqdList')"
                      >
                        <p class="txt1">
                          {{ items.leaveUnused.xzyqdList.label }}
                        </p>
                        <p class="txt2">
                          {{ items.leaveUnused.xzyqdList.value }}
                        </p>
                      </div>
                    </div>
                    <div class="list-box-wrap2">
                      <div class="qyyy resion">
                        <div
                          class="list-box orange"
                          @click="listClick(items, 'leaveUnused-qyyyList-0')"
                        >
                          <p class="txt1">
                            {{ items.leaveUnused.qyyyList[0].label }}
                          </p>
                          <p class="txt2">
                            {{ items.leaveUnused.qyyyList[0].value }}
                          </p>
                        </div>
                        <div
                          class="list-box green"
                          @click="listClick(items, 'leaveUnused-qyyyList-1')"
                        >
                          <p class="txt1">
                            {{ items.leaveUnused.qyyyList[1].label }}
                          </p>
                          <p class="txt2">
                            {{ items.leaveUnused.qyyyList[1].value }}
                          </p>
                        </div>
                      </div>
                      <div class="zfyy resion">
                        <div
                          class="list-box orange"
                          @click="listClick(items, 'leaveUnused-zfyyList-0')"
                        >
                          <p class="txt1">
                            {{ items.leaveUnused.zfyyList[0].label }}
                          </p>
                          <p class="txt2">
                            {{ items.leaveUnused.zfyyList[0].value }}
                          </p>
                        </div>
                        <div
                          class="list-box green"
                          @click="listClick(items, 'leaveUnused-zfyyList-1')"
                        >
                          <p class="txt1">
                            {{ items.leaveUnused.zfyyList[1].label }}
                          </p>
                          <p class="txt2">
                            {{ items.leaveUnused.zfyyList[1].value }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <p class="line" />
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import cxdhtMixins from './cxdhtMixins.js'
export default {
  mixins: [cxdhtMixins]
}
</script>
<style lang="scss" scoped>
// #jdjg-scdht {
//   padding-top: 200px;
//   .where {
//     display: flex;
//     justify-content: flex-end;
//   }
//   .scdht-box {
//     position: relative;
//     transform: scale(0.8);
//     .trunk {
//       padding: 0;
//       margin: 100px 0 0 -25px;
//       display: flex;
//       position: relative;
//       justify-content: flex-start;
//       align-items: center;
//       width: 1880px;
//       background: url(./images/mbarrow.jpg) no-repeat right 10px;
//       li {
//         list-style: none;
//         position: relative;
//         z-index: 9;
//       }
//       p.line {
//         height: 10px;
//         width: 1850px;
//         background: #044f93;
//         position: absolute;
//         top: 20px;
//         left: 0;
//       }
//       .lists {
//         margin-left: 30px;
//         width: 100px;
//         font-weight: bold;
//         .list-box {
//           height: 60px;
//           width: 110px;
//           text-align: center;
//           border-radius: 5px;
//           cursor: pointer;
//           p {
//             line-height: 28px;
//           }
//         }
//         .title {
//           width: 100px;
//           height: 30px;
//           text-align: center;
//           line-height: 30px;
//           border-radius: 5px;
//           border: 1px solid #c9d2d0;
//           color: white;
//           font-weight: bold;
//           letter-spacing: 2px;
//           text-indent: 2px;
//         }
//         .child {
//           position: absolute;
//           min-height: 95px;
//           width: 110px;
//           right: -5px;
//           text-align: center;
//         }
//         .green {
//           border: 1px solid #4bb90d;
//           .txt1 {
//             background: linear-gradient(#65bd2e, #90ea80);
//             color: white;
//           }
//           .txt2 {
//             background: linear-gradient(#d6f7d7, white);
//           }
//         }
//         .top {
//           bottom: 35px;
//           background: url(./images/jt_t.jpg) no-repeat bottom center;
//         }
//         .top1 {
//           bottom: 135px;
//           background: url(./images/jt_t.jpg) no-repeat bottom center;
//         }
//         .bottom1 {
//           .list-box {
//             margin-top: 35px;
//           }
//           top: 35px;
//           background: url(./images/jt_d.jpg) no-repeat top center;
//         }
//         .blue {
//           border: 1px solid #2a8afe;
//           .txt1 {
//             background: linear-gradient(#2a8afe, #5face1);
//             color: white;
//           }
//           .txt2 {
//             background: linear-gradient(#d4ebfb, white);
//           }
//         }
//         .bottom2 {
//           .list-box {
//             margin-top: 35px;
//           }
//           top: 135px;
//           background: url(./images/jt_d.jpg) no-repeat top center;
//         }
//         .orange {
//           border: 1px solid #e66800;
//           .txt1 {
//             background: linear-gradient(#e66800, #fb7500);
//             color: white;
//           }
//           .txt2 {
//             background: linear-gradient(#ffe6d1, white);
//           }
//         }
//         .bottom3 {
//           .xian {
//             width: 1px;
//             height: 100px;
//             margin: 3px auto 0;
//             background: black;
//           }
//           .xian2 {
//             width: 92px;
//             height: 22px;
//             margin: 0px auto 0;
//             position: relative;
//             left: 1px;
//             background: url(./images/jt_d.jpg) no-repeat bottom center;
//           }
//           .list-box {
//             margin-top: 15px;
//           }
//         }
//         .red {
//           border: 1px solid #e66800;
//           .txt1 {
//             background: linear-gradient(#de0f15, #c03d28);
//             color: white;
//           }
//           .txt2 {
//             background: linear-gradient(#f3b1a6, white);
//           }
//         }
//         .leave-unused {
//           position: absolute;
//           top: 230px;
//           left: -5px;
//           .leave-unused-wrap {
//             position: relative;
//             .xian {
//               width: 1px;
//               height: 30px;
//               background: black;
//               margin-left: 55px;
//             }
//             .xian1 {
//               width: 110px;
//               height: 30px;
//               background: url(./images/jt_d.jpg) no-repeat top center;
//             }
//             .leave-unused-box {
//               position: relative;
//               top: 0;
//               left: 0;
//               > div {
//                 position: relative;
//                 display: flex;
//                 .list-box-wrap {
//                   padding-left: 20px;
//                   height: 60px;
//                   background: url(./images/jt5.jpg) no-repeat 0 center;
//                 }
//                 .list-box-wrap2 {
//                   height: 140px;
//                   padding-left: 22px;
//                   position: relative;
//                   top: -38px;
//                   left: 5px;
//                   background: url(./images/jt3.jpg) no-repeat 0 center;
//                   .qyyy {
//                     margin-bottom: 20px;
//                   }
//                   .resion {
//                     display: flex;
//                     background: url(./images/jt5.jpg) no-repeat 112px center;
//                     .list-box:nth-child(2) {
//                       margin-left: 22px;
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//       .list1 {
//         div {
//           width: 120px;
//           height: 50px;
//           background: #2a4a9f;
//           text-align: center;
//           border-radius: 10px;
//           box-shadow: 0 0 3px #2a4a9f;
//           border: 1px solid #606266;
//           //  filter: hue-rotate(100deg);
//           background: radial-gradient(#26469b, #1260e4);
//           p:first-child {
//             font-size: 16px;
//             color: white;
//             padding-top: 5px;
//           }
//           p {
//             font-size: 14px;
//             line-height: 20px;
//             color: #f5e703;
//             font-weight: bold;
//             font-size: 14px;
//           }
//         }
//       }

//       .list2 .title {
//         background: radial-gradient(#1a8f6e, #31b38e);
//         box-shadow: 0 0 2px #31b38e;
//       }
//       .list3 .title {
//         background: radial-gradient(#d25286, #f591b6);
//         box-shadow: 0 0 2px #f591b6;
//       }
//       .list4 .title {
//         background: radial-gradient(#49ef1b, #8cda12);
//         box-shadow: 0 0 2px #8cda12;
//       }
//       .list4 .title {
//         background: radial-gradient(#49ef1b, #8cda12);
//         box-shadow: 0 0 2px #8cda12;
//       }
//       .list5 .title {
//         background: radial-gradient(#c0b325, #bbc950);
//         box-shadow: 0 0 2px #bbc950;
//       }
//       .list6 .title {
//         background: radial-gradient(green, #11b95c);
//         box-shadow: 0 0 2px #11b95c;
//       }
//       .list7 .title {
//         background: radial-gradient(#4581bf, #1650bb);
//         box-shadow: 0 0 2px #1650bb;
//       }
//       .list8 .title {
//         background: radial-gradient(#a0af66, #9ba04e);
//         box-shadow: 0 0 2px #9ba04e;
//       }
//       .list9 .title {
//         background: radial-gradient(#4cb54c, #10ff00);
//         box-shadow: 0 0 2px #10ff00;
//       }
//       .list10 .title {
//         background: radial-gradient(green, #11b95c);
//         box-shadow: 0 0 2px #11b95c;
//       }
//       .list11 .title {
//         background: radial-gradient(#5e48b7, #718be8);
//         box-shadow: 0 0 2px #718be8;
//       }
//       .list12 .title {
//         background: radial-gradient(#0091ff, #0083e6);
//         box-shadow: 0 0 2px #0083e6;
//       }
//       .list13 .title {
//         background: radial-gradient(#080080, #1145b9);
//         box-shadow: 0 0 2px #1145b9;
//       }
//       .list14 .title {
//         background: radial-gradient(#c31c59, #d34bc9);
//         box-shadow: 0 0 2px #d34bc9;
//       }
//     }
//   }
// }
</style>
