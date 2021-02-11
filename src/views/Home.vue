<template>
  <div class="mt-5 pbi-card">
    <div>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-card title="Validate PBI configuration" bg-variant="light">
          <pbiInput
            :label="'spnId'"
            @oncheck="onSpnCheck($event)"
            :labelName="'Service Principal'"
            :chBoxName="'Encrypted SPN'"
            :error="''"
            :loading="spnApiState"
            :inputdata="spnResponse"
            @inputchange="onSpnChange($event)"
            :isSpn="true"
          />
          <div class="mt-3">
            <pbiInput
              :label="'WorkspaceId'"
              @oncheck="onWorkspaceCheck($event)"
              :labelName="'Workspace ID'"
              :chBoxName="'Any'"
              :error="''"
              :loading="workspaceApiState"
              :inputdata="workspaceResponse"
              @inputchange="onWorkspaceChange($event)"
            />
          </div>
          <div class="mt-3">
            <pbiInput
              :label="'ReportId'"
              @oncheck="onReportCheck($event)"
              :labelName="'Report ID'"
              :chBoxName="'Any'"
              :error="''"
              :loading="reportApiState"
              :inputdata="reportResponse"
              @inputchange="onReportChange($event)"
            />
          </div>
          <div>
            <b-button
              type="submit"
              variant="outline-primary"
              class="mr-2"
              :disabled="isLoading"
              >{{ buttonText }}
              <b-icon
                v-if="isLoading"
                icon="gear-wide-connected"
                animation="spin"
                font-scale="1"
              ></b-icon>
            </b-button>
            <b-button
              type="reset"
              :disabled="isLoading"
              variant="outline-danger"
              >Reset</b-button
            >
          </div>
        </b-card>
      </b-form>
      {{ spnResponse }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pbiInput from "../components/PbiInput";
// @ is an alias to /src    gear-wide-connected
export default {
  components: {
    pbiInput,
  },
  data() {
    return {
      isSubmitted: false,
      loading: false,
      workspaceId: "",
      reportId: "",
      anyWorkspace: false,
      anyReport: false,
      spn: "",
      isSpnEncrypted: false,
    };
  },
  computed: {
    ...mapGetters([
      "spnApiState",
      "spnResponse",
      "workspaceApiState",
      "workspaceResponse",
      "reportResponse",
      "reportApiState"
    ]),
    buttonText() {
      return this.spnApiState.isLoading ? "Validating..." : "Validate";
    },
    isLoading() {
      return this.spnApiState.isLoading;
    },
    spnValidation() {
      if (this.spnResponse.isOk != null) {
        return this.spnResponse.isOk;
      }
      return null;
    },
  },
  methods: {
    async onSubmit(event) {
      this.isSubmitted = true;
      event.preventDefault();
      this.ResetErrors();

      await this.$store.dispatch("validateSPN", {
        spn: this.spn,
        isSpnEncrypted: this.isSpnEncrypted,
      });
      if (!this.spnValidation) {
        //stop if error
        return;
      }

      if (this.workspaceId != "" || this.anyWorkspace) {
        const workspace = this.anyWorkspace ? "" : this.workspaceId;
        await this.$store.dispatch("validateWorkspace", {
          spn: this.spn,
          id: workspace,
        });
      }
    },
    onReportChange(val){
this.reportId = val;
    },
    onReportCheck(val){
this.anyReport = val;
    },
    onWorkspaceChange(val) {
      this.workspaceId = val;
    },
    onSpnChange(val) {
      this.spn = val;
    },
    ResetErrors() {
      this.spnError = "";
      this.$store.commit("resetSPN");
    },
    onWorkspaceCheck(data) {
      this.anyWorkspace = data;
    },
    onSpnCheck(val) {
      this.isSpnEncrypted = val;
    },
    onReset(event) {
      event.preventDefault();
      this.ResetErrors();
      this.isSubmitted = false;
    },
    onSpnError(details) {
      if (details != null) this.spnError = JSON.parse(JSON.stringify(details));
    },
  },
};
</script>

<style scoped>
.pbi-card {
  width: 70%;
  margin-left: 15%;
}
.btn:disabled {
  cursor: not-allowed;
}
</style>
