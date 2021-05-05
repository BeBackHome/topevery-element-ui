<!--
 * @Author: shiliangL
 * @Date: 2021-02-23 15:37:35
 * @LastEditTime: 2021-03-20 18:38:04
 * @LastEditors: Do not edit
 * @Description:人员定位终端管理 SupervisePeoplePosition
-->
<template>
  <div class="table">
    <cube-Table-List
      ref="CubeTableList"
      class="page"
      :config="config"
    />
  </div>
</template>

<script>

export default {
  name: 'SupervisePeoplePosition',
  data() {
    return {
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
        url: `${this.$prefixUrl}` + '/PersonnelTerminal/getPageList',
        search: {
          data: [
            [
              {
                type: 'cubeSelect',
                value: null,
                class: 'w140',
                key: 'sectionId',
                extraParam: { // 其他请求拓展参数
                  rootType: 1,
                  showGeomCol: false
                },
                config: {
                  placeholder: '选择企业',
                  keyCode: 'value',
                  keyName: 'label',
                  children: 'children',
                  method: 'POST',
                  url: `${this.$prefixUrl}` + '/company/getPageList'
                }
              },
              {
                value: null,
                type: 'input',
                key: 'personName',
                placeholder: '人员姓名',
                class: 'w140'
              },
              {
                value: null,
                type: 'input',
                key: 'clientKey',
                placeholder: '设备ID',
                class: 'w140'
              },
              {
                type: 'option', class: 'w150', value: null, key: 'onlineType', placeholder: '是否在线', options: [
                  { value: 0, label: '离线' },
                  { value: 1, label: '在线' }
                ]
              },
              {
                type: 'daterange',
                value: null,
                initValue: [

                ],
                key1: 'beginDate',
                key2: 'endDate',
                placeholder1: '开始日期',
                placeholder2: '结束日期'
              },
              { type: 'search', name: '查询' },
              { type: 'reset', name: '重置' }
            ],
            [
              { type: 'button', icon: 'el-icon-folder-opened', name: '导出', action: () => this.export() }
            ]
          ]
        },
        table: {
          showHeader: false,
          tableHeight: 250,
          calcTableHeight: true, // 是否开启表格自动高度计算
          columns: [
            {
              label: '序号', // 表格表头名字
              type: 'index' // type 一般不需要 仅仅  selection 、 index
            },

            {
              label: '人员姓名', // 表格表头名字
              key: 'personName' // 数据映射key
            },
            {
              label: '人员类型', // 表格表头名字
              key: 'name'
            },
            {
              label: '所属企业', // 表格表头名字
              key: 'sectionName'
            },
            {
              label: '设备ID', // 表格表头名字
              key: 'clientKey'
            },
            {
              label: '是否在线', // 表格表头名字
              key: 'onlineType',
              render: (h, parmas) => {
                const typeMap = {
                  0: '离线',
                  1: '在线'
                };
                const { row } = parmas;
                return <span> {typeMap[row.onlineType]} </span>;
              }
            },
            {
              label: '最后通讯时间', // 表格表头名字
              key: 'lastOnlineDate'
            },
            {
              label: '异常报警', // 表格表头名字
              key: 'alarmStatus',
              render: (h, parmas) => {
                const typeMap = {
                  0: '正常',
                  1: 'SOS求救',
                  2: '疲劳驾驶',
                  3: '低电报警',
                  4: '超速报警',
                  5: '断电报警',
                  6: '震动报警'
                };
                const { row } = parmas;
                return <span> {typeMap[row.alarmStatus]} </span>;
              }
            },
            {
              label: '操作',
              width: 150,
              render: (h, parmas) => {
                const { row } = parmas;
                return (
                  <div class='flex-table-cell'>
                    <div class='btn-text' onClick={ () => this.showRecords(row) }>通讯记录 </div>|
                    <div class='btn-text' onClick={ () => this.showTrace(row) }> 人员轨迹 </div>
                  </div>);
              }
            }
          ]
        }
      }
    };
  },
  methods: {
    refresh() {
      this.$refs['CubeTableList'] && this.$refs['CubeTableList'].fetchList();
    },
    getTableSelection() {
      return this.$refs['CubeTableList'] && this.$refs['CubeTableList'].getTableSelection();
    },
    showRecords(row) {
    // <!-- deviceType 0 人  其他为车辆 -->
      this.$setKeyValue(this.communicationAdd, { visible: true, data: { type: 0, id: row.deviceId, deviceType: 0, dialogTitle: '设备通讯记录查询' }});
    },
    showTrace(row) {
    // <!-- deviceType 0 人  其他为车辆 -->
      this.$setKeyValue(this.trackAdd, { visible: true, data: { type: 0, id: row.deviceId, deviceType: 0, dialogTitle: '人员轨迹回放查询' }});
    }
  }
};

</script>

<style lang="scss" scoped>
</style>
