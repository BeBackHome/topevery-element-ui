<!--
 * @Author: shiliangL
 * @Date: 2020-06-05 09:48:22
 * @LastEditTime: 2020-11-25 19:40:01
 * @LastEditors: Do not edit
 * @Description: 
 * @FilePath: /topevery-element-ui-v2/examples/play/views/CubeCascade.vue
--> 
<template>
  <div>
    <!-- <cube-select-cascade v-model="selectCascade" @config="config" /> -->
    <cube-Table-List
      ref="CubeTableList"
      class="page"
      :extra-param="extraParam"
      :config="config3"
    />
  </div>
</template>

<script>
const baseURL = 'http://114.215.84.175:49210';
export default {
  data() {
    return {
      extraParam: {
        'chooseList': [
          'A4D34B07-B145-445E-95E6-BA3EFCBEEEDB',
          '3C08DCA5-8451-495F-A68F-798CB85CE775',
          'CB2384A8-D13D-4269-88C4-ABB3A8EECDB3',
          '04A7EFD2-5E81-4FCB-AF39-071B71B076DC',
          'E96656D7-7202-4CDB-8AA9-08EB85D9E625',
          '2bfc7567-2623-4567-89ab-e5c2a2a4ad22',
          '9C97F522-E8E8-4A80-A59A-7332315AE11E',
          'D2BE7152-DB6C-4C9A-A965-99A98B363AEF',
          '85B1F05E-BC8E-4D0B-AEB9-2BCD42A8A208',
          'A620C9AD-2FA4-4019-8F6C-3C9EAB9E5174',
          'FFE49BEB-221F-481C-B368-29CCE68E87C9',
          '88070170-F6FC-4E48-A45C-5E061DB380FB',
          '90891813-449E-448D-A373-95C31D5B2878',
          '2198434C-88EF-4B80-A2BA-A4762AB6F5A8',
          '060B992A-A92B-4F54-B2A8-278FA7DC5E25',
          '7BC1E08B-3D59-459B-B072-ABB3B8EBFBA7'
        ],
        'personTypeList': [
          'EE9A7851-EF73-4A80-8AC1-E86635A270C9',
          'C24D3966-A1BC-4F17-9C05-AF47F452C437',
          '7A833A27-29A8-49A3-9CCE-C594AFB8CD9A',
          '55A5A17F-9B8D-489C-BEDB-6094EFEF498A'
        ],
        'workState': 0,
        'sectionAreaId': '80E7A774-149D-423A-BF6A-7A72279CB69D'
      },
      config3: {
        method: 'POST',
        url: 'http://114.215.84.175:49210' + '/personWorkGrid/getSchedulingPersonPage',
        search: {
          data: [
            [
              {
                type: 'input',
                key: 'name',
                class: 'w180',
                placeholder: '人员名称、电话'
              },
              { type: 'search', name: '查询' },
              { type: 'reset', name: '重置' }
            ],
            [
              //   { type: 'add', name: '选择部件', action: () => this.add() }
            ]
          ]
        },
        table: {
          prefixHeight: 20,
          tableHeight: 280,
          calcTableHeight: false, // 是否开启表格自动高度计算
          immediateLoad: true, // 组件穿件是否马上加载数据
          loadType: 'list', // 加载方式 page选择分页, list滚动到底部加载（list 不显示分页）
          columns: [
            { label: '序号', type: 'index' },
            { label: '人员名称', key: 'name' },
            { label: '人员类型', key: 'personTypeName' },
            {
              label: '操作',
              width: 140,
              render: (h, parmas) => {
                return (
                  <div class='flex-table-cell'>
                    <div class='btn-text'>选择</div>
                  </div>
                );
              }
            }
          ]
        }
      },
      config2: {
        method: 'POST',
        url: baseURL + '/car/getList',
        search: {
          data: [
            [
              {
                value: null,
                type: 'input',
                key: 'carNo',
                placeholder: '车牌号'
              },
              {
                type: 'daterange',
                value: null,
                initValue: [
                  '2020-09-23',
                  '2020-09-23'
                ],
                key1: 'beginDate',
                key2: 'endDate',
                placeholder1: '开始日期',
                placeholder2: '结束日期'
              },
              {
                value: null,
                type: 'date',
                key: 'carNo',
                placeholder: '时间',
                pickerOptions: {
                  disabledDate(time) {
                    return time.getTime() + (1000 * 60 * 60 * 24) > Date.now();
                  }
                }
              },
              { type: 'search', name: '查询' },
              { type: 'reset', name: '重置' }
            ],
            [
              // todo ②只有项目组账号有新增数据的权限所以默认没有新增操作
              // { type: 'add', name: '新增', action: () => this.add() },
              { type: 'del', name: '删除', action: () => this.del() },
              {
                type: 'more', options: [
                  { icon: 'el-icon-folder-opened', label: '导出', action: () => this.export() },
                  // { icon: 'el-icon-folder', label: '导入', action: () => this.importExcel() },
                  { icon: 'el-icon-minus', label: '停用', action: () => this.deactivate() }
                ]
              }

            ]
          ]
        },
        table: {
          calcTableHeight: true, // 是否开启表格自动高度计算
          columns: [
            {
              label: '选择', // 表格表头名字
              type: 'selection' // type 一般不需要 仅仅  selection 、 index
            },
            { label: '序号', type: 'index' },
            {
              label: '车牌号',
              key: 'no',
              render: (h, parmas) => {
                const { row } = parmas;
                return (
                  <a class='linkText' onClick={(e) => {
                    e.stopPropagation();
                    return this.getCarInfo(row.carId);
                  }}> {row.no} </a>);
              }
            },
            {
              key: 'deviceCode',
              label: '车载设备编号'
            },
            {
              key: 'carTypeDesc',
              label: '车辆类型'
            },
            {
              key: 'powerTypeDesc',
              label: '动力类型'
            },
            {
              key: 'brand',
              label: '车辆品牌'
            },
            {
              key: 'drivingLicenseRegisterDate',
              label: '行驶证注册日期'
            },
            {
              key: 'vehicleTare',
              label: '核定总质量（kg）',
              width: 125
            },
            {
              key: 'streetName',
              label: '街道'
            },
            { key: 'districtName', label: '辖区' },
            {
              key: 'ownerType',
              label: '权属类型',
              render: (h, parmas) => {
                const { row } = parmas;
                return <span> {row.ownerType === 0 ? '自有' : '租赁'} </span>;
              }
            },
            {
              key: 'workState',
              label: '工作状态',
              render: (h, parmas) => {
                const { row } = parmas;
                return <span> {row.workState === 0 ? '正常' : '停用'} </span>;
              }
            },
            {
              label: '操作',
              width: 80,
              render: (h, parmas) => {
                const { row } = parmas;
                return (
                  <div class='flex-table-cell'>
                    <div class='btn-text' onClick={() => this.editCar(row.carId)}>
                      <i class='el-icon-edit-outline' /> 编辑
                    </div>
                  </div>);
              }
            }
          ]
        }
      },
      selectCascade: [],
      config: {
        parentConfig: {
          keyName: 'code',
          keyCode: 'sectionId',
          placeholder: '企业选择',
          inputWidth: '180px',
          isNoPage: false, // 设置不分页
          method: 'get', // 请求方法
          url: '/static/section.json',
          column: [ // 仅仅作为展示用户使用
            { key: 'code', label: '名称' },
            { key: 'statusStr', label: '状态' }
          ]
        },
        childrenConfig: {
          keyName: 'code',
          keyCode: 'sectionId',
          placeholder: '司机选择',
          inputWidth: '180px',
          isNoPage: false, // 设置不分页
          relativeKey: 'companyId', // 关联依赖加载id -关键key 级联关系
          method: 'get', // 请求方法
          url: '/static/section.json',
          column: [ // 仅仅作为展示用户使用
            { key: 'code', label: '名称' },
            { key: 'statusStr', label: '状态' }
          ]
        }
      }
    };
  },
  mounted() {
    // 假如是编辑 则需要手动处理一下参数
    setTimeout(_ => {
      this.selectCascade = [
        { label: '父级联', value: '132123123' },
        { label: '子级联', value: '132123123' }
      ];
    }, 2000);
  }
};
</script>

<style lang="scss" scoped>
</style>