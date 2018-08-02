<template>
  <div
    v-show="toggleFlag"
    ref="alertlogchartRef"
  />
</template>

<script>
  import Alertlogchart from '@/components/alertlog/alertlogchart.core';

  export default {
    components: {
    },
    props: {
      value: {
        type: String,
        default() {
          return null;
        },
      },
      alertlogOptions: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        toggleFlag: true,
        toggleText: {
          onText: 'GRAPH',
          offText: 'GRID',
          fontSize: 11,
        },
      };
    },
    computed: {
    },
    created() {
    },
    mounted() {
      const mergeOption = this.$props.alertlogOptions;
      this.alertlogchart = new Alertlogchart(this.$refs.alertlogchartRef, mergeOption);
    },
    methods: {
    },
  };
</script>

<style scoped>
  .evui-alertlog-tooltip {
    position: absolute;
    z-index: 100000;
    color: #000;
    border-radius: 4px;
    border: 1px solid #d8d8d8;
    background: #fff;
    overflow-y: auto;
    max-height: 500px;
    padding: 10px;
  }
</style>
