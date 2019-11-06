import { LightningElement, track, wire } from "lwc";
import getWorkspaces from "@salesforce/apex/WorkspaceManager.getWorkspaces";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { createRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import Workspace__c from "@salesforce/schema/Workspace__c";
import NAME_FIELD from "@salesforce/schema/Workspace__c.Name";

export default class WorkspaceManager extends LightningElement {
  @track workspaces;
  @track error;

  name = "";
  wiredWorkspacesResult;

  @wire(getWorkspaces)
  doGetWorkspaces(response) {
    this.wiredWorkspacesResult = response;
    if (response.data) {
      this.workspaces = response.data;
      this.error = undefined;
    } else if (response.error) {
      // TODO: Implement common error handling.
      throw new Error("Failed to load workspaces: ", response.error);
    }
  }

  handleRefresh() {
    refreshApex(this.wiredWorkspacesResult);
  }

  handleCreateWorkspace() {
    this.createWorkspace();
  }

  handleNameChange(event) {
    this.name = event.target.value;
  }

  clearInputName() {
    this.name = "";
    this.template.querySelector("lightning-input.workspace-name").value = "";
  }

  createWorkspace() {
    const fields = {};
    fields[NAME_FIELD.fieldApiName] = this.name;
    const recordInput = { apiName: Workspace__c.objectApiName, fields };
    createRecord(recordInput)
      .then(workspace => {
        // eslint-disable-next-line no-console
        console.log("workspace: ", workspace);
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Workspace created",
            variant: "success"
          })
        );
        this.handleRefresh();
        this.clearInputName();
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error,
            // message: reduceErrors(error).join(", "), // get this from the lwc_recipes app
            variant: "error"
          })
        );
      });
  }
}
