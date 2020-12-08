<!--
 * @Author: shiliangL
 * @Date: 2020-06-17 14:20:40
 * @LastEditTime: 2020-12-08 14:09:55
 * @LastEditors: Do not edit
 * @Description: 人工作业添加人员选择
 * @FilePath: /topevery-element-ui-v2/examples/play/views/About.vue
-->
<template>
    <cube-Table-List
      ref="CubeTableRender"
      class="page"
      :config="config"
      :extra-param="extraParam"
    />
</template>

<script>

export default {
  name: 'AddPeople2line',
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    sectionAreaId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      extraParam: {
        sectionAreaId: null,
        chooseList: [],
        personTypeList: []
      },
      config: {
        method: 'POST',
        url: 'http://114.215.84.175:49210/personWorkGrid/getSchedulingPersonPage',
        search: {
          data: [
            [
              {
                type: 'input',
                key: 'name',
                class: 'w180',
                placeholder: '人工作业添加人员选择'
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
          immediateLoad: false, // 组件穿件是否马上加载数据
          // loadType: 'list', // 加载方式 page选择分页, list滚动到底部加载（list 不显示分页）
          //   tableDataType: 'page', // 后台返回数据结构 默认是分页 list 不分页列表数据结构
          columns: [
            // { label: '选择', type: 'selection' },
            { label: '序号', type: 'index' },
            { label: '人员名称', key: 'name' },
            // { label: '电话', key: 'code' },
            { label: '人员类型', key: 'personTypeName' },
            {
              label: '操作',
              width: 140,
              render: (h, parmas) => {
                const { row } = parmas;
                return (
                  <div class='flex-table-cell'>
                    <div class='btn-text' onClick={() => this.selsetRow(row)}>选择</div>
                  </div>
                );
              }
            }
          ]
        }
        // classRow: null,
        // classItem: null
      }
    };
  },
  mounted() {
    this.openDialog();
  },
  methods: {
    openDialog(item, kk, ki) {
      const personTypeList = ['EE9A7851-EF73-4A80-8AC1-E86635A270C9', 'C24D3966-A1BC-4F17-9C05-AF47F452C437', '7A833A27-29A8-49A3-9CCE-C594AFB8CD9A', '55A5A17F-9B8D-489C-BEDB-6094EFEF498A'];
      const chooseList = [];
      this.extraParam = { chooseList, personTypeList, workState: 0, sectionAreaId: this.sectionAreaId };
      // 中转对象
      this.classRow = item;
      this.classItem = kk;
      this.$emit('update:dialogVisible', true);
    },
    closeDialog() {
      this.$emit('update:dialogVisible', false);
    },
    selsetRow(row) {
      const { classRow, classItem } = this;
      if (classRow && Array.isArray(classRow.postList)) {
        const flag = classRow.postList.some((item) => item.personId === row.personId);
        if (!flag) {
          classItem.personId = row.personId;
          classItem.postName = row.name;
          this.closeDialog();
        } else {
          this.$message({ message: '当前班次已经安排该人员,请勿重复选择', type: 'warning' });
        }
      }
    },
    submitHandler() {

    }
  }
};
</script>

<style lang="scss" scoped>
</style>
