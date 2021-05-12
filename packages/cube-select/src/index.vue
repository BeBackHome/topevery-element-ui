<!--
 * @Author: shiliangL
 * @Date: 2021-03-10 17:10:45
 * @LastEditTime: 2021-05-12 13:09:30
 * @LastEditors: Do not edit
 * @Description: 选择组件 提供分页检索选择应数据量大列表卡顿以及分页接口数据选择
-->
<template>
  <span class="cube-select">
    <el-popover
      ref="cube-popover"
      popper-class="cube-select2x"
      class="popover"
      :width="defaultConfig.popoverWidth"
      trigger="click"
      placement="bottom-start"
      :visible-arrow="false"
      @hide="hidePopover"
    >
      <el-input
        slot="reference"
        v-model.trim="selectValue"
        :style="{width: defaultConfig.inputWidth? defaultConfig.inputWidth : '' }"
        :placeholder="placeholder2"
        :size="defaultConfig.size"
        :disabled="disabled"
        :filterable="defaultConfig.filterable"
        :clearable="defaultConfig.clearable"
        @focus="focus"
        @blur="blur"
        @clear="clear"
        @input="input"
      />

      <div
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(242, 248, 254, 0.9)"
        style="text-align: right; margin: 0"
      >
        <el-table
          ref="tablePage"
          :data="defaultConfig.isStaticOptions ? filterTableData : tableData"
          style="width: 100%"
          size="mini"
          :height="defaultConfig.tableHeight"
          highlight-current-row
          :row-style="rowStyle"
          element-loading-text="数据加载中..."
          :show-header="defaultConfig.showHeader"
          @row-click="rowClick"
        >
          <el-table-column
            v-if="defaultConfig.showIndex"
            label="序号"
            type="index"
            :index="indexMethod"
          />
          <el-table-column
            v-for="(item,index) in defaultConfig.column"
            :key="index"
            show-overflow-tooltip
            :width="item.width ? item.width : null "
            :header-align="defaultConfig.headerAlign"
            :align="item.align ? item.align : 'center' "
            :prop="item.prop"
            :label="item.label"
          >
            <template slot-scope="scope">
              <template v-if="!item.render">
                <template>
                  <span :title="scope.row[item.key]">{{ scope.row[item.key] }}</span>
                </template>
              </template>
              <template v-else>
                <render
                  :column="item"
                  :index="index"
                  :render="item.render"
                  :row="scope.row"
                />
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="!defaultConfig.isNoPage"
          small
          :pager-count="5"
          class="pagination"
          layout="total,prev, pager, next"
          :current-page="defaultConfig.pagination.currentPage"
          :page-size="defaultConfig.pagination.size"
          :total="defaultConfig.pagination.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-popover>
  </span>
</template>

<script>
import Clickoutside from 'topevery-element-ui/src/utils/clickoutside';
import debounce from 'throttle-debounce/debounce';
// import request from 'topevery-element-ui/src/utils/request';
import { deepMerge } from 'topevery-element-ui/src/utils/index.new';
import { isObject, isArray } from 'topevery-element-ui/src/utils/types';
import emitter from 'topevery-element-ui/src/mixins/emitter';

import ElInput from 'topevery-element-ui/packages/input';
import ElPopover from 'topevery-element-ui/packages/popover';
import ElTable from 'topevery-element-ui/packages/table';
import ElTableColumn from 'topevery-element-ui/packages/table-column';
import ElPagination from 'topevery-element-ui/packages/pagination';
// import Loading from 'topevery-element-ui/packages/loading';

export default {
  name: 'CubeSelect',
  components: {
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
    },
    ElInput,
    ElPopover,
    ElTable,
    ElTableColumn,
    ElPagination
  },
  directives: {
    Clickoutside
  },
  mixins: [emitter],
  props: {
    validateEvent: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    extraParam: {
      type: Object,
      default: () => { }
    },
    config: {
      type: Object,
      default: () => { }
    },
    value: { // 编辑显示传入对象
      type: [Object, String],
      // { key: 'name', label: '名称' },
      default: () => { }
    }
  },
  data() {
    return {
      placeholder2: '请选择',
      recordSelect: null,
      visible: false,
      loading: false,
      isInputSearch: 0, // 是否是输入后检索
      selectValue: '',
      tableData: [],
      filterTableData: [], // 静态选项表格
      // 默认参数
      defaultConfig: {
        keyName: 'label', // 显示选择名称
        keyCode: 'value', // 选择关键key
        otherProps: [], // 除了需要返回 keyName 、 keyCode 之外的其他数据
        placeholder: '请选择',
        clearable: true,
        popoverWidth: 320, // 弹层宽度
        inputWidth: '220px', // 输入框宽度
        size: 'small',
        // 表格区域
        isNoPage: false, // 是否是分页 默认是分页
        tableHeight: 250,
        headerAlign: 'center',
        showHeader: true, // 是否显示表头
        showIndex: true, // 是否显序号
        column: [
          { key: 'name', label: '名称' },
          { key: 'code', label: '编码' }
        ],
        relativeKey: '', // 关联依赖加载 如果不穿则不会加载
        isStaticOptions: false, // options 选项是否作为 静态使用
        options: [],
        // 请求额外设置参数 -  网络数据加载区域
        searchName: 'name',
        method: 'POST',
        url: '',
        focusOnload: true,
        pagination: {
          size: 10, // 分页每页默认显示10条
          currentPage: 1, // 当前默认第一页
          total: 0 // 总条数
        }
      }
    };
  },
  watch: {
    config: {
      immediate: true,
      handler(configData) {
        this.defaultConfig = deepMerge(this.defaultConfig, configData || {});
        this.placeholder2 = this.defaultConfig.placeholder;
        // 如果是 静态选项
        const { isStaticOptions, options } = this.defaultConfig;
        if (isStaticOptions && isArray(options)) {
          this.filterTableData = options;
          this.staticTableData = JSON.parse(JSON.stringify(options)); // 模拟前端检索使用
        }
      }
    },
    'config.options': {
      handler(options) {
        const { isStaticOptions } = this.defaultConfig;
        if (isStaticOptions && isArray(options)) {
          this.filterTableData = options;
          this.staticTableData = JSON.parse(JSON.stringify(options)); // 模拟前端检索使用
        }
      }
    },
    value: {
      immediate: true,
      handler(value, valueOld) {
        if (value && isObject(value)) {
          const { keyName } = this.defaultConfig;
          this.recordSelect = value;
          this.selectValue = value[keyName];
          // if (this.validateEvent) {
          //   this.dispatch('ElFormItem', 'el.form.change', [value])
          // }
        } else {
          this.selectValue = '';
          this.recordSelect = null;
          this.placeholder2 = this.defaultConfig.placeholder;
        }
      }
    }
    // extraParam: {
    //   deep: true,
    //   handler(value, valueOld) {
    //     if (value && isObject(value)) {
    //       this.fetchTableData();
    //     }
    //   }
    // }
  },
  beforeDestroy() {
    this.recordSelect = null;
  },
  mounted() {
    this.inputChange = debounce(800, (name) => this.fetchTableData());
  },
  methods: {
    focus() {
      this.visible = true;
      const { recordSelect } = this;
      const { focusOnload, keyName } = this.defaultConfig;
      // 获取焦点的时候 如果已经选择的东西 隐藏
      if (recordSelect) {
        this.selectValue = '';
        this.placeholder2 = recordSelect[keyName];
      }
      // 获取焦点就加载如果关闭则只会加载请求一次
      if (focusOnload) {
        this.fetchTableData();
      } else {
        if (!this.tableData.length) {
          this.fetchTableData();
        }
      }
      // if (this.validateEvent) {
      //   this.dispatch('ElFormItem', 'el.form.blur', [this.value])
      // }
      this.$emit('focus');
      this.$emit('visibleChange', true);

      const { isStaticOptions } = this.defaultConfig;
      if (isStaticOptions) {
        this.doFilterTable('');
      }
      setTimeout(_ => {
        this.setTableCurrentRow();
      }, 0);
    },
    blur() {
      this.miss();
      this.$emit('blur');
    },
    clear() {
      this.selectValue = null;
      this.recordSelect = null;
      this.placeholder2 = this.defaultConfig.placeholder;
      this.$emit('input', null);
      this.$emit('change', null);
      this.$emit('clear');
    },
    miss() {
      this.visible = false;
      const { isInputSearch } = this;
      if (!isInputSearch) {
        this.selectValue = '';
        const { recordSelect } = this;
        const { keyName } = this.defaultConfig;
        if (recordSelect) {
          this.selectValue = recordSelect[keyName];
          this.placeholder2 = this.defaultConfig.placeholder;
        }
      }
    },
    handleCurrentChange(value) {
      this.defaultConfig.pagination.currentPage = value;
      this.fetchTableData();
    },
    rowStyle() {
      return { cursor: 'pointer' };
    },
    indexMethod(index) {
      return (index + 1) + (this.defaultConfig.pagination.currentPage - 1) * (this.defaultConfig.pagination.size);
    },
    setTableCurrentRow() {
      const { recordSelect } = this;
      if (!recordSelect) return;
      const { keyCode, isStaticOptions } = this.defaultConfig;
      const currentRow = !isStaticOptions ? this.tableData.find((item) => item[keyCode] === recordSelect[keyCode]) || null : this.filterTableData.find((item) => item[keyCode] === recordSelect[keyCode]) || null;
      this.$refs['tablePage'] && this.$refs['tablePage'].setCurrentRow(currentRow);
    },
    hidePopover() {
      this.isInputSearch = 0;
      this.$emit('visibleChange', false);
    },
    rowClick(row) {
      this.isInputSearch = 0;
      const { copySelectValue } = this;
      const { keyName, keyCode, otherProps } = this.defaultConfig;
      const isChange = copySelectValue === row[keyName];
      this.selectValue = row[keyName];
      this.copySelectValue = row[keyName];
      this.recordSelect = row;
      const params = {};
      if (Array.isArray(otherProps) && otherProps.length) {
        for (const item of otherProps) {
          params[item] = row[item];
        }
      }
      this.visible = false;
      const paramsList = { [keyCode]: row[keyCode], [keyName]: row[keyName], ...params };
      this.$emit('input', paramsList);
      if (!isChange) this.$emit('change', row);
      // nice
      this.$refs['cube-popover'] && this.$refs['cube-popover'].doToggle();
    },
    input(e) {
      const { isStaticOptions } = this.defaultConfig;
      if (!isStaticOptions) {
        this.isInputSearch = 1;
        this.defaultConfig.pagination.currentPage = 1;
        this.inputChange();
      } else {
        this.doFilterTable(e);
      }
    },
    doFilterTable(selectValue) {
      const { staticTableData } = this;
      if (selectValue) {
        this.filterTableData = staticTableData.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return String(dataNews[key]).toLowerCase().indexOf(selectValue) > -1;
          });
        });
      } else {
        this.filterTableData = staticTableData;
      }
    },
    fetchTableData() {
      const { extraParam, selectValue, isInputSearch } = this;
      const { url, method, searchName, isNoPage, isStaticOptions, relativeKey } = this.defaultConfig;
      if (relativeKey) {
        if (!extraParam[relativeKey]) return; // 不传递关联key 不需要加载
      }
      if (isStaticOptions) return; // 作为静态数据 不需要加载
      if (!url) false;
      const { currentPage, size } = this.defaultConfig.pagination;
      this.tableData = [];
      this.loading = true;
      const searchParams = { [searchName]: isInputSearch ? selectValue : '' };
      const extraParams = isObject(extraParam) ? Object.keys(extraParam).length ? { ...extraParam } : {} : {};
      const searchParams2extraParams = Object.assign(searchParams, extraParams);
      const pageParams = { pageIndex: currentPage, pageSize: size };
      const params = isNoPage ? { ...searchParams2extraParams } : { ...pageParams, ...searchParams2extraParams };
      const paramsKey = method.toUpperCase() !== 'POST' ? 'params' : 'data';
      if (!this.$request) {
        // eslint-disable-next-line no-console
        console.error('请在vue原型链中注入$request请求方法');
        return;
      }
      this.$request({ url, method: method.toUpperCase(), [paramsKey]: params }).then((res) => {
        this.loading = false;
        const response = res.data;
        const { data, success } = response;
        if (success) {
          const result = data;
          if (isNoPage) {
            this.tableData = result || [];
          } else {
            if (Array.isArray(result.records)) {
              this.tableData = result.records || [];
              this.defaultConfig.pagination.total = result.total || 0;
            }
          }
          setTimeout(_ => {
            this.setTableCurrentRow();
          }, 0);
        }
      }).catch(e => {
        // this.message({ message: '请勾选您需要处理的数据', type: 'error' })
        this.loading = false;
      });
    }
  }
};
</script>
