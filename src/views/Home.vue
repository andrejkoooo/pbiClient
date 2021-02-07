<template>
  <div class="mt-5 pbi-card">
    <div>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-card title="Validate PBI configuration" bg-variant="light">
          <b-form-group
            class="text-left"
            id="input-group-1"
            label="Service Principal:"
            label-for="input-spn"
          >
            <b-form-input
              id="input-spn"
              v-model="form.servicePrincipal"
              type="text"
              placeholder="Enter Service Principal..."
              :state="spnValidation"
            ></b-form-input>
            <b-form-checkbox v-model="isSpnEncrypted" disabled>
              <b-card-text class="small text-muted mt-1"
                >Encrypted SPN</b-card-text
              ></b-form-checkbox
            >
            <b-form-invalid-feedback :state="spnValidation">
              Incorrect Service principal data
            </b-form-invalid-feedback>
          </b-form-group>
          <div class="mt-3">
            <b-form-group
              class="text-left mt-2"
              id="input-group-1"
              label="Workspace Id:"
              label-for="input-wks"
            >
              <b-form-input
                id="input-wks"
                v-model="form.workspaceId"
                type="text"
                placeholder="Enter Workspace Id..."
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="mt-3">
            <b-form-group
              class="text-left mt-2"
              id="input-group-1"
              label="Report Id:"
              label-for="input-rpt"
            >
              <b-form-input
                id="input-rpt"
                v-model="form.reportId"
                type="text"
                placeholder="Enter Report Id..."
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="mt-3">
            <b-form-group
              class="text-left mt-2"
              id="input-group-1"
              label="Dataset Id:"
              label-for="input-dts"
            >
              <b-input-group class="mr-sm-2 mb-sm-0">
                <b-form-input
                  id="input-dts"
                  v-model="form.datasetId"
                  type="text"
                  placeholder="Enter Dataset Id..."
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </div>
          <div>
            <b-button
              type="submit"
              variant="outline-primary"
              class="mr-2"
              :disabled="validating.isLoading"
              >{{ buttonText }}
              <b-icon
                v-if="validating.isLoading"
                icon="gear-wide-connected"
                animation="spin"
                font-scale="1"
              ></b-icon>
            </b-button>

            <b-button
              type="reset"
              :disabled="validating.isLoading"
              variant="outline-danger"
              >Reset</b-button
            >
          </div>
          <div v-if="result.data.Status">
            <p>{{ result.data.Data }}</p>
          </div>
        </b-card>
      </b-form>
      <div v-if="!result.data.Status">
        {{ result.data.Data }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// @ is an alias to /src    gear-wide-connected
export default {
  data() {
    return {
      isSpnEncrypted: true,
      spnError: "",
      isSubmitted: false,
      loadingWorkspace: false,
      loadingReport: false,
      loading: false,
      form: {
        servicePrincipal: "",
        workspaceId: "",
        datasetId: "",
        reportId: "",
      },
    };
  },
  computed: {
    ...mapGetters(["validating", "result"]),
    buttonText() {
      return this.validating.isLoading ? "Validating..." : "Validate";
    },
    spnValidation() {
      // if (this.isSubmitted) {
      //   if (this.form.servicePrincipal.length === 0) {
      //     this.onSpnError("Service principal can not be empty.");
      //     return false;
      //   }
      //   if (!this.validating.isLoading && this.validating.finished) {
      //     if (!this.spn.result) {
      //       this.onSpnError(this.spn.data);
      //     }
      //     return this.spn.result;
      //   }
      // }
      return null;
    },
  },
  methods: {
    onSubmit(event) {
      this.isSubmitted = true;
      event.preventDefault();
      this.ResetErrors();
      if (this.spnValidation != false) {
        this.$store.dispatch("validatePbi", {
          Spn: this.form.servicePrincipal,
          WorkspaceId: this.form.workspaceId,
          ReportId: this.form.reportId,
          DatasetId: this.form.datasetId,
        });
      }
    },
    ResetErrors() {
      this.spnError = "";
    },
    onReset(event) {
      event.preventDefault();
      this.ResetErrors();
      this.isSubmitted = false;
      this.form.servicePrincipal = "";
      this.form.workspaceId = "";
      this.form.datasetId = "";
      this.form.reportId = "";
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