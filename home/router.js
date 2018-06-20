const Router = {
  routes: [],
  mode: 'history',
  root: '/',
  listen() {
    if (this.mode === 'history') {
      window.addEventListener('popstate', this.check.bind(this));
      // window.addEventListener('onpopstate', this.check.bind(this));
    } else {
      window.addEventListener('hashchange', this.check.bind(this));
    }
    window.addEventListener('DOMContentLoaded', this.check.bind(this));
  },
  config(options) {
    this.mode = options && options.mode && options.mode === 'history'
    && !!(history.pushState) ? 'history' : 'hash';
    this.root = options && options.root ? `/${this.clearSlashes(options.root)}/` : '/';
    return this;
  },
  getFragment() {
    let fragment;
    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  },
  clearSlashes(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  },
  add(r, h) {
    this.routes.push({ re: r, handler: h });
    return this;
  },
  remove(param) {
    let r;
    for (let i = 0; i < this.routes.length; i++) {
      r = this.routes[i];
      if (r.handler === param || r.re.toString() === param.toString()) {
        this.routes.splice(i, 1);
        return this;
      }
    }
    return this;
  },
  flush() {
    this.routes.length = 0;
    this.mode = null;
    this.root = '/';
    return this;
  },
  check(e, f) {
    const fragment = f || this.getFragment();
    for (let i = 0; i < this.routes.length; i++) {
      const match = fragment.match(this.routes[i].re);
      if (match) {
        this.routes[i].handler(match, this);
        return this;
      }
    }
    return this;
  },
  forward(state, title = '', url = '') {
    if (this.mode === 'history') {
      history.pushState(state, title, this.clearSlashes(url));
    } else {
      window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${url}`;
    }
    return this;
  },
};

export default Router;
