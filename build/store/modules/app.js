import { getStoreBuilder } from "vuex-typex";
const initialState = {
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
const b = getStoreBuilder().module("app", initialState);
function loadSession(state) {
    //Load user-entered data url from local browser cache, if present
    if (localStorage.getItem('dataUrl'))
        state.data_url = localStorage.getItem('dataUrl');
}
function setIsLoading(state, payload) {
    state.isLoading = payload.isLoading;
}
const stateGetter = b.state();
const App = {
    get state() { return stateGetter(); },
    commitLoadSession: b.commit(loadSession),
    commitSetIsLoading: b.commit(setIsLoading)
};
export default App;
//# sourceMappingURL=app.js.map