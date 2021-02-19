import { AxiosResponse } from "axios";
import { SpinnerPlugin } from "bootstrap-vue";
import Vue from "vue";
import Vuex from "vuex";
import API from "../API/Api";
import { ApiResult } from "../Models/models";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiRoot: "http://localhost/",
    spnValidating: { isLoading: false, finished: false },
    workspaceApiState: { isLoading: false, finished: false },
    spnApiState: { isLoading: false, finished: false },
    workspaceResponse: new ApiResult(undefined, undefined, undefined),
    spnResponse: new ApiResult(undefined, undefined, undefined),
    reportResponse: new ApiResult(undefined, undefined, undefined),
    datasetResponse: new ApiResult(undefined, undefined, undefined),
    reportApiState: { isLoading: false, finished: false },
    datasetApiState: { isLoading: false, finished: false }
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
    },
    datasetApiState(state) {
      return state.datasetApiState;
    },
    datasetResponse(state) {
      return state.datasetResponse;
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
      state.workspaceResponse = new ApiResult(undefined, undefined, undefined);
      state.reportResponse = new ApiResult(undefined, undefined, undefined);
      state.datasetResponse = new ApiResult(undefined, undefined, undefined);
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
    setDatasetApiState(state, payload) {
      state.datasetApiState = payload;
    },
    setDatasetResponse(state, payload) {
      state.datasetResponse = payload;
    }
  },
  actions: {
    async validateSPN({ commit }, obj) {
      commit("setSpnApiState", { isLoading: true, finished: false });
      const response: AxiosResponse = await API.validateSpn({
        spn: obj.spn,
        isSpnEncrypted: obj.isSpnEncrypted,
        tenantId: obj.tenantId
      }).catch(err => {
        commit("setSpnApiState", { isLoading: false, finished: true });
        console.log(err);
        return err;
      });
      const { data } = response;
      const result = new ApiResult(data.Status, data.Data, data.Message);

      commit("setSpnResponse", result);
      commit("setSpnApiState", { isLoading: false, finished: true });
    },
    async validateWorkspace({ commit }, obj) {
      commit("setWorkspaceApiState", { isLoading: true, finished: false });
      const response: AxiosResponse = await API.validateWorkspace({
        spn: obj.spn,
        workspaceId: obj.id,
        tenantId: obj.tenantId,
        isSpnEncrypted: obj.isSpnEncrypted
      }).catch(err => {
        commit("setWorkspaceApiState", { isLoading: false, finished: true });
        console.log(err);
        return err;
      });
      commit("setWorkspaceApiState", { isLoading: false, finished: true });
      const { data } = response;
      const result = new ApiResult(data.Status, data.Data, data.Message);
      commit("setWorkspaceResponse", result);
    },
    async validateReport({ commit }, obj) {
      commit("setReportApiState", { isLoading: true, finished: false });
      const response: AxiosResponse = await API.validateReport({
        spn: obj.spn,
        tenantId: obj.tenantId,
        workspaceId: obj.wid,
        reportId: obj.rId,
        isSpnEncrypted: obj.isSpnEncrypted
      }).catch(err => {
        commit("setReportApiState", { isLoading: false, finished: true });
        console.log(err);
        return err;
      });
      commit("setReportApiState", { isLoading: false, finished: true });
      const { data } = response;
      const result = new ApiResult(data.Status, data.Data, data.Message);
      commit("setReportResponse", result);
    },
    async validateDataset({ commit }, obj) {
      commit("setDatasetApiState", { isLoading: true, finished: false });
      const response: AxiosResponse = await API.validateDataset({
        spn: obj.spn,
        tenantId: obj.tenantId,
        workspaceId: obj.wid,
        datasetId: obj.dId,
        isSpnEncrypted: obj.isSpnEncrypted
      }).catch(err => {
        commit("setDatasetApiState", { isLoading: false, finished: true });
        console.log(err);
        return err;
      });
      commit("setDatasetApiState", { isLoading: false, finished: true });
      const { data } = response;
      const result = new ApiResult(data.Status, data.Data, data.Message);
      commit("setDatasetResponse", result);
    }
  },

  modules: {}
});
