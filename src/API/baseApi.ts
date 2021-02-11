import axios from 'axios';
import state from '../store/index';
export const api = axios.create({
    headers: {
        'Accept': 'application/json',
       "content-type": "application/json",
    }     
  });

  export const GetRootUrl = () => {
    return state.getters['apiRoot'];
  };