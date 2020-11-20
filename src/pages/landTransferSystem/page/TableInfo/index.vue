<template>
  <div class="table-area-out">
    <div class="table-area">
      <div class="table-main">
        <div class="table-title">{{ fomartData(tableData['项目名称']) }}</div>
        <div class="table-title table-title-left">基本情况</div>
        <div class="table-row">
          <div class="inner-table-label">成交情况</div>
          <div class="inner-table">
            <div class="inner-table-row">
              <div class="inner-table-row-label nobrder">受让人</div>
              <div class="inner-table-row-content ellipsis-content" :title="fomartData(tableData['受让人'])">{{ fomartData(tableData["受让人"]) }}</div>
              <div class="inner-table-row-label" title="签订日期">成交时间</div>
              <div class="inner-table-row-content ellipsis-content" title="签订日期">{{ fomartData(tableData["签订日期"]) }}</div>
            </div>
            <div class="inner-table-row">
              <div class="inner-table-row-label nobrder">出让价款(万元)</div>
              <div class="inner-table-row-content ellipsis-content" title="出让总价(万元)">{{ fomartData(tableData["出让总价(万元)"]) }}</div>
              <div class="inner-table-row-label">合同编号</div>
              <div class="inner-table-row-content ellipsis-content" title="合同编号">{{ fomartData(tableData["合同编号"]) }}</div>
            </div>
            <div class="inner-table-row">
              <div class="inner-table-row-label nobrder">开工截止日期</div>
              <div class="inner-table-row-content ellipsis-content">{{ fomartData(tableData["约定动工时间"]) }}</div>
              <div class="inner-table-row-label">竣工截止日期</div>
              <div class="inner-table-row-content ellipsis-content"></div>
            </div>
            <div class="inner-table-row">
              <div class="inner-table-row-label nobrder">支付出让价款方式</div>
              <div class="inner-table-row-content inner-content-3 ellipsis-content" title="出让方式">{{ fomartData(tableData["出让方式"]) }}</div>
            </div>
            <div class="inner-table-row nobrder">
              <div class="inner-table-row-label nobrder">合同约束条款</div>
              <div class="inner-table-row-content inner-content-3"></div>
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="inner-table-label">宗地情况</div>
          <div class="inner-table">
            <div class="inner-table-row">
              <div class="inner-table-row-label nobrder">宗地编号</div>
              <div class="inner-table-row-content ellipsis-content" title="地块编号">{{ fomartData(tableData["地块编号"]) }}</div>
              <div class="inner-table-row-label">出让宗地面积(平方米)</div>
              <div class="inner-table-row-content ellipsis-content" title="出让面积(平方米)">{{ fomartData(tableData["出让面积(平方米)"]) }}</div>
            </div>
            <div class="inner-table-row">
              <div class="inner-table-row-label nobrder">建面单价(元/平方米)</div>
              <div class="inner-table-row-content ellipsis-content" title="建面单价(元/平方米)">{{ fomartData(tableData["建面单价(元/平方米)"]) }}</div>
              <div class="inner-table-row-label">建筑规模(平方米)</div>
              <div class="inner-table-row-content ellipsis-content" title="建筑规模(平方米)">{{ fomartData(tableData["建筑规模(平方米)"]) }}</div>
            </div>
            <div class="inner-table-row nobrder">
              <div class="inner-table-row-label nobrder">宗地用途</div>
              <div class="inner-table-row-content inner-content-3" title='规划用途'>{{ fomartData(tableData["规划用途"]) }}</div>
            </div>
          </div>
        </div>
        <div class="table-title table-title-left">出让金缴纳情况</div>
        <div class="table-row">
          <div class="inner-table-label">应缴总价款</div>
          <div class="inner-table">
            <div class="inner-table-row nobrder">
              <div class="inner-table-row-label bottom-border no-left">{{ tableData.应缴总价款?tableData.应缴总价款.总价款:'' }}</div>
              <div class="inner-table-row-content">实际缴纳总金额</div>
              <div class="inner-table-row-content inner-content-2 bottom-border">
                <div class="inner-table-row-content-half">{{ tableData.实缴总价款?tableData.实缴总价款.总价款:'' }} (未交占比{{ tableData.实缴总价款?tableData.实缴总价款.未缴占比:'' }}%)</div>
                <div class="inner-table-row-content-half"></div>
              </div>
            </div>
            <div class="inner-table-row nobrder">
              <div class="inner-table-row-label div_flex bottom-border no-left no-pad">
                <div class="inner-inner-label">滞纳金</div>
                <div>{{ tableData.应缴总价款?tableData.应缴总价款.滞纳金:'' }}</div>
              </div>
              <div class="inner-table-row-content"></div>
              <div class="inner-table-row-label bottom-border">滞纳金</div>
              <div class="inner-table-row-content bottom-border">{{ tableData.实缴总价款?tableData.实缴总价款.滞纳金:'' }}</div>
            </div>
            <div class="inner-table-row nobrder">
              <div class="inner-table-row-label nobrder div_flex no-pad">
                <div class="inner-inner-label">违约金</div>
                <div>{{ tableData.应缴总价款?tableData.应缴总价款.违约金:'' }} </div>
              </div>
              <div class="inner-table-row-content"></div>
              <div class="inner-table-row-label">违约金</div>
              <div class="inner-table-row-content">{{ tableData.实缴总价款?tableData.实缴总价款.违约金:'' }}</div>
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="inner-table-label">缴纳详情</div>
          <div class="inner-table">
            <div class="inner-table-row nobrder">
              <div class="inner-table-row-label nobrder">缴纳金额</div>
              <div class="inner-table-row-label">缴纳时间</div>
              <div class="inner-table-row-label">缴纳书号</div>
              <div class="inner-table-row-label">备注</div>
            </div>
            <slot>
            <div v-for="xx in tableData.缴纳详情" :key="xx.序号" class="inner-table-row">
              <div class="inner-table-row-content nobrder">{{ xx.缴纳金额 }}</div>
              <div class="inner-table-row-content">{{ xx.缴纳时间 }}</div>
              <div class="inner-table-row-content">{{ xx.缴纳书号 }}</div>
              <div class="inner-table-row-content">{{ xx.备注 }}</div>
            </div>
            </slot>
          </div>
        </div>
        <div class="table-title table-title-left">供后审批情况</div>
        <div class="table-row">
          <div class="table-row-label nobrder">建设用地规划许可时间</div>
          <div class="table-row-content" title='用地许可证首次核发时间'>{{ fomartData(tableData["用地许可证首次核发时间"]) }}</div>
          <div class="table-row-label">规划许可时间</div>
          <div class="table-row-content" title='工程许可证首次核发时间'>{{ fomartData(tableData["工程许可证首次核发时间"]) }}</div>
        </div>
        <div class="table-row">
          <div class="table-row-label nobrder">施工许可时间</div>
          <div class="table-row-content" title='施工许可证首次核发时间'>{{ fomartData(tableData["施工许可证首次核发时间"]) }}</div>
          <div class="table-row-label">预售时间</div>
          <div class="table-row-content"></div>
        </div>
        <div class="table-row">
          <div class="table-row-label nobrder">竣工核实时间</div>
          <div class="table-row-content"></div>
          <div class="table-row-label"></div>
          <div class="table-row-content"></div>
        </div>
        <div class="table-title table-title-left">相关信息提醒</div>
        <div class="row-text">{{ fomartData(tableData["按开工时间分类"]) }}</div>
        <!-- <div class="row-text">{{ !tableData["出让金缴纳情况"]||tableData["出让金缴纳情况"] === 'Null'?"-":fomartData(tableData["出让金缴纳情况"]) }}</div>
        <div class="row-text nobrder">超过竣工时间仍未取得规划许可证</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import itemHomeMixins from './itemHomeMixins'
export default {
  mixins:[itemHomeMixins],
  props:{
      tableData:{
          type:Object,
          default:null
      }
  },
  methods:{
    fomartData(val){
      // console.log('Null',val)
      return val?(val==='Null'?'':val):''
    }
  }
}
</script>
<style type="text/css" scoped>
  .table-area-out{
    background-color: white;
    width: 100%;
  }
  .table-area{
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
  }
  .table-area>div{
    position: relative;
    width: 100%;
  }
  .table-main{
    width:calc( 100% - 20px );
    height: max-content;
    border: 1px solid black;
    box-sizing: border-box;
  }
  .table-title{
    width: 100%;
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid black;
    box-sizing: border-box;
  }
  .table-title-left{
    text-align: left;
  }
  .table-row{
    display: flex;
    border-bottom: 1px solid black;
  }
  .inner-table-label{
    width: 20%;
    text-align: center;
    box-sizing: border-box;
  }
  .inner-table{
    width: 80%;
    border-left: 1px solid black;
    box-sizing: border-box;
  }
  .inner-table-row{
    border-bottom: 1px solid black;
    display: flex;
    height: 40px;
  }
  .inner-table-row-content-half{
    height: 50%;
  }
  /*.inner-table-row:before{*/
  /*  position: absolute;*/
  /*}*/
  .inner-table-row-label,.inner-table-row-content{
    width: 25%;
    text-align: center;
    padding:5px 0px 5px 0px;
    box-sizing: border-box;
  }
  .inner-content-3{
    width: 75%;
  }
  .inner-content-2{
    width: 50%;
  }
  .inner-table-row-label{
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid black;
    height: 100%;
  }
  .inner-table-row-content{
    border-left: 1px solid black;
  }
  .nobrder{
    border-width: 0px !important;
  }
  .no-left{
    border-left-width: 0px !important;
  }
  .bottom-border{
    border-bottom: 1px solid black;
  }
  .div_flex{
    display: flex;
  }
  .div_flex>div{
    width: 50%;
    text-align: center;
  }
  .div_flex>div:first-child{
   border-right: 1px solid black;
  }
  .table-row-label{
    width: 20%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
  .table-row-content{
    width: 30%;
    height: 40px;
    text-align: center;
    box-sizing: border-box;
  }
  .table-row-label{
    border-left: 1px solid black;
  }
  .table-row-content{
    border-left: 1px solid black;
  }

  .row-text{
    width: 100%;
    padding: 5px 0px 5px 15px;
    border-bottom: 1px solid black;
    box-sizing: border-box;
    font-style: italic;
  }

  .ellipsis-content{
    overflow: hidden;
    word-break: normal;
    text-overflow: ellipsis;
    cursor: default;
  }
  .inner-inner-label{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
  }
  .no-pad{
    padding: 0px;
  }
</style>

