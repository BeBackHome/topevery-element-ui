<!-- CubeTable  组件 - 表格 -->
<template>
  <el-table
    slot="table"
    :ref="name"
    v-loadMore="loadMore"
    v-loading="loading"
    :row-key="rowKey"
    class="cube-table"
    :border="border"
    style="width: 100%;"
    :data="initConfig.data"
    :height="height"
    :stripe="stripe"
    :size="size"
    :max-height="maxHeight"
    :highlight-current-row="highlightCurrentRow"
    :element-loading-text="loadingText"
    :row-style="rowStyle"
    :header-cell-style="headerCellStyle"
    :row-class-name="rowClassName"
    :cell-class-name="cellClassName"
    :expand-row-keys="expandKeysArray"
    @row-click="tableRowClick"
    @row-dblclick="dbtableRowClick"
    @expand-change="expandChange"
  >
    <template v-for="(column, index) in initConfig.columns">
      <!-- 处理 selection 、 index  、 expand 特殊项 -->
      <template v-if="column.type">
        <!-- expand -->
        <template v-if="column.type==='expand'">
          <el-table-column
            v-if="column.type"
            :key="column._rowKey ? column._rowKey : index"
            :align="column.align ? column.align : 'center' "
            :label="column.type === 'index' ? column.label : '' "
            :type="column.type"
            :fixed="column.fixed"
            :width="column.width ? column.width : null "
          >
            <template
              v-if="column.type==='expand'"
              slot-scope="props"
              :row="props.row"
            >
              <template v-if="column.type==='expand'">
                <slot
                  :row="props.row"
                  name="expand"
                />
              </template>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="column.type==='index'">
          <!-- index -->
          <el-table-column
            v-if="column.type"
            :key="column._rowKey ? column._rowKey : index"
            :align="column.align ? column.align : 'center' "
            :label="column.type === 'index' ? column.label : '' "
            :type="column.type"
            :fixed="column.fixed"
            :width="column.width ? column.width : 50 "
            :index="indexMethod"
          />
        </template>
        <template v-else>
          <!-- selection -->
          <el-table-column
            v-if="column.type"
            :key="column._rowKey ? column._rowKey : index"
            :align="column.align ? column.align : 'center' "
            :label="column.type === 'index' ? column.label : '' "
            :type="column.type"
            :fixed="column.fixed"
            :width="column.width ? column.width : 50 "
          />

        </template>
      </template>
      <!-- 常规 -->
      <template v-else>
        <el-table-column
          :key="column._rowKey ? column._rowKey : index"
          :align="column.align ? column.align : 'center' "
          :label="column.label"
          :prop="column.key"
          :width="column.label ==='操作' ? column.width ? column.width : 140 : column.width ? column.width : 'auto'"
          :fixed="column.fixed"
          tooltip-effec="light"
          :show-overflow-tooltip="!column.tooltip"
          v-bind="column.attributes"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              <template>
                <span>{{ scope.row[column.key] }}</span>
              </template>
            </template>
            <template v-else>
              <render
                :column="column"
                :index="index"
                :render="column.render"
                :row="scope.row"
              />
            </template>
          </template>
        </el-table-column>
      </template>
    </template>
  </el-table>
</template>

<script>

import { deepClone, deepMerge } from 'topevery-element-ui/src/utils/index.new.js';
import ElTable from 'topevery-element-ui/packages/table';
import ElTableColumn from 'topevery-element-ui/packages/table-column';
import Loading from 'topevery-element-ui/packages/loading';

export default {
  name: 'CubeTable',
  directives: {
    loadMore: {
      bind(el, binding) {
        const selectWrap = el.querySelector('.el-table__body-wrapper');
        function scrollTableEvent() {
          const sign = 0;
          const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
          if (scrollDistance <= sign) {
            binding.value();
          }
        }
        selectWrap.addEventListener('scroll', scrollTableEvent);
        el.__scrollTableEvent__ = scrollTableEvent;
      },
      update() { },
      unbind(el, binding) {
        const selectWrap = el.querySelector('.el-table__body-wrapper');
        selectWrap.removeEventListener('scroll', el.__scrollTableEvent__);
        delete el.__scrollTableEvent__;
      }
    },
    loading: Loading.directive
  },
  components: {
    ElTable,
    ElTableColumn,
    render: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, opt) => {
        const params = {
          row: opt.props.row,
          index: opt.props.index
        };
        if (opt.props.column) params.column = opt.props.column;
        return opt.props.render(h, params);
      }
    }
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    rowKey: {
      type: String,
      default: () => 'id'
    },
    expandOnly: { // 是否设置唯一展开 默认展开唯一
      type: Boolean,
      default: ()=> true
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '数据加载中...'
    },
    border: {
      type: Boolean,
      default: true
    },
    config: {
      type: Object,
      default: () => {
        return {
          data: [],
          columns: [
            { label: '选项', type: 'selection' },
            { label: '名称', key: 'name' },
            { label: '编码', key: 'code' }
          ]
        };
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    height: {
      type: [Number, String]
    },
    rowStyle: {
      type: Function,
      default: () => {
        return { cursor: 'pointer' };
      }
    },
    loadMore: {
      type: Function,
      default: () => { }
    },
    // 是否初始化数据之后默认选择第一个
    initSeletTheFirst: {
      type: Boolean,
      default: () => false
    },
    // eslint-disable-next-line vue/require-default-prop
    rowClassName: {
      type: Function
    },
    // eslint-disable-next-line vue/require-default-prop
    cellClassName: {
      type: Function
    },
    indexMethod: {
      type: Function,
      default: (index) => {
        return index + 1;
      }
    },
    headerCellStyle: {
      type: Function,
      default: () => {
        return { background: '#EDF5FF' };
      }
    },

    // eslint-disable-next-line vue/require-default-prop
    size: {
      type: String,
      default: () => 'small'
    },

    // eslint-disable-next-line vue/require-default-prop
    width: [String, Number],

    // eslint-disable-next-line vue/require-default-prop
    maxHeight: [String, Number],

    // eslint-disable-next-line vue/require-default-prop
    stripe: Boolean,

    showHeader: {
      type: Boolean,
      default: () => true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: () => true
    },

    // eslint-disable-next-line vue/require-default-prop
    showSummary: Boolean,

    // eslint-disable-next-line vue/require-default-prop
    sumText: String,

    // eslint-disable-next-line vue/require-default-prop
    summaryMethod: Function,

    // eslint-disable-next-line vue/require-default-prop
    cellStyle: [Object, Function],

    // eslint-disable-next-line vue/require-default-prop
    headerRowClassName: [String, Function],

    // eslint-disable-next-line vue/require-default-prop
    headerRowStyle: [Object, Function],

    // eslint-disable-next-line vue/require-default-prop
    headerCellClassName: [String, Function],

    // eslint-disable-next-line vue/require-default-prop
    currentRowKey: [String, Number],

    // eslint-disable-next-line vue/require-default-prop
    emptyText: String,

    // eslint-disable-next-line vue/require-default-prop
    expandRowKeys: Array,

    defaultExpandAll: Boolean,

    // eslint-disable-next-line vue/require-default-prop
    defaultSort: Object,

    // eslint-disable-next-line vue/require-default-prop
    tooltipEffect: String,

    // eslint-disable-next-line vue/require-default-prop
    spanMethod: Function,

    selectOnIndeterminate: {
      type: Boolean,
      default: () => true
    }

  },
  data() {
    return {
      name: 'CubeTable',
      expandKeysArray: [],
      initConfig: {
        data: [],
        columns: []
      }
    };
  },
  watch: {
    config: {
      immediate: true,
      handler() {
        setTimeout(() => {
          const { config, initConfig } = this;
          this.initConfig = deepMerge(initConfig, config || {});
          if (this.initSeletTheFirst) {
            const row = this.initConfig.data[0];
            this.setCurrent(row);
          }
        }, 0);
      }
    },
    'config.data': {
      handler(data) {
        this.initConfig.data = data || [];
        if (this.initSeletTheFirst) {
          const row = this.initConfig.data[0];
          this.setCurrent(row);
        }
      }
    }
  },
  methods: {
    getCubeTbale() {
      return this.$refs[this.name] && this.$refs[this.name];
    },
    getTableSelection() {
      const TableSelection = this.$refs[this.name] && this.$refs[this.name].selection || [];
      return deepClone(TableSelection);
    },
    toggleRowSelection(row, selected) {
      this.$refs[this.name] && this.$refs[this.name].toggleRowSelection(row, selected);
    },
    setCurrent(row) {
      this.$refs[this.name] && this.$refs[this.name].setCurrentRow(row);
      this.tableRowClick(row);
    },
    // 这个东西需要配合 rowKey
    expandChange(row, expandedRows) {
      const that = this;
      const { expandOnly, rowKey } = this;
      if (expandOnly) {
        if (expandedRows.length) {
          that.expandKeysArray = [];
          if (row) {
            that.expandKeysArray.push(row[rowKey]);
          }
        } else {
          that.expandKeysArray = [];
        }
      }
      this.$emit('expandChange', row, expandedRows);
    },
    tableRowClick(row) {
      this.$emit('tableRowClick', row);
    },
    dbtableRowClick(row) {
      this.$emit('dbtableRowClick', row);
    }
  }
};
</script>
 