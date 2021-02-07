import { AxiosResponse } from "axios";
import Vue from "vue";
import Vuex from "vuex";
import API from "../API/Api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiRoot: "http://localhost:56417/",
    validating: {isLoading: false, finished: false},
    result: {result: true, data: null},
  },
  getters: {
    apiRoot(state) {
      return state.apiRoot;
    },
    validating(state) {
      return state.validating;
    },
    result(state){
      return state.result;
    }
  },
  mutations: {
    setApiRoot(state, payload) {
      state.apiRoot = payload;
    },
    setResult(state, payload) {
      state.result = payload;
    },
    setValidating(state, payload) {
      state.validating = payload;
    },
  },
  actions: {
    async validatePbi({ commit }, obj) {
      commit("setValidating",{isLoading: true, finished: false});
      const response: AxiosResponse = await API.validateSpn(obj);
      console.log(response);
      const { data }= response;
commit('setResult', {result: response.status, data: data})
      commit("setValidating", {isLoading: false, finished: true});
    },
  },
  modules: {},
});
