<template>
  <div>
    <b-form-group
      class="text-left"
      id="input-group-1"
      :label="labelName"
      :label-for="label"
    >
      <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input
          :id="label"
          type="text"
          :placeholder="placeholder"
          :state="validation"
          :disabled="isChecked && !isSpn"
          v-model="value"
          @change="onInputChange"
        ></b-form-input>
        <div v-if="loadingData" class="input-group-append">
          <span class="input-group-text" id="basic-addon2"
            ><b-icon
              icon="gear-wide-connected"
              animation="spin"
              font-scale="1"
            ></b-icon
          ></span>
        </div>
      </b-input-group>

      <b-form-checkbox v-model="isChecked" @change="onCheck()">
        <b-card-text class="small text-muted mt-1">{{
          chBoxName
        }}</b-card-text></b-form-checkbox
      >
      <b-form-invalid-feedback :state="validation">
        {{ inputdata.message }}
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
import { ILoading, Spn } from "../Models/models";
export default {
  name: "PbiInput",
  data() {
    return {
      isChecked: false,
      value: "",
    };
  },
  props: {
    labelName: String,
    chBoxName: String,
    error: String,
    label: String,
    loading: ILoading,
    inputdata: Spn,
    isSpn: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    validation() {
      if (this.inputdata.isOk != null && this.loadingData == false) {
        return this.inputdata.isOk ? true : false;
      }
      return null;
    },
    placeholder() {
      return `Enter ${this.labelName}...`;
    },
    loadingData() {
      if (this.loading != null) {
        return this.loading.isLoading;
      }
      return false;
    },
  },
  methods: {
    onInputChange() {
      this.resetError();
      this.$emit("inputchange", this.value);
    },
    onCheck() {
      this.resetError();
      if (!this.isSpn && this.isChecked) {
        this.value = "";
      }
      this.$emit("oncheck", this.isChecked);
    },
    resetError() {
      this.inputdata.isOk = null;
      this.inputdata.data = "";
      this.inputdata.message = "";
    },
  },
};
</script>

<style>
</style>