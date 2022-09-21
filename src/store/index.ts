import "./modules/data"
import "./modules/app"

import Vue from "vue";
import Vuex, { Store } from "vuex";
import { getStoreBuilder } from "vuex-typex";

//Data Stores
import Data, { DataState } from "./modules/data";
import App, { AppState } from "./modules/app";

export interface RootState {
   App: AppState,
   Data: DataState
}

Vue.use(Vuex);
const store: Store<RootState> = getStoreBuilder<RootState>().vuexStore();

export const typedstore = {  Data, App };

export default store;