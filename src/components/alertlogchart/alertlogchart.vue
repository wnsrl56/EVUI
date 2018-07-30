<template>
  <div
    ref="alertlogchartRef"
    class="evui-alertlogchart"
  />
</template>

<script>
  import Alarmchart from '@/components/alertlogchart/alertlogchart.core';

  export default {
    components: {
    },
    directives: {
      // 해당 element 외의 클릭 시
      'click-outside': {
        bind(el, binding) {
          const element = el;
          const bind = binding;
          // Define Handler and cache it on the element
          const bubble = bind.modifiers.bubble;
          const handler = (e) => {
            if (bubble || (!element.contains(e.target) && element !== e.target)) {
              bind.value(e);
            }
          };
          element.__vueClickOutside__ = handler;
          // add Event Listeners
          document.addEventListener('click', handler);
        },
        unbind(el) {
          const element = el;
          // Remove Event Listeners
          document.removeEventListener('click', element.__vueClickOutside__);
          element.__vueClickOutside__ = null;
        },
      },
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
      };
    },
    computed: {
    },
    created() {
    },
    mounted() {
      const mergeOption = this.$props.alertlogOptions;
      this.alertlogchart = new Alarmchart(this.$refs.alertlogchartRef, mergeOption);
    },
    beforeDestroy() {
    },
    methods: {
    },
  };
</script>

<style scoped>
  .evui-alertlogchart {
  }
</style>
