<template>
  <component :is="page" />
</template>
<script>
  import guide from './guide/guide';

  export default {
    name: 'App',
    components: {
      guide,
    },
    data() {
      return {
        page: '',
      };
    },
    created() {
      this.$router.add('guide', this.routing);
    },
    methods: {
      routing(info) {
        const view = info[0];
        switch (view) {
          case 'guide' :
            this.page = view;
            break;
          default: break;
        }
      },
    },
  };
</script>

<style>
  *{
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  a, a:link, a:visited, a:hover, a:active{
    text-decoration: none;
  }
</style>
