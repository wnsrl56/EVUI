<template>
  <div class="evui-alertlog">
    <div class="evui-alertlog-title-wrapper">
      <div class="evui-alertlog-title">
        <h4>Alert Log</h4>
      </div>
      <div class="evui-alertlog-button-area">
        <Button
          :type="'primary'"
          :text="'1-Day History'"
          :size="'small'"
          :disabled="true"
        />
      </div>
      <div class="evui-alertlog-toggle-area">
        <toggle
          v-model="toggleFlag"
          :toggle-type="'slide'"
          :toggle-shape="'circle'"
          :toggle-text="toggleText"
        />
      </div>
    </div>
    <div class="evui-alertlog-content">
      <alertlogchart
        v-show="toggleFlag"
        ref="alertlogchartRef"
        class="evui-alertlogchart"
      />
      <div
        v-show="!toggleFlag"
      >
        그리드
      </div>
    </div>
  </div>
</template>

<script>
  import '@/styles/evui.css';
  import alertlogchart from '@/components/alertlog';
  import toggle from '@/components/toggle';
  import Button from '@/components/button';

  export default {
    components: {
      alertlogchart,
      toggle,
      Button,
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
    methods: {
    },
  };
</script>

<style scoped>
  .evui-alertlog-title-wrapper {
    display: block;
  }
  .evui-alertlog-title {
    width: 250px;
    display: inline-block;
  }
  .evui-alertlog-button-area {
    display: inline-block;
  }
  .evui-alertlog-toggle-area {
    display: inline-block;
  }
</style>
