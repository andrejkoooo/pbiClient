import { api, GetRootUrl } from "./baseApi";
import { ApiResult } from "../Models/models";

export default {
  validateSpn(obj: any) {
   // return api.post(GetRootUrl() + "api/servicePrincipal/validate", obj);
    return api.post<ApiResult>(GetRootUrl() + `api/servicePrincipal/validateSpn`, obj);
  },
  validateWorkspace(data: any){
    return api.post<ApiResult>(GetRootUrl() + `api/servicePrincipal/validateWorkspace`, data);
  }
};