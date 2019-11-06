trigger WorkspaceProvisioning on Workspace__c(before insert) {
  for (Workspace__c workspace : Trigger.New) {
    ProvisioningAPI.provisionWorkspace(workspace);
  }
}
