<template>
  <div
    class="guide-nav"
  >
    <ul
      v-for="(category, index) in menu"
      :key="index"
      @click="onClick"
    >
      <div class="guide-nav-category-text">{{ category.text }}</div>
      <li
        v-for="(item, index) in category.children"
        :key="index"
        :data-component="item.component"
        class="guide-nav-list"
      ><icon
        v-if="item.icon"
        :cls="item.icon"/>{{ item.text }}</li>
    </ul>
  </div>
</template>
<script>
  import icon from '@/components/icon/icon';

  export default {
    components: {
      icon,
    },
    data() {
      return {
        pathName: '/guide/',
        beforeSelectedTarget: null,
        menu: [
          {
            text: 'Form',
            children: [
              { text: 'Checkbox', component: 'checkbox/checkbox', icon: 'fa-check-square' },
              // { text: 'Radiobox', component: 'radiobox', icon: 'fa-check-circle' },
              { text: 'Select', component: 'selectbox/selectbox', icon: 'fa-caret-down' },
              // { text: 'Button', component: 'button' },
            ],
          },
          {
            text: 'Layer',
            children: [
              // { text: 'Checkbox', component: 'checkbox' },
              // { text: 'Checkbox', component: 'checkbox' },
              // { text: 'Checkbox', component: 'checkbox' },
              // { text: 'Checkbox', component: 'checkbox' },
            ],
          },
          {
            text: 'Chart',
            children: [
              { text: 'Line', component: 'chart/line' },
            ],
          },
          {
            text: 'Table',
            children: [
              { text: 'Checkbox', component: 'checkbox' },
              { text: 'Checkbox', component: 'checkbox' },
              { text: 'Checkbox', component: 'checkbox' },
              { text: 'Checkbox', component: 'checkbox' },
            ],
          },
        ],
      };
    },
    created() {

    },
    methods: {
      onClick(e) {
        const target = e.target;
        if (target.tagName === 'LI') {
          if (target.classList.contains('selected')) {
            return;
          }

          target.classList.add('selected');

          if (this.beforeSelectedTarget) {
            this.beforeSelectedTarget.classList.remove('selected');
          }
          this.beforeSelectedTarget = target;

          // let path = this.$router.getFragment();
          this.$router.forward({
            path: this.$router.getFragment(),
            param: target.dataset.component,
          }, target.dataset.component, `/${this.pathName}${target.dataset.component}`);
        }
      },
    },
  };
</script>

<style>
  .guide-nav{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 240px;
    height: 100%;
    padding-top: 100px;
  }

  .guide-nav ul{
    transition: all .2s ease-in-out;
  }

  .guide-nav-category-text{
    width: 100%;
    height: 40px;
    text-indent: 10px;
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
    color: #93A6B6;
  }

  .guide-nav-list{
    width: 100%;
    height: 40px;
    text-indent: 40px;
    line-height: 40px;
    transition: background .1s ease-in;
    cursor: pointer;
  }

  .guide-nav-list i{
    position: absolute;
    line-height: 40px;
    font-size: 20px;
    left: -30px;
  }

  .guide-nav-list a{
    display: block;
    font-weight: bold;
    font-size: 16px;
    color: #cdd3da;
  }

  .guide-nav-list:hover{
    background-color: #55B9FF;
    /* Safari 4, Chrome 1-9, iOS 3.2-4.3, Android 2.1-3.0 */
    background-image: -webkit-gradient(linear, left top, right top, from(red), to(#f06d06));
    /* Safari 5.1, iOS 5.0-6.1, Chrome 10-25, Android 4.0-4.3 */
    background-image: -webkit-linear-gradient(left, #7084FF, #52C7FF);
    /* Firefox 3.6 - 15 */
    background-image: -moz-linear-gradient(left, #7084FF, #52C7FF);
    /* Opera 11.1 - 12 */
    background-image: -o-linear-gradient(left, #7084FF, #52C7FF);
    /* Opera 15+, Chrome 25+, IE 10+, Firefox 16+, Safari 6.1+, iOS 7+, Android 4.4+ */
    background-image: linear-gradient(to right, #7084FF, #52C7FF);
  }

  .guide-nav-list.selected{
    background-size: 400% 400%;
    background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
    -webkit-animation: Gradient 15s ease infinite;
    -moz-animation: Gradient 15s ease infinite;
    animation: Gradient 15s ease infinite;
  }

  .guide-nav-list:hover a{
    color: #fffeee;
  }

  @-webkit-keyframes Gradient {
    0% {
      background-position: 0% 50%
    }
    50% {
      background-position: 100% 50%
    }
    100% {
      background-position: 0% 50%
    }
  }

  @-moz-keyframes Gradient {
    0% {
      background-position: 0% 50%
    }
    50% {
      background-position: 100% 50%
    }
    100% {
      background-position: 0% 50%
    }
  }

  @keyframes Gradient {
    0% {
      background-position: 0% 50%
    }
    50% {
      background-position: 100% 50%
    }
    100% {
      background-position: 0% 50%
    }
  }

</style>
