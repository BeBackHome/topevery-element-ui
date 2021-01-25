<!-- 选择组件 提供分页检索选择应数据量大列表卡顿以及分页接口数据选择 -->
<template>
  <el-cascader
    :clearable="true"
    v-model="selectValue"
    :disabled="disabled"
    :filterable="defaultConfig.filterable"
    :debounce="defaultConfig.debounce"
    :placeholder="placeholder2"
    :size="defaultConfig.size"
    :options="options"
    :props="{checkStrictly: defaultConfig.selectAny, emitPath:false, expandTrigger:'hover'}"
    :value="defaultConfig.keyCode"
    :label="defaultConfig.keyName"
    :children="defaultConfig.children"
    @change="change"
  />
</template>

<script>

import ElCascader from 'topevery-element-ui/packages/cascader';
// import request from 'topevery-element-ui/src/utils/request';
import { deepMerge, noEmptyChildren } from 'topevery-element-ui/src/utils/index.new.js';
import { isObject } from 'topevery-element-ui/src/utils/types';
import emitter from 'topevery-element-ui/src/mixins/emitter';

export default {
  name: 'CubeCascader',
  mixins: [emitter],
  props: {
    validateEvent: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    extraParam: {
      type: Object,
      default: () => {
        // return {
        //   treeId: 'aed26b5a-00e8-4c87-99a5-3345582239f9'
        // }
      }
    },
    config: {
      type: Object,
      default: () => { }
    },
    value: { // 编辑显示传入对象
      type: [Object, String],
      default: () => { }
    }
  },
  components: {
    ElCascader
  },
  data() {
    return {
      placeholder2: '请选择',
      loading: false,
      selectValue: '',
      options: [],
      // 默认参数
      defaultConfig: {
        placeholder: '请选择',
        filterable: true,
        debounce: 500,
        size: 'small',
        selectAny: false, // 是否可选任意一级
        isStaticOptions: false, // options 选项是否作为 静态使用
        options: [],
        keyCode: 'value', // 指定选项的值为选项对象的某个属性值
        keyName: 'label', // 指定选项标签为选项对象的某个属性值
        children: 'children', // 指定选项的子选项为选项对象的某个属性
        url: '',
        method: 'GET'
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
        const { isStaticOptions, options, children } = this.defaultConfig;
        if (isStaticOptions && Array.isArray(options)) {
          this.options = noEmptyChildren(children, options) || [];;;
        }
      }
    },
    'config.options': {
      handler(options) {
        const { isStaticOptions, children } = this.defaultConfig;
        if (Array.isArray(options) && isStaticOptions) {
          this.options = noEmptyChildren(children, options) || [];;
        }
      }
    },
    value: {
      immediate: true,
      handler(value) {
        if (value) {
          this.selectValue = value;
        } else {
          this.selectValue = '';
          this.placeholder2 = this.defaultConfig.placeholder;
        }
      }
    }
  },
  mounted() {
    const { isStaticOptions } = this.defaultConfig;
    if (!isStaticOptions) {
      this.fetchTableData();
    }
  },
  beforeDestroy() {
    this.selectValue = null;
  },
  methods: {
    focus() {
      this.$emit('focus');
    },
    blur() {
      this.$emit('blur');
    },
    clear() {
      this.selectValue = '';
      this.placeholder2 = this.defaultConfig.placeholder;
      this.$emit('input', '');
      this.$emit('change', '');
    },
    change(item) {
      this.$emit('input', item);
      this.$emit('change', item);
    },
    fetchTableData() {
      const { extraParam } = this;
      const { url, method, children, isStaticOptions } = this.defaultConfig;
      if (isStaticOptions) return;
      if (!url) return;
      this.options = [];
      const params = isObject(extraParam) ? { ...extraParam } : {};
      const paramsKey = method.toUpperCase() !== 'POST' ? 'params' : 'data';
      if (!this.$request) {
        console.error('请在vue原型链中注入$request请求方法');
        return;
      }
      this.$request({ url, method: method.toUpperCase(), [paramsKey]: params }).then((res) => {
        this.loading = false;
        const response = res.data;
        if (response.success) {
          const result = response.data;
          if (Array.isArray(result)) this.options = noEmptyChildren(children, result) || [];
        }
      }).catch(e => {
        this.loading = false;
      });
    }
  }
};
</script>
