import Vue from "vue";
import VueRouter from 'vue-router';
import store from "./store";
import App from "./app.vue";
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Notifications from 'vue-notification';
import router from './router';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
Vue.use(VueGoodTablePlugin);
Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(Notifications);
const v = new Vue({
    el: "#MinesExample",
    router: router,
    store,
    render: h => h(App)
});
export { v };
//# sourceMappingURL=index.js.map