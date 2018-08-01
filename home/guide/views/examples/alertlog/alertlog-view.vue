<template>
  <div>
    <div class="article-title">
      <h2> Alert Log Chart </h2>
    </div>
    <br>
    <div
      v-for="item in componentList"
      :key="item.id"
    >
      <div class="inner-article">
        <h4># {{ item.title }}</h4>
        <code-view
          :code-url="item.url"
          :description="item.description"
        >
          <component :is="item.component"/>
        </code-view>
      </div>
      <br>
    </div>
  </div>
</template>

<script>
  import codeView from '@/components/codeview/code';
  import alertlogDefault from './alertlog-default';

  export default {
    components: {
      codeView,
    },
    data() {
      return {
        componentList: [
          {
            url: './guide/views/examples/alertlog/alertlog-default.vue',
            component: alertlogDefault,
            description: `Alert Log 메뉴 입니다.
            레벨(normal, warning, critical)에 따라 알람이 발생합니다.`,
            title: 'Default - Alert Log',
          },
        ],
      };
    },
  };
</script>
