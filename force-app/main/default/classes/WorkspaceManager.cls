public with sharing class WorkspaceManager {
  public WorkspaceManager() {
  }

  @AuraEnabled(cacheable=true)
  public static List<Workspace__c> getWorkspaces() {
    return [SELECT Name, Status__c, Remote_Resource_ID__c FROM Workspace__c];
  }
}
