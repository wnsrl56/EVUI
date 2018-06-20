<template>
  <component
    :is="content"
    class="guide-content"
  />
</template>
<script>
  import checkbox from './checkbox/main';
  import chart from './chart/main';

  export default {
    components: {
      checkbox,
      chart,
    },
    data() {
      return {
        data: '',
        content: '',
      };
    },
    created() {
      const frag = this.$router.getFragment();

      this.content = frag.split('/')[1];
      // this.$http.get(`${filePath}${this.content}.vue`)
      //   .then((result) => {
      //     this.data = result.data;
      //   }, () => {});
    },
  };
</script>

<style>
  .guide-content{
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #363F58;
    overflow: auto;
  }
  .CodeMirror{
    height: 100% !important;
  }
</style>
