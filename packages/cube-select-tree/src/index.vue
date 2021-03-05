<!-- 选择组件 提供分页检索选择应数据量大列表卡顿以及分页接口数据选择 -->
<template>
  <span
    v-clickoutside="miss"
    class="cube-select-tree"
    :style="{width: defaultConfig.inputWidth ? defaultConfig.inputWidth : 'auto' }"
  >
    <el-input
      ref="input"
      v-model.trim="selectValue"
      filterable
      :disabled="disabled"
      :size="defaultConfig.size"
      :placeholder="placeholder2"
      :clearable="defaultConfig.clearable"
      @focus="focus"
      @clear="clear"
      @input="input"
    >
      <!-- @blur="blur" -->
      <div
        v-if="defaultConfig.tipButtonVisible"
        slot="append"
        @click.stop="focus"
        v-text="defaultConfig.tipButtonText"
      />
    </el-input>
    <transition name="el-zoom-in-center">
      <el-popover
        v-model="visible"
        class="popover"
        placement="bottom"
        :width="defaultConfig.popoverWidth"
        @hide="hidePopover"
      >
        <div style="text-align: right; margin: 0">
          <el-tree
            ref="tree"
            highlight-current
            :default-expand-all="true"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :node-key="defaultConfig.keyCode"
            :data="options"
            :props="defaultConfig.treeDefaultProps"
            @node-click="handleNodeClick"
          />
        </div>
        <div
          v-if="loading"
          v-loading="loading"
          class="loadingMark"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(242, 248, 254, 0.9)"
        />
      </el-popover>
    </transition>
  </span>

</template>

<script>

import debounce from 'throttle-debounce/debounce';
// import request from 'topevery-element-ui/src/utils/request';
import { deepMerge } from 'topevery-element-ui/src/utils/index.new';
import { isObject } from 'topevery-element-ui/src/utils/types';
import emitter from 'topevery-element-ui/src/mixins/emitter';
import Clickoutside from 'topevery-element-ui/src/utils/clickoutside';

import ElInput from 'topevery-element-ui/packages/input';
import ElPopover from 'topevery-element-ui/packages/popover';
import ElTree from 'topevery-element-ui/packages/tree';
import Loading from 'topevery-element-ui/packages/loading';
import CuebScrollTo from 'topevery-element-ui/packages/cube-scroll-to';

export default {
  name: 'CubeSelectTree',
  directives: {
    Clickoutside,
    loading: Loading.directive
  },
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
      default: () => { }
    },
    config: {
      type: Object,
      default: () => { }
    },
    value: { // 编辑显示传入对象
      type: [Object, String],
      // { label: '显示名称',value: '选择value'}
      default: () => { }
    }
  },
  components: {
    ElInput,
    ElPopover,
    ElTree
  },
  data() {
    return {
      placeholder2: '请选择',
      recordSelect: null,
      visible: false,
      loading: false,
      selectValue: '',
      options: [],
      // 默认参数
      defaultConfig: {
        // 显示输入区域
        keyName: 'label', // 显示选择名称
        keyCode: 'value', // 选择关键key
        placeholder: '请选择',
        clearable: true,
        tipButtonVisible: false,
        tipButtonText: '选择',
        popoverWidth: 320, // 弹层宽度
        inputWidth: '220px', // 输入框宽度
        size: 'small',
        isStaticOptions: false, // options 选项是否作为 静态使用
        initSeletTheFirstAfterLoad: false, // 是否加载完成默认选择第一个
        options: [],
        // 树区域
        selectAny: false,
        treeDefaultProps: {
          children: 'children',
          label: 'label'
        },
        // 请求额外设置参数 -  网络数据加载区域
        method: 'POST',
        url: '',
        focusOnload: true,
        // 选择返回值设置
        otherProps: []
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
        if (isStaticOptions) {
          this.options = options;
        }
      }
    },
    'config.options': {
      handler(options) {
        const { isStaticOptions } = this.defaultConfig;
        if (Array.isArray(options) && isStaticOptions) this.options = options || [];
      }
    },
    value: {
      immediate: true,
      handler(value) {
        // 存在 一定是对象 不然显示很多问题
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
          this.$refs['tree'] && this.$refs['tree'].setCurrentKey(null);
        }
      }
    }
  },
  mounted() {
    this.inputChange = debounce(800, (name) => this.$refs.tree.filter(name));
  },
  beforeDestroy() {
    this.recordSelect = null;
  },
  created() {
    const { focusOnload } = this.defaultConfig;
    if (!focusOnload) {
      this.fetchTableData();
    }
  },
  methods: {
    setScroll2Target() {
      setTimeout(_ => {
        const { recordSelect } = this;
        const { keyCode } = this.defaultConfig;
        if (recordSelect) {
          const targetKey = recordSelect[keyCode];
          this.$refs['tree'] && this.$refs['tree'].setCurrentKey(targetKey);
          if (this.$el.querySelector('.el-popover')) {
            setTimeout(_ => {
              const targetContainer = this.$el.querySelector('.el-popover');
              const el = this.$el.querySelector('.is-current');
              if (!el) return;
              const options = {
                container: targetContainer,
                easing: 'ease-in',
                force: true,
                cancelable: true,
                x: false,
                y: true
              };
              CuebScrollTo.scrollTo(el, 220, options);
            }, 20);
          }
        }
      }, 200);
    },
    focus() {
      const { recordSelect } = this;
      const { focusOnload, keyName } = this.defaultConfig;
      this.visible = true;
      // 获取焦点的时候 如果已经选择的东西 隐藏
      if (recordSelect) {
        this.selectValue = '';
        this.placeholder2 = recordSelect[keyName];
        // 显示到选取区域
        this.setScroll2Target();
      }
      // 获取焦点就加载如果关闭则只会加载请求一次
      if (focusOnload) {
        this.fetchTableData();
      }
      this.$emit('focus');
    },
    blur() {
      this.$emit('blur');
      this.$refs.tree.filter('');
    },
    clear() {
      this.selectValue = null;
      this.recordSelect = null;
      this.placeholder2 = this.defaultConfig.placeholder;
      this.$emit('input', null);
      this.$emit('change', null);
    },
    miss() {
      this.visible = false;
      this.$refs.tree.filter('');
      const { recordSelect } = this;
      const { keyName } = this.defaultConfig;
      if (recordSelect) {
        this.selectValue = recordSelect[keyName];
        this.placeholder2 = this.defaultConfig.placeholder;
      }
      this.$refs['input'] && this.$refs['input'].blur && this.$refs['input'].blur();
    },
    hidePopover() {
      this.$emit('hidePopover');
    },
    handleNodeClick(row) {
      const { selectAny, keyName, keyCode, otherProps } = this.defaultConfig;
      // 可设置返回对象内容
      const otherPropsParams = {};
      if (Array.isArray(otherProps) && otherProps.length) {
        for (const item of otherProps) {
          otherPropsParams[item] = row[item];
        }
      }
      const params = { [keyCode]: row[keyCode], [keyName]: row[keyName], ...otherPropsParams };
      if (selectAny) {
        // 选择最后任意
        this.visible = false;
        this.selectValue = row[keyName];
        this.recordSelect = row;
        this.$emit('input', params);
        this.$emit('change', row);
      } else {
        // 选择最后一级-没有children、或者 !children.length
        if (!row.children || !row.children.length) {
          this.selectValue = row[keyName];
          this.recordSelect = row;
          this.$emit('input', params);
          this.$emit('change', row);
          this.visible = false;
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    input(name) {
      this.inputChange(name);
    },
    noChildren(childrenList = [], name = 'children') {
      const findNoChildren = function(childrenList) {
        if (!childrenList.length) return;
        const element = childrenList[0];
        if (element[name] && Array.isArray(element[name]) && element[name].length) {
          return findNoChildren(element[name]);
        } else {
          return element;
        }
      };
      return findNoChildren(childrenList);
    },
    fetchTableData() {
      const { extraParam } = this;
      const { url, method, focusOnload, isStaticOptions } = this.defaultConfig;
      if (isStaticOptions) return;
      if (!url) false;
      this.loading = true;
      this.options = [];
      // const params = Object.keys(extraParam).length ? { ...extraParam } : null
      const params = isObject(extraParam) ? { ...extraParam } : {};
      const paramsKey = method.toUpperCase() !== 'POST' ? 'params' : 'data';
      if (!this.$request) {
        console.error('请在vue原型链中注入$request请求方法');
        return;
      }
      this.$request({ url, method: method, [paramsKey]: params }).then((res) => {
        this.loading = false;
        const response = res.data;
        if (response.success) {
          const result = response.data;
          if (Array.isArray(result)) {
            this.options = result || [];
            if (focusOnload) {
              if (Array.isArray(result) && result.length) {
                const { initSeletTheFirstAfterLoad, selectAny } = this.defaultConfig;
                // 是否默认选择第一个
                if (initSeletTheFirstAfterLoad && selectAny && !this.initSeletTheFirstAfterLoadTag) {
                  this.initSeletTheFirstAfterLoadTag = true;
                  const item = result[0];
                  if (item) this.handleNodeClick(item);
                }
              }
              // 显示到选取区域
              setTimeout(_ => {
                this.setScroll2Target();
              }, 20);
            }
          }
        }
      }).catch(e => {
        this.loading = false;
      });
    }
  }
};
</script>
 