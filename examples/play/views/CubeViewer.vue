<!--
 * @Author: shiliangL
 * @Date: 2021-05-12 10:30:43
 * @LastEditTime: 2021-05-18 20:26:35
 * @LastEditors: Do not edit
 * @Description: 
-->
<template>
  <div>
    <Cube-Search-Bar
      ref="SearchBar"
      :data="config"
      @search="search"
      @reset="reset"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: [
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
              url: '/company/getPageList'
            }
          },
          {
            value: null,
            initValue: ['2021-05-18', '2021-05-18'],
            initTimeString: true,
            type: 'daterange',
            key1: 'beginDate1',
            key2: 'endDate1',
            placeholder1: '开始日期',
            placeholder2: '结束日期'
          },
          { type: 'search', name: '查询', icon: 'el-icon-search' },
          { type: 'reset', name: '重置' }
        ],
        [
          {
            type: 'button', name: '参数收集', keyType: 'primary',
            plain: true, icon: 'el-icon-s-order', action: () => this.handlerClick('参数收集')
          }
        ]
      ]
    };
  },
  methods: {
    search(params) {
      console.log(params, 'search');
    },
    reset(params) {
      console.log(params, 'reset');
    }
  }
};
</script>

<style lang="scss" scoped>
</style>