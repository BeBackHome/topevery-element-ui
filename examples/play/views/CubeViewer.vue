<template>
  <div class="communicationRecords">
    <div class="filter-container">
      <el-date-picker
        v-model="param.startTime"
        style="width:210px"
        type="datetime"
        placeholder="开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <span> - </span>
      <el-date-picker
        v-model="param.endTime"
        style="width:210px"
        type="datetime"
        placeholder="结束时间"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button
        type="primary"
        style="margin-left: 6px;"
        icon="el-icon-search"
        :disabled="activeName==='third'"
        @click="search(true)"
      > 查询 </el-button>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane
        label="互联网终端详情"
        name="first"
      >
        <cube-Table-List
          ref="CubeTableRender"
          class="page"
          :config="secondConfig"
          :extra-param="extraParam"
        />
      </el-tab-pane>
  
    </el-tabs>
  </div>
</template>

<script>

export default {
  name: 'CommunicationRecords',
  props: {
    showTrack: {
      type: Boolean,
      default: () => true
    },
    deviceId: {
      type: String,
      default: () => 'AB053AFB-3E48-4206-ACB7-3EF2C68E0CAB'
    },
    deviceType: {
      type: Number,
      default: () => 1
    },
    startTime: {
      type: String,
      default: () => '2021-03-12 00:00:00'
    },
    endTime: {
      type: String,
      default: () => '2021-03-12 23:59:59'
    }
  },
  data() {
    return {
      param: {
        startTime: this.startTime,
        endTime: this.endTime
      },
      extraParam: {

      },
      secondConfig: {
        method: 'POST',
        url: 'http://192.168.5.11:49052' + '/gpsTrace/listGpsPosTracePage',
        search: {
          data: [[], []]
        },
        table: {
          prefixHeight: 50,
          tableHeight: '80vh',
          calcTableHeight: false, // 是否开启表格自动高度计算
          immediateLoad: false, // 组件穿件是否马上加载数据
          loadType: 'list', // 加载方式 page选择分页, list滚动到底部加载（list 不显示分页）
          //   tableDataType: 'page', // 后台返回数据结构 默认是分页 list 不分页列表数据结构
          columns: [
            { label: '序号', type: 'index' },
            { label: '车牌号', key: 'objName' },
            { label: '经度', key: 'lng' },
            { label: '纬度', key: 'lat' },
            { label: '定位时间', key: 'gpsDate' },
            {
              label: '上传方式', key: 'upType',
              render: (h, parmas) => {
                const { row } = parmas;
                return (
                  <span>  { row.upType === 0 ? '实时上传' : '补传'} </span>
                );
              }
            },
            {
              label: '发动机状态', key: 'accState',
              render: (h, parmas) => {
                const { row } = parmas;
                return (
                  <span>  { row.accState === 0 ? '熄火' : '启动' } </span>
                );
              }
            },
            { label: '速度(公里/小时)', key: 'speed' },
            { label: '有效作业累计时长', key: 'validTime' },
            { label: '是否在作业线路上', key: 'isWorkLine' },
            { label: '有效速度', key: 'validSpeed',
              render: (h, parmas) => {
                const { row } = parmas;
                return (
                  <span>  { row.validSpeed === 0 ? '否' : '是' } </span>
                );
              }
            },
            { label: '是否有效作业', key: 'validWork',
              render: (h, parmas) => {
                const { row } = parmas;
                return (
                  <span>  { row.validWork === 0 ? '否' : '是' } </span>
                );
              }
            },
            { label: '有效作业累计时长', key: 'validTime' }
          ]
        },
        pagination: {
          pageSizes: [10, 30, 50, 70, 100], // 默认分页可选择的每页显示的页数
          size: 100, // 分页每页默认显示50条
          currentPage: 1, // 当前默认第一页
          total: 0 // 总条数
        }
      },
      activeName: 'first'
    };
  },
  mounted() {
    this.setExtraParam();
  },
  methods: {
    setExtraParam() {
      const { deviceType, deviceId } = this;
      const { startTime, endTime } = this.param;
      this.extraParam = {
        beginDate: startTime,
        endDate: endTime,
        objType: deviceType,
        objId: deviceId
      };
    },
    search() {
      const { deviceType, deviceId } = this;
      const { startTime, endTime } = this.param;
      this.extraParam = {
        beginDate: startTime,
        endDate: endTime,
        objType: deviceType,
        objId: deviceId
      };
    }
  }
};
</script>

<style lang='scss' scoped>
.trackPlayback-warp {
  background: #e8e8e8;
  height: calc(100vh - 180px);
}
/deep/.el-tabs__header {
  margin: 0;
}
.table-list {
  height: auto/100%;
}
/deep/.el-tabs__content {
  height: calc(100vh - 180px);
}
</style>
