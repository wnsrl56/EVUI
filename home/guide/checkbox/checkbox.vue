<template>
  <div>
    <checkbox
      :label="'On'"
      :checked="true"
      :value="'On'"
    />
    <checkbox
      :label="'Off'"
      :checked="false"
      :value="'Off'"
    />
    <checkbox
      :label="'Disable - On'"
      :checked="true"
      :disabled="true"
      :value="'Disable - On'"
    />
    <checkbox
      :label="'Disable - Off'"
      :checked="false"
      :disabled="true"
      :value="'Disable - Off'"
    />
  </div>
</template>

<script>
  import '@/styles/evui.css';
  import checkbox from '@/components/checkbox/checkbox';

  export default {
    components: {
      checkbox,
    },
  };
</script>
