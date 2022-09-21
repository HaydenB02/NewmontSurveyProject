
import Vue from "vue";
import { RootState } from "../../store";
import { getStoreBuilder } from "vuex-typex";
import Data from "./data";

export interface AppState {
   data_url: string,
   isLoading: boolean,
   search: string,
   view: string,
   table: {
      page: number,
      page_size: number,
      sort: Array<any>,
      filters: {
         id: string,
         title: string,
         body: string,
         userId: string
      }
   }
}

const initialState: AppState = {
   //Can fetch local data or from the web
   //data_url: "https://jsonplaceholder.typicode.com/posts",
   data_url: "./posts.json",
   isLoading: false,
   search: "",
   view: "table",
   table: {
      page: 1,
      page_size: 5,
      sort: [],
      filters: {
         id: "",
         title: "",
         body: "",
         userId: ""
      }
   }
};

const b = getStoreBuilder<RootState>().module("app", initialState);

function loadSession(state: AppState) {
   //Load user-entered data url from local browser cache, if present
   if(localStorage.getItem('dataUrl')) state.data_url = localStorage.getItem('dataUrl');
}

function setIsLoading(state: AppState, payload: { isLoading: boolean }) {
   state.isLoading = payload.isLoading;
}

const stateGetter = b.state();

const App = {
   get state() { return stateGetter(); },

   commitLoadSession: b.commit(loadSession),
   commitSetIsLoading: b.commit(setIsLoading)
};

export default App;