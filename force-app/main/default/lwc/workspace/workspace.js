import { api, LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { deleteRecord } from "lightning/uiRecordApi";

export default class Workspace extends LightningElement {
  @api name;
  @api status;
  @api resourceId;
  @api workspaceId;

  handleDeleteWorkspace() {
    this.deleteWorkspace(this.workspaceId);
  }

  async deleteWorkspace(workspaceId) {
    try {
      await deleteRecord(workspaceId);
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Success",
          message: "Workspace deleted",
          variant: "success"
        })
      );
      // TODO: trigger refresh event for WorkspaceManager
      this.dispatchEvent(new CustomEvent("refresh"));
    } catch (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error deleting workspace",
          message: error.toString(),
          // message: reduceErrors(error).join(', '), TODO: use lwc-recipes reduceErrors
          variant: "error"
        })
      );
    }
  }
}
