<template>
  <div
    :style="{height: boxHeight + 'px'}"
    class="guide-content-example"
  >
    <div class="guide-content-example-layer">
      <slot/>
    </div>
    <div
      ref="codeBox"
      class="guide-content-example-layer"
    >
      <codemirror
        :value="data"
        :options="{ mode: 'vue', lineNumbers: true, lineWrapping: true, readOnly: true }"
      />
    </div>
    <div
      class="guide-content-example-bar"
      @click.stop="onBottomClick"
    >
      <div
        :class="selectIconClasses"
        class="guide-content-example-bar-text"
      >
        <icon class="fa-sort-down"/>
        <span>{{ txtBottomBar }}</span>
      </div>
      <label
        :for="submitId"
        class="guide-content-example-jsfiddle"
      >Try it!</label>
    </div>
    <form
      :action="form.action"
      method="post"
      target="check"
      style="display:none"
    >
      <select name="panel_html">
        <option
          value="0"
          selected
        >HTML</option>
      </select>
      <select name="panel_js">
        <option
          value="0"
          selected
        >JavaScript</option>
      </select>
      <select name="panel_css">
        <option
          value="0"
          selected
        >CSS</option>
      </select>
      <textarea
        :value="form.html"
        name="html"
      />
      <textarea
        :value="form.js"
        name="js"
      />
      <textarea
        :value="form.css"
        name="css"
      />
      <input
        type="text"
        name="title"
        value="">
      <textarea name="description">descr</textarea>
      <textarea name="resources"/>
      <input
        type="text"
        name="dtd"
        value="html 5"
      >
      <input
        type="text"
        name="wrap"
        value="l"
      >
      <input
        :id="submitId"
        type="submit"
      >
    </form>
  </div>
</template>
<script>
  import icon from '@/components/icon/icon';
  import { codemirror } from 'vue-codemirror-lite';

  require('codemirror/mode/vue/vue');

  export default {
    components: {
      icon,
      codemirror,
    },
    props: {
      height: {
        type: Number,
        default: 100,
      },
      fileName: {
        type: String,
        default: '',
      },
      file: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        txtBottomBar: 'Expand',
        boxHeight: this.height,
        data: '',
        form: {
          action: 'http://jsfiddle.net/api/post/vue/2.2.1/',
          title: this.file,
          html: '',
          js: '',
          css: '',
          vue: 'https://unpkg.com/vue/dist/vue.js',
          evui: 'https://unpkg.com/evui@0.1.4/dist/evui.js',
          endScript: '<\/script>', // eslint-disable-line no-useless-escape
        },
        submitId: this.file + this._uid,
      };
    },
    computed: {
      selectIconClasses() {
        return [
          {
            'select-down': this.txtBottomBar !== 'Expand',
          },
        ];
      },
    },
    created() {
      this.$http.get(this.file)
        .then((result) => {
          this.data = result.data;
          if (this.data !== '') {
            const token = this.codeParser(this.data);
            this.form.html = `<script src="${this.form.vue}">${this.form.endScript}\n<script src="${this.form.evui}">${this.form.endScript}\n${token.template}`;
            this.form.js = token.script;
            this.form.css = token.style;
          }
        }, () => {});
    },
    mounted() {

    },
    methods: {
      codeParser(data = '') {
        let startTag;
        let endTag;
        let startIndex;
        let endIndex;

        const obj = {
          template: '',
          style: '',
          script: '',
        };

        const keyList = Object.keys(obj);

        for (let ix = 0, ixLen = keyList.length; ix < ixLen; ix++) {
          startTag = `<${keyList[ix]}>`;
          endTag = `</${keyList[ix]}>`;
          startIndex =
            keyList[ix] === 'style' ? data.lastIndexOf(startTag) : data.indexOf(startTag);
          if (startIndex > -1) {
            endIndex = data.lastIndexOf(endTag);
            obj[keyList[ix]] = data.substring(startIndex + startTag.length, endIndex).trim();
          }
        }

        return obj;
      },
      onClick() {

      },
      onBottomClick() {
        if (this.txtBottomBar === 'Expand') {
          this.txtBottomBar = 'Hide';

          this.boxHeight = this.$refs.codeBox.getBoundingClientRect().height + 40;
        } else {
          this.txtBottomBar = 'Expand';

          this.boxHeight = this.height;
        }
      },
    },
  };
</script>

<style>
  .CodeMirror{
    height: 100% !important;
  }

  .vue-codemirror-wrap{
    height: 100% !important;
  }

  .guide-content-example{
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 200px;
    border: 4px solid #1b1b3a;
    padding: 10px 10px 40px 10px;
    border-radius: 6px;
    box-shadow: 1px 1px 10px #000;
    overflow: hidden;
    transition: height 0.5s ease-in-out;
  }

  .guide-content-example-layer{
    float: left;
    width: 50%;
  }

  .guide-content-example + .guide-content-example{
    margin-top: 20px;
  }

  .guide-content-example-bar{
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 40px;
    padding: 6px;
    background-color: #222942;
    z-index: 10;
  }

  .guide-content-example-bar:hover{
    cursor: pointer;
    background-color: #151e3e;
  }

  .guide-content-example-bar-text{
    width: 100%;
    height: 100%;
    line-height: 28px;
    text-align: center;
  }

  .guide-content-example-bar-text i{
    display: inline-block;
    height: 100%;
    line-height: 18px;
    font-size: 24px;
    transition: all .2s ease-in-out;
  }

  .guide-content-example-bar-text.select-down i{
    transform: rotate(180deg);
  }

  .guide-content-example-bar-text span{
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }

  .guide-content-example-bar:hover .guide-content-example-jsfiddle,
  .guide-content-example-bar:hover .guide-content-example-bar-text span{
    opacity: 1;
  }

  .guide-content-example-jsfiddle{
    position: absolute;
    top: 10px;
    right: 30px;
    font-weight: bold;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
  .guide-content-example-jsfiddle:hover{
    color: #66afe8;
  }
</style>
