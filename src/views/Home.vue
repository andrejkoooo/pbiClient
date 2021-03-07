<template>
  <div class="mt-5 pbi-card">
    <div>
      <b-card
        title="Validate PBI configuration"
        bg-variant="light"
        class="rounded-0"
      >
        <pbiInput
          :label="'tenantName'"
          :labelName="'Tenenat Name'"
          :chBoxName="''"
          :loading="spnApiState"
          :inputdata="spnResponse"
          @inputchange="onTenantNameChange($event)"
        />
        <pbiInput
          :label="'tenantId'"
          :labelName="'Tenenat ID'"
          :chBoxName="''"
          :loading="spnApiState"
          :inputdata="spnResponse"
          @inputchange="onTenantChange($event)"
        />
        <pbiInput
          :label="'spnId'"
          @oncheck="onSpnCheck($event)"
          :labelName="'Service Principal'"
          :chBoxName="'Encrypted SPN'"
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
            :loading="reportApiState"
            :inputdata="reportResponse"
            @inputchange="onReportChange($event)"
          />
        </div>
        <div class="mt-3">
          <pbiInput
            :label="'DatasetId'"
            @oncheck="onDatasetCheck($event)"
            :labelName="'Dataset ID'"
            :chBoxName="'Any'"
            :loading="datasetApiState"
            :inputdata="datasetResponse"
            @inputchange="onDatasetChange($event)"
          />
        </div>
        <div>
          <b-button
            @click="onSubmit"
            squared
            variant="outline-primary"
            class="mr-2"
            :disabled="isLoading"
            >{{ buttonText }}
            <!-- <b-icon
                v-if="isLoading"
                icon="gear-wide-connected"
                animation="spin"
                font-scale="1"
              ></b-icon> -->
          </b-button>
          <b-button @click="onReset" squared variant="outline-danger"
            >Reset</b-button
          >
        </div>
      </b-card>
      <div>
        <p v-if="spnResponse.isOk != null && spnResponse.data != null">
          {{ spnResponse }}
        </p>
        <p
          v-if="
            workspaceResponse.isOk != null && workspaceResponse.data != null
          "
        >
          {{ workspaceResponse }}
        </p>
        <p v-if="reportResponse.isOk != null && reportResponse.data != null">
          {{ reportResponse }}
        </p>
        <p v-if="datasetResponse.isOk != null && datasetResponse.data != null">
          {{ datasetResponse }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pbiInput from "../components/PbiInput";
// @ is an alias to /src    gear-wide-connected
export default {
  components: {
    pbiInput
  },
  data() {
    return {
      loading: false,
      workspaceId: "",
      reportId: "",
      anyWorkspace: false,
      anyReport: false,
      spn: "",
      isSpnEncrypted: false,
      tenantId: "",
      datasetId: "",
      anyDataset: false,
      clientId: ""
    };
  },
  computed: {
    ...mapGetters([
      "spnApiState",
      "spnResponse",
      "workspaceApiState",
      "workspaceResponse",
      "reportResponse",
      "reportApiState",
      "datasetApiState",
      "datasetResponse"
    ]),
    buttonText() {
      return this.spnApiState.isLoading ? "Validating..." : "Validate";
    },
    isLoading() {
      return this.spnApiState.isLoading || this.tenantId.length === 0;
    },
    spnValidation() {
      if (this.spnResponse.isOk != null) {
        return this.spnResponse.isOk;
      }
      return null;
    }
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      await this.$store.dispatch("validateSPN", {
        spn: this.spn,
        isSpnEncrypted: this.isSpnEncrypted,
        tenantId: this.tenantId,
        clientId: this.clientId
      });
      if (!this.spnValidation) {
        //stop if error
        return;
      }

      if (this.workspaceId != "" || this.anyWorkspace) {
        const workspace = this.anyWorkspace ? "" : this.workspaceId;
        await this.$store.dispatch("validateWorkspace", {
          spn: this.spn,
          tenantId: this.tenantId,
          id: workspace,
          isSpnEncrypted: this.isSpnEncrypted,
          clientId: this.clientId
        });
      }
      if (!this.workspaceResponse.isOk) {
        //stop if error
        return;
      }

      if (
        this.isWorkspaceOk() &&
        (this.reportId.length > 0 || this.anyReport)
      ) {
        const report = this.anyReport ? "" : this.reportId;
        await this.$store.dispatch("validateReport", {
          spn: this.spn,
          tenantId: this.tenantId,
          wid: this.workspaceId,
          rId: report,
          isSpnEncrypted: this.isSpnEncrypted,
          clientId: this.clientId
        });
      }
      if (
        this.isWorkspaceOk() &&
        (this.datasetId.length > 0 || this.anyDataset)
      ) {
        const dataset = this.anyDataset ? "" : this.datasetId;
        await this.$store.dispatch("validateDataset", {
          spn: this.spn,
          tenantId: this.tenantId,
          wid: this.workspaceId,
          dId: dataset,
          isSpnEncrypted: this.isSpnEncrypted,
          clientId: this.clientId
        });
      }
      this.loading = false;
    },
    isWorkspaceOk() {
      return this.workspaceId != "" && this.workspaceResponse.isOk;
    },
    onDatasetChange(val) {
      this.datasetId = val;
    },
    onDatasetCheck(val) {
      this.anyDataset = val;
    },
    onTenantChange(val) {
      this.tenantId = val;
    },
    onReportChange(val) {
      this.reportId = val;
    },
    onReportCheck(val) {
      this.anyReport = val;
    },
    onWorkspaceChange(val) {
      this.workspaceId = val;
    },
    onSpnChange(val) {
      this.spn = val;
    },
    onReset() {
      this.spnError = "";
      this.tenantId = "";
      this.workspaceId = "";
      this.reportId = "";
      this.datasetId = "";
      this.$store.commit("resetSPN");
    },
    onTenantNameChange(val) {
      this.clientId = val;
    },
    onWorkspaceCheck(data) {
      this.anyWorkspace = data;
    },
    onSpnCheck(val) {
      this.isSpnEncrypted = val;
    },
    onSpnError(details) {
      if (details != null) this.spnError = JSON.parse(JSON.stringify(details));
    }
  }
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
.btn {
  width: 120px;
}
</style>
