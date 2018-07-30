<template>
  <div>
    1
  </div>
</template>

<script>
  import alarmchart from '@/components/alertlogchart/alertlogchart.core';

  export default {
    components: {
      alarmchart,
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
    },
    beforeDestroy() {
    },
    methods: {
    },
  };
</script>

<style scoped>
  .evui-datepicker {
    width: 235px;
  }
  .evui-datepicker-input {
    width: 235px;
    height: 32px;
    line-height: 32px;
  }
  .evui-datepicker-input-wrapper {
    width: 235px;
    height: 32px;
  }
  .evui-calendar-wrapper {
    position: absolute;
    width: 235px;
    height: 0px;
    overflow: hidden;
    transition: height .3s ease-in-out;
  }
  .evui-calendar-wrapper.expand {
    width: 470px;
  }
</style>
