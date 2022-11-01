var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Vue from "vue";
import { getStoreBuilder } from "vuex-typex";
import App from "./app";
import Fuse from 'fuse.js';
const initialState = {
    holeNames: [],
    surveyGroups: [],
    search_results: [],
    holes: []
};
function getHoleNames(state) {
    return __awaiter(this, void 0, void 0, function* () {
        state.holeNames = yield fetchHoleNames();
        yield App.commitSetIsLoading({ isLoading: false });
    });
}
function fetchHoleNames() {
    return __awaiter(this, void 0, void 0, function* () {
        const call = yield fetch("../../../Data/holes.json");
        const response = yield call.json();
        return response.holes;
    });
}
function getHole(state, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        state.holes = yield fetchHole(payload.filename);
        yield App.commitSetIsLoading({ isLoading: false });
    });
}
function fetchHole(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const call = yield fetch("../../../Data/Holes/" + filename);
        const response = yield call.json();
        return response;
    });
}
const searchOptions = {
    shouldSort: true,
    threshold: 0.3,
    distance: 100,
    maxPatternLength: 32,
    keys: [
        {
            name: 'title',
            weight: 0.7
        },
        {
            name: 'body',
            weight: 0.3
        }
    ]
};
function search(state, payload) {
    if (payload.search == '') {
        Vue.set(state, 'search_results', []);
    }
    else {
        let fuse = new Fuse(state.holeNames, searchOptions);
        Vue.set(state, 'search_results', fuse.search(payload.search));
    }
}
const b = getStoreBuilder().module("data", initialState);
const stateGetter = b.state();
const Data = {
    get state() { return stateGetter(); },
    commitGetHoleNames: b.commit(getHoleNames),
    commitSearch: b.commit(search),
    commitGetHole: b.commit(getHole)
};
export default Data;
//# sourceMappingURL=data.js.map