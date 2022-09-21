import "./modules/data";
import "./modules/app";
import Vue from "vue";
import Vuex from "vuex";
import { getStoreBuilder } from "vuex-typex";
//Data Stores
import Data from "./modules/data";
import App from "./modules/app";
Vue.use(Vuex);
const store = getStoreBuilder().vuexStore();
export const typedstore = { Data, App };
export default store;
//# sourceMappingURL=index.js.map