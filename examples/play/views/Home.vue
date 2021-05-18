<!--
 * @Author: shiliangL
 * @Date: 2020-06-05 09:48:22
 * @LastEditTime: 2021-05-19 00:23:59
 * @LastEditors: Do not edit
 * @Description: 
 * @FilePath: /topevery-element-ui-v2/examples/play/views/CubeCascade.vue
--> 
<template>
  <div>
    cube-select-tree 2
    <!-- <cube-select-cascade v-model="selectCascade" @config="config" /> -->
    <cube-Table-List
      ref="CubeTableList"
      class="page"
      :extra-param="extraParam"
      :config="config3"
    />

    <cube-select-tree
      v-if="0"
      v-model="cubeSelect"
      :config="configPlus"
      @change="selectTreeChange"
    />

    <cube-select
      v-model="select2x"
      :config="carConfig"
    />
  </div>
</template>

<script>
const baseURL = 'http://192.168.5.14:49227/';
export default {
  data() {
    return {
      select2x: null,
      carConfig: {
        showHeader: false, // 是否显示表头
        keyName: 'no',
        keyCode: 'carId',
        method: 'POST',
        inputWidth: '100%',
        // isNoPage: true,
        // tableHeight: '200px',
        url: 'http://192.168.5.11:49052/car/getSelectList',
        placeholder: '请选择',
        column: [
          { key: 'no', label: '名称', align: 'left' }
        ]
      },
      cubeSelect: null,
      configPlus: {
        size: 'mini',
        clearable: false,
        focusOnload: false,
        selectAny: true,
        initSeletTheFirstAfterLoad: true,
        placeholder: '选择标段',
        keyCode: 'value',
        keyName: 'label',
        inputWidth: '334px',
        popoverWidth: '334px',
        children: 'children',
        method: 'POST',
        otherProps: ['dataType'],
        url: 'http://192.168.5.11:49052/getSectionTree'
      },
      extraParam: {
        rootType: 1,
        showGeomCol: false
      },
      config3: {
        method: 'POST',
        url: 'http://192.168.5.11:49052' + '/personWorkGrid/getSchedulingPersonPage',
        search: {
          data: [
            [
              {
                type: 'cubeSelect',
                value: null,
                class: 'w140',
                key: 'compnyId',
                extraParam: { // 其他请求拓展参数
                  rootType: 1,
                  showGeomCol: false
                },
                config: {
                  placeholder: '选择企业',
                  keyCode: 'value',
                  keyName: 'label',
                  method: 'POST',
                  url: 'http://192.168.5.11:49052/getCompanySelectPageList',
                  column: [
                    { key: 'label', label: '名称' }
                  ]
                }
              },
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
  },
  methods: {
    selectTreeChange(item) {
      console.log(item, '-xx-');
    }
  }
};
</script>

<style lang="scss" scoped>
</style>