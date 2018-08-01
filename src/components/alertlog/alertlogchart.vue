<template>
  <div
    v-show="toggleFlag"
    ref="alertlogchartRef"
    class="evui-alertlogchart"
  />
</template>

<script>
  import Alertlogchart from '@/components/alertlog/alertlogchart.core';
  import toggle from '@/components/toggle';
  import Button from '@/components/button';

  export default {
    components: {
      toggle,
      Button,
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
    beforeDestroy() {
    },
    methods: {
    },
  };
</script>

<style scoped>
</style>
