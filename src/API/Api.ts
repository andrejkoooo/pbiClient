import { api, GetRootUrl } from "./baseApi";
import axios, { AxiosRequestConfig } from "axios";
import state from "../store/index";

export default {
  validateSpn(obj: any) {
    return api.post(GetRootUrl() + "api/servicePrincipal/validate", obj);
  },
};
