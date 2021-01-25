<template>
  <div class="cube-search-bar">
    <template v-if="data && data.length">
      <!-- 左边组件类型 -->
      <template v-if="data && data[0] && data[0].length">
        <div
          v-for="(item, index) in data[0]"
          :key="index"
          class="left"
        >

          <!-- 其他类型 -->
          <template v-if="item.type === 'cubeMoreType'">
            <div class="cubeMoreType">
              <CubeMoreType
                v-model="item.value"
                :class="item.class ? item.class :'w180' "
                :config="item.config || {} "
              />
            </div>
          </template>

          <!-- 输入框 -->
          <template v-if="item.type === 'input'">
            <el-input
              v-model="item.value"
              :class="item.class ? item.class :'w180' "
              :size="size"
              :clearable="item.clearable"
              :placeholder="item.placeholder|| '请输入'"
              @keyup.enter.native="search"
            />
          </template>

          <!-- 下拉选择 -->
          <template v-else-if="item.type === 'option'">
            <el-select
              v-model="item.value"
              :class="item.class?item.class:'w90'"
              :size="size"
              :clearable="item.clearable"
              filterable
              :placeholder="item.placeholder|| '请选择'"
              :multiple="item.multiple"
              collapse-tags
              @change="item.change ?item.change($event): null"
            >
              <el-option
                v-for="sub in item.options"
                :key="sub.value"
                :label="sub.label"
                :value="sub.value"
                :class="item.class"
              />
            </el-select>
          </template>

          <!-- cubeSelectTree -->
          <template v-if="item.type === 'cubeSelectTree'">
            <CubeSelectTree
              :size="size"
              ref="selectTree"
              v-model="item.value"
              :extra-param="item.extraParam ? item.extraParam : {} "
              :config="item.config || {} "
            />
          </template>
          <!-- cubeSelect -->
          <template v-if="item.type === 'cubeSelect'">
            <CubeSelect
              ref="CubeSelect"
              :size="size"
              v-model="item.value"
              :extra-param="item.extraParam ? item.extraParam : {} "
              :config="item.config || {} "
            />
          </template>
          <!-- cubeCascader -->
          <template v-if="item.type === 'cubeCascader'">
            <CubeCascader
              :size="size"
              ref="CubeCascader"
              v-model="item.value"
              :extra-param="item.extraParam ? item.extraParam : {} "
              :config="item.config || {} "
            />
          </template>

          <!-- 日期选择 -->
          <template v-if="item.type === 'date'">
            <el-date-picker
              :class="item.class?item.class:'w140'"
              :picker-options="item.pickerOptions || datePickerOptions"
              v-model="item.value"
              :size="size"
              type="date"
              :value-format="item.format || 'yyyy-MM-dd'"
              :placeholder="item.placeholder|| '请选择'"
            />
          </template>

          <!-- 日期选择 -->
          <template v-if="item.type === 'month'">
            <el-date-picker
              :class="item.class?item.class:'w140'"
              :picker-options="item.pickerOptions"
              v-model="item.value"
              :size="size"
              type="month"
              :value-format="item.format || 'yyyy-MM'"
              :placeholder="item.placeholder|| '请选择'"
            />
          </template>

          <!-- daterange 日期范围-->
          <template v-if="item.type === 'daterange'">
            <el-date-picker
              v-model="item.value"
              :size="size"
              type="daterange"
              range-separator="至"
              :picker-options="item.pickerOptions||daterangePickerOptions"
              :class="item.class?item.class:'w300'"
              :value-format="item.format || 'yyyy-MM-dd'"
              :start-placeholder="item.placeholder1||'开始日期'"
              :end-placeholder="item.placeholder2||'结束日期'"
            />
          </template>

          <!-- datetimerange 日期时间范围 -->
          <template v-if="item.type === 'datetimerange'">
            <el-date-picker
              v-model="item.value"
              :size="size"
              type="datetimerange"
              range-separator="至"
              :picker-options="item.pickerOptions||{}"
              :class="item.class?item.class:'w320'"
              :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
              :start-placeholder="item.placeholder1"
              :end-placeholder="item.placeholder2"
            />
          </template>

          <!-- daterange 月份范围-->
          <template v-if="item.type === 'monthrange'">
            <el-date-picker
              v-model="item.value"
              :size="size"
              type="monthrange"
              range-separator="至"
              :picker-options="item.pickerOptions|| monthrangePickerOptions"
              :class="item.class?item.class:'w300'"
              :value-format="item.format || 'yyyy-MM'"
              :start-placeholder="item.placeholder1||'开始月份'"
              :end-placeholder="item.placeholder2||'结束结束'"
            />
          </template>

          <template v-else-if="item.type === 'search'">
            <el-button
              :type="item.buttonType ? item.buttonType : 'primary'"
              :icon="item.icon ? item.icon : 'el-icon-search'"
              :size="size"
              @click="search"
            >{{ item.name }}</el-button>
          </template>
          <template v-else-if="item.type === 'reset'">
            <el-button
              :type="item.buttonType ? item.buttonType : 'primary'"
              :icon="item.icon ? item.icon : 'el-icon-refresh'"
              plain
              :size="size"
              @click="clickReset"
            >{{ item.name }}</el-button>
          </template>
        </div>
      </template>
      <!-- 右边操作区域 -->
      <template v-if="data && data[1] && data[1].length">
        <div class="right">
          <div
            v-for="(item, index) in data[1]"
            :key="index"
            class="left"
          >
            <template v-if="item.type === 'add'">
              <el-button
                :size="size"
                type="success"
                icon="el-icon-plus"
                @click.stop="item.action ? item.action() :clickAdd(item)"
              >{{ item.name ? item.name : '新增' }}</el-button>
            </template>

            <template v-if="item.type === 'del'">
              <el-button
                :size="size"
                type="danger"
                icon="el-icon-delete"
                @click.stop="item.action ? item.action() :clickDel(item)"
              >删除</el-button>
            </template>

            <template v-if="item.type === 'button'">
              <el-button
                :size="size"
                :icon="item.icon"
                :plain="item.plain"
                v-if="item.ifShow ? item.ifShow(): true"
                :type="item.btType"
                @click="item.click ? item.click($event) : null"
                @click.stop="item.action ? item.action() :clickBtn(item)"
              >{{ item.name }}</el-button>
            </template>

            <template v-else-if="item.type === 'more'">
              <el-dropdown
                trigger="click"
                @command="command"
              >
                <el-button
                  type="primary"
                  :size="size"
                  plain
                >{{ item.name || '更多操作' }}<i class="el-icon-arrow-down el-icon--right" /></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(itemK,i) in item.options"
                    :key="i"
                    :icon="itemK.icon"
                    :command="itemK.label"
                    @click.native="itemK.action ? itemK.action() : null"
                  >{{ itemK.label }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>

//  常量类型
const commonlyTypes = ['input', 'select', 'option', 'cascader', 'cubeCascader', 'date', 'datetime', 'date-month', 'cubeMoreType'];

const timeRangeTime = ['daterange', 'datetimerange', 'monthrange'];
//  特殊类型
const cubeType = ['cubeSelect', 'cubeSelectTree'];

import { deepClone } from 'utils/index.new.js';
import ElButton from 'topevery-element-ui/packages/button';
import ElInput from 'topevery-element-ui/packages/input';
import ElSelect from 'topevery-element-ui/packages/select';
import ElOption from 'topevery-element-ui/packages/option';
import ElDropdown from 'topevery-element-ui/packages/dropdown';
import ElDropdownItem from 'topevery-element-ui/packages/dropdown-item';
import ElDropdownMenu from 'topevery-element-ui/packages/dropdown-menu';
import DatePicker from 'topevery-element-ui/packages/date-picker';
import CubeMoreType from 'topevery-element-ui/packages/cube-more-type';

import CubeSelect from 'topevery-element-ui/packages/cube-select';
import CubeSelectTree from 'topevery-element-ui/packages/cube-select-tree';
import CubeCascader from 'topevery-element-ui/packages/cube-cascader';

export default {
  name: 'CubeSearchBar',
  componentName: 'CubeSearchBar',
  components: {
    CubeMoreType,
    ElButton,
    ElInput,
    ElSelect,
    ElOption,
    DatePicker,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,

    CubeSelect,
    CubeCascader,
    CubeSelectTree
  },
  props: {
    size: {
      type: String,
      default: () => 'small'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      daterangePickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      monthrangePickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  created() {
    this.initParam();
  },
  methods: {
    initParam() {
      if (this.data.length > 0 && this.data[0] && this.data[0].length > 0) {
        const items = this.data[0];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item['initValue']) {
            item['value'] = item['initValue'];
          }
        }
      }
    },
    clickReset() {
      if (this.data.length > 0 && this.data[0] && this.data[0].length > 0) {
        const items = this.data[0];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item['type'] === 'search') {
            break;
          } else if (item['initValue']) {
            item['value'] = item['initValue'];
          } else {
            item['value'] = null;
          }
        }
      }
      this.$emit('reset', this.getSearchParams());
    },
    search() {
      const params = this.getSearchParams();
      this.$emit('search', params);
    },
    getSearchParams() {
      // 获取选择参数
      const params = {};
      if (this.data.length > 0 && this.data[0] && this.data[0].length > 0) {
        const items = this.data[0];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (commonlyTypes.indexOf(item['type']) !== -1) {
            params[item['key']] = item.multiple ? item.value ? item.value.toString() : item.value : item.value;
          } else if (timeRangeTime.includes(item['type'])) {
            if (item.value) {
              params[item['key1']] = item.value[0] ? item.value[0] : '';
              params[item['key2']] = item.value[1] ? item.value[1] : '';
            } else {
              params[item['key1']] = null;
              params[item['key2']] = null;
            }
          } else if (cubeType.includes(item['type'])) {
            // 处理cube选择组件
            if (item.config && item.config.keyCode) {
              params[item['key']] = item.value ? item.value[item.config.keyCode] ? item.value[item.config.keyCode] : '' : '';
            }
          } else if (item['type'] === 'search') {
            break;
          }
        }
      }
      return deepClone(params);
    },
    clickAdd() {
      this.$emit('add');
    },
    clickDel() {
      this.$emit('del');
    },
    clickBtn(item) {
      this.$emit('button', item);
      this.$emit('clickBtn', item);
    },
    command(command) {
      this.$emit('command', command);
    },
    dateTimePicker(minDate, maxDate) {
      if (minDate && maxDate) {
        return {
          disabledDate: time => (time.getTime() > new Date(maxDate).getTime() || time.getTime() < new Date(minDate).getTime())
        };
      }
      if (maxDate) {
        return {
          disabledDate: time => (maxDate ? time.getTime() > new Date(maxDate).getTime() : false)
        };
      }
      if (minDate) {
        return {
          disabledDate: time => (minDate ? time.getTime() < new Date(minDate).getTime() : false)
        };
      }
      return {
        disabledDate: false
      };
    }
  }
};
</script>

