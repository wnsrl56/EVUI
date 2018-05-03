import Axios from 'axios';
import Vue from 'vue';
import App from './app';
import EVUI from '../src/index';
import Router from './router';

Vue.use(EVUI);
Vue.config.debug = true;
Vue.prototype.$http = Axios;
Vue.prototype.$router = Router;

Router.listen();

const app = new Vue({
  el: '#app',
  render: h => h(App),
});

export default app;
