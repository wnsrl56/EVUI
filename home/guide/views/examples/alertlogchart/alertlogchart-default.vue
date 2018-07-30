<template>
  <div>
    <alertlogchart/>
  </div>
</template>

<script>
  import '@/styles/evui.css';
  import alertlogchart from '@/components/alertlogchart';

  export default {
    components: {
      alertlogchart,
    },
    data() {
      return {
        bindDay: '2018-07-09',
      };
    },
    methods: {
    },
  };
</script>

<style scoped>
</style>
