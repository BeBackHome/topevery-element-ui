<!--
 * @Author: shiliangL
 * @Date: 2021-02-23 15:37:35
 * @LastEditTime: 2021-05-12 13:33:58
 * @LastEditors: Do not edit
 * @Description:人员定位终端管理 SupervisePeoplePosition
-->
<template>
  <div class="table">
    <cube-select
      v-model="managerCubeSelect"
      :extra-param="extraParam"
      style="width: 100%;"
      :config="managerConfig"
    />
    <cube-Table-List
      ref="CubeTableList"
      class="page"
      :extraParam="extraParam"
      :config="config"
      @afterLoad="afterLoad"
    />
  </div>
</template>

<script>

export default {
  name: 'SupervisePeoplePosition',
  data() {
    return {
      extraParam: {},
      trackAdd: {
        visible: false,
        data: {
          type: 0,
          fullscreen: true
        }
      },
      communicationAdd: {
        visible: false,
        data: {
          type: 0,
          fullscreen: true
        }
      },
      config: {
        method: 'POST',
        // url: `${this.$prefixUrl}` + '/personAttendanceUnqualifiedStatistics/getListPerson',
        url: 'http://192.168.5.11:49210/personAttendanceUnqualifiedStatistics/getListPerson',
        search: {
          data: [
            [

            ],
            [
              { type: 'button', icon: 'el-icon-folder-opened', name: '导出', action: () => this.export() }
            ]
          ]
        },
        table: {
          prefixHeight: 20,
          tableHeight: 480,
          calcTableHeight: false, // 是否开启表格自动高度计算
          immediateLoad: true, // 组件穿件是否马上加载数据
          // loadType: 'list', // 加载方式 page选择分页, list滚动到底部加载（list 不显示分页）
          tableDataType: 'list',
          columns: [
            { label: '展开', type: 'expand' },
            { label: '序号', type: 'index' },
            { label: '片区名称', key: 'no' },
            { label: '姓名', key: 'carTypeDesc' },
            { label: '人员类型', key: 'companyName' },
            { label: '日期', key: 'manageDeptName' },
            { label: '实际出勤总时长', key: 'manageDeptName' },
            { label: '片区内总里程数', key: 'manageDeptName' },
            { label: '出勤情况', key: 'manageDeptName' },
            {
              label: '操作',
              width: 80,
              render: (h, parmas) => {
                const { row } = parmas;
                return (
                  <div class='flex-table-cell'>
                    <div class='btn-text' onClick={() => this.openOverLayType(1, row)}>
                      轨迹回放
                    </div>
                  </div>
                );
              }
            }
          ]
        }
      }
    };
  },
  mounted() {
    const extraParam = { 'pageIndex': 1, 'pageSize': 30, 'manageDeptId': 'DBAD7F40-6EC8-47DE-AFA6-571DEE441EA7', 'sectionId': 'EE6B9987-F2E4-4EB6-BB42-DD44A8C6CC6B', 'columnName': 'workFailedPersonNum', 'date': '2021-04-30' };
    this.extraParam = extraParam;
  },
  methods: {
    afterLoad(data, searchParams) {
      console.log(data, searchParams);
    },
    refresh() {
      this.$refs['CubeTableList'] && this.$refs['CubeTableList'].fetchList();
    },
    getTableSelection() {
      return this.$refs['CubeTableList'] && this.$refs['CubeTableList'].getTableSelection();
    },
    showRecords(row) {
      // <!-- deviceType 0 人  其他为车辆 -->
      this.$setKeyValue(this.communicationAdd, { visible: true, data: { type: 0, id: row.deviceId, deviceType: 0, dialogTitle: '设备通讯记录查询' } });
    },
    showTrace(row) {
      // <!-- deviceType 0 人  其他为车辆 -->
      this.$setKeyValue(this.trackAdd, { visible: true, data: { type: 0, id: row.deviceId, deviceType: 0, dialogTitle: '人员轨迹回放查询' } });
    }
  }
};

</script>

<style lang="scss" scoped>
</style>
