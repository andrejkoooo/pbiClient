import { AxiosResponse } from "axios";
import { SpinnerPlugin } from "bootstrap-vue";
import Vue from "vue";
import Vuex from "vuex";
import API from "../API/Api";
import { ApiResult } from "../Models/models";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiRoot: "http://localhost:56417/",
    spnValidating: { isLoading: false, finished: false },
    workspaceApiState: { isLoading: false, finished: false },
    spnApiState: { isLoading: false, finished: false },
    workspaceResponse: new ApiResult(undefined, undefined, undefined),
    spnResponse: new ApiResult(undefined, undefined, undefined),
    reportResponse: new ApiResult(undefined, undefined, undefined),
    reportApiState: { isLoading: false, finished: false }
  },
  getters: {
    apiRoot(state) {
      return state.apiRoot;
    },
    spnApiState(state) {
      return state.spnApiState;
    },
    spnResponse(state) {
      return state.spnResponse;
    },
    workspaceApiState(state) {
      return state.workspaceApiState;
    },
    workspaceResponse(state) {
      return state.workspaceResponse;
    },
    reportApiState(state) {
      return state.reportApiState;
    },
    reportResponse(state) {
      return state.reportResponse;
    }
  },
  mutations: {
    setApiRoot(state, payload) {
      state.apiRoot = payload;
    },
    setSpnApiState(state, payload) {
      state.spnApiState = payload;
    },
    setSpnResponse(state, payload) {
      state.spnResponse = payload;
    },
    resetSPN(state) {
      state.spnResponse = new ApiResult(undefined, undefined, undefined);
      state.workspaceResponse= new ApiResult(undefined, undefined, undefined);
    },
    setWorkspaceApiState(state, payload) {
      state.workspaceApiState = payload;
    },
    setWorkspaceResponse(state, payload) {
      state.workspaceResponse = payload;
    },
    setReportApiState(state, payload) {
      state.reportApiState = payload;
    },
    setReportResponse(state, payload) {
      state.reportResponse = payload;
    },
  },
  actions: {
    async validateSPN({ commit }, obj) {
      commit("setSpnApiState", { isLoading: true, finished: false });
      const response: AxiosResponse = await API.validateSpn({ spn: obj.spn, isSpnEncrypted: obj.isSpnEncrypted }).catch(
        (err) => {
          commit("setSpnApiState", { isLoading: false, finished: true });
          console.log(err);   
          return err;
        }
      );
      const { data } = response;
      const result = new ApiResult(data.Status, data.Data, data.Message);

  
      commit("setSpnResponse", result);
      commit("setSpnApiState", { isLoading: false, finished: true });
    },
    async validateWorkspace({commit}, obj){
      commit("setWorkspaceApiState", { isLoading: true, finished: false });
      const response: AxiosResponse = await API.validateWorkspace({ spn: obj.spn, AttributeId: obj.id }).catch(
        (err) => {
          commit("setWorkspaceApiState", { isLoading: false, finished: true });
          console.log(err);   
          return err;
        }
      );
      console.log(response);
      commit("setWorkspaceApiState", { isLoading: false, finished: true });
      const { data } = response; 
      const result = new ApiResult(data.Status, data.Data, data.Message);
      commit("setWorkspaceResponse", result);
    }
  },
  modules: {},
});
