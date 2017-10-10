/**
 * Basic src
 */
import 'babel-polyfill';
import Vue from 'vue';

/**
 * Style libs
 */
import 'normalize.css';
import './grid/grid.styl';
import './grid/grid.js';

/**
 * Components styles
 */
import './components/app.styl';
import './components/header/header.styl';
import './components/main/login.styl';
import './components/main/dashboard.styl';
import './components/main/blockchart.styl';
import './components/main/snackbar.styl';
import './components/dialogs/dialogs.styl';

/**
 * App component
 */
import App from './components/App.vue';
//TODO replace to app.vue
import HeaderMenu from './components/header/Menu.vue';

Vue.config.debug = true;

/**
 * Call app component
 */
new Vue({
  el: '#app',
  render: h => h(App),
});
