//模块交互功能实现
import serviceAxios from "@/utils/request.js";
import dataPresentation from "../../../components/SettingForm/dataPresentation.json";
export default {
    data() {
        return {
            beforeParamsData: [], //当前模块供选择参数
            interactiveModuleAll: [], //可交互模块集合
            interactiveData: [], //交互配置数据
            interactiveModuleId: "" //当前交互配置模块id
        };
    },
    methods: {
        // 图表组件集配置按钮点击事件
        interactiveSetting(reqObj) {
            this.interactiveModuleAll = [];
            switch (reqObj.name) {
                case "图表组件集":
                    this.chartsInteractive(reqObj.statisticsAll);
                    this.interactivePageData(reqObj.pageData);
                    break;
            }
            this.getInteractiveData(() => {
                this.$refs["InteractiveSetting"].show();
            });

        },
        //图表组件集交互数据配置---图表、iframe
        chartsInteractive(statisticsAll) {
            this.interactiveModuleId = statisticsAll.moduleId;
            //判断是否为分页数据
            // let isPage=statisticsAll.contentAreaConfig.isPage;
            this.beforeParamsData = [];
            statisticsAll.contentAreaConfig.keyArr.forEach(item => {
                if (item.isShow) {
                    this.beforeParamsData.push({
                        lab: item.explain,
                        val: item.key
                    });
                }
            });
        },
        //当前页面所有图表组件获取--图表、iframe
        interactivePageData(pageData) {
            pageData.forEach(config => {
                if (config.moduleId !== this.interactiveModuleId) {
                    let moduleName = config.contentAreaConfig.title ?
                        config.contentAreaConfig.title :
                        "模块未命名";
                    //1、图表
                    if (!config.contentAreaConfig.moduleType ||
                        config.contentAreaConfig.moduleType === "0"
                    ) {

                        let interactiveParams = [];
                        //01-获取交付对应字段参数集合
                        config.conditionAreaConfig.screenData.forEach(item => {
                            interactiveParams.push({
                                lab: item.label,
                                val: item.key
                            });
                        });
                        this.interactiveModuleAll.push({
                            moduleId: config.moduleId,
                            moduleName,
                            type: config.contentAreaConfig.displayMode,
                            interactiveParams
                        });
                    } else if (config.contentAreaConfig.moduleType === "1") {
                        //2、iframe框
                        this.interactiveModuleAll.push({
                            moduleId: config.moduleId,
                            moduleName,
                            type: "iframe",
                            interactiveParams: []
                        });
                    }
                }
            });
        },
        //当前交互模块配置数据查询事件
        getInteractiveData(fn) {
            this.interactiveData = [];
            serviceAxios
                .post(this.settingConfig.commonUrl + "/jhConfig/selectJhConfig", {
                    moduleId: this.interactiveModuleId
                })
                .then(res => {
                    this.interactiveData = res.data ? JSON.parse(res.data[0].interactiveData) : []
                    fn()

                });
        },
        //模块交互配置数据保存事件
        interactiveDataEmit() {
            let reqObj = {
                moduleId: this.interactiveModuleId,
                interactiveData: this.interactiveData
            };
            serviceAxios
                .post(this.settingConfig.commonUrl + "/jhConfig/updateJhConfig", reqObj)
                .then(res => {
                    console.log(res);
                    this.$message({
                        type: "success",
                        message: "当前模块交互配置数据编辑成功"
                    });
                });
        },
        //模块交互触发
        interactiveElementMethods(reqObj) {
            //图表组件集配置按钮点击事件获取
            if (reqObj.methodsName === "interactive") {
                this.interactiveSetting(reqObj);
            }
            //表格单元格点击事件--触发模块交互
            if (reqObj.methodsName === "cellClick") {
                this.chartsCellClick(reqObj);
            }
        },
        //表格、列表、图表、详情表格单元格点击触发交互事件
        chartsCellClick(reqObj) {
            this.interactiveModuleId = reqObj.moduleId
                // this.$refs['middleware'].interactive()
            this.getInteractiveData(() => {
                this.interactiveData.forEach(items => {
                    if (items.otherModuleConfig.length > 0) {
                        let chartsTypeArr = []
                        dataPresentation.forEach(obj => {
                            chartsTypeArr.push(obj.type)
                        })
                        items.otherModuleConfig.forEach(item => {
                            if (chartsTypeArr.indexOf(item.moduleType) > -1) {
                                //01-交互表格、列表、图表、详情表格单元格
                                let params = {}
                                params[item.corParams] = reqObj.rowItem[items.paramsChoose]
                                console.log(params)
                            }
                        })
                    }
                })

            });
        }
    }
};