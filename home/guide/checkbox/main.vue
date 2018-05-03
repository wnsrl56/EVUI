<template>
  <div>
    <result
      :height="200"
      :file="'./checkbox.vue'"
    >
      <checkbox/>
    </result>
    <result :file="'./checkbox.vue'">
      <checkbox/>
    </result>
  </div>
</template>

<script>
  import checkbox from './checkbox';
  import result from '../guide.content.code';

  export default {
    components: {
      checkbox,
      result,
    },
    data() {
      return {
        visible: true,
        label: 'test',
        valueData: null,
        buttonLabel: 'visible',
      };
    },
  };
</script>
