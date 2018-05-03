<template>
  <div
    class="guide-main"
  >
    <guide-header/>
    <guide-nav/>
    <guide-content/>
  </div>
</template>
<script>
  import guideHeader from './guide.header';
  import guideNav from './guide.nav';
  import guideContent from './guide.content';

  export default {
    name: 'App',
    components: {
      guideHeader,
      guideNav,
      guideContent,
    },
    data() {
      return {
      };
    },
  };
</script>

<style>
  .guide-main{
    position: absolute;
    width: 100%;
    height: 100%;
    padding-top: 100px;
    padding-left: 240px;
    background-color: #2C2E3E;
    color: #deeede;
  }
</style>
