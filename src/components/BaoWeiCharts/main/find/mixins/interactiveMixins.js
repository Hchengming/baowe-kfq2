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
                    this.getInteractiveData();
                    break;
            }

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
                    //模块类型获取
                    let type = "";
                    let moduleName = config.contentAreaConfig.title ?
                        config.contentAreaConfig.title :
                        "模块未命名";
                    //1、图表
                    if (!config.contentAreaConfig.moduleType ||
                        config.contentAreaConfig.moduleType === "0"
                    ) {
                        //01-获取图表类型
                        dataPresentation.forEach(item => {
                            if (item.type === config.contentAreaConfig.displayMode) {
                                type = item.title;
                            }
                        });
                        let interactiveParams = [];
                        //02-获取交付对应字段参数集合
                        config.conditionAreaConfig.screenData.forEach(item => {
                            interactiveParams.push({
                                lab: item.label,
                                val: item.key
                            });
                        });
                        this.interactiveModuleAll.push({
                            moduleId: config.moduleId,
                            moduleName,
                            type,
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
        getInteractiveData() {
            this.interactiveData = [];
            serviceAxios
                .post(this.settingConfig.commonUrl + "/interactive/select", {
                    moduleId: this.interactiveModuleId
                })
                .then(res => {
                    this.interactiveData = JSON.parse(res.data)
                    this.$refs["InteractiveSetting"].show();
                });
        },
        //模块交互配置数据保存事件
        interactiveDataEmit() {
            let reqObj = {
                moduleId: this.interactiveModuleId,
                interactiveData: this.interactiveData
            };
            serviceAxios
                .post(this.settingConfig.commonUrl + "/interactive/emit", reqObj)
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
        }
    }
};