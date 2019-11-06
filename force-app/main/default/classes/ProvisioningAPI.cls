public with sharing class ProvisioningAPI {
  public ProvisioningAPI() {
  }

  public static void provisionWorkspace(Workspace__c workspace) {
    // Send API to provisioning API. It should return immediately with azure ID.
    workspace.Remote_Resource_ID__c =
      'az-' + String.valueOf(Datetime.now().millisecond());
  }

  public static string queryWorkspaceStatus(Workspace__c workspace) {
    return 'Started';
  }

  private void gen() {
    JSONGenerator gen = JSON.createGenerator(true);
    gen.writeStartObject();
    // gen.writeStringField('Ticket Number ', c.CaseNumber);
    // gen.writeStringField('Ticket Status', c.Status);
    // gen.writeStringField('Ticket Priority', c.Priority);
    gen.writeEndObject();
    String jsonS = gen.getAsString();
  }

  private HTTPResponse get(string path) {
    HttpRequest req = new HttpRequest();
    req.setEndpoint(path);
    return this.sendMessage(req);
  }

  private HTTPResponse post(string path, string message) {
    HttpRequest req = new HttpRequest();
    req.setMethod('POST');
    req.setEndpoint(path);

    // Add message to body
    req.setBody(message);
    return this.sendMessage(req);
  }

  private HTTPResponse sendMessage(HttpRequest req) {
    req.setHeader('content-type', 'application/json');

    // Create authorization header that the API can understand
    string authHeader = 'Bearer: ' + UserInfo.getSessionId();
    req.setHeader('Authorization', authHeader);

    Http http = new Http();
    HTTPResponse res;

    // only do this if not running in a test method
    if (!Test.isRunningTest()) {
      System.debug(
        LoggingLevel.INFO,
        'Sending the message to Provisioning API'
      );
      res = http.send(req);
      System.debug(
        LoggingLevel.INFO,
        'http.send result status: ' + res.getStatus()
      );
    } else {
      System.debug(
        LoggingLevel.INFO,
        'Running in a test so not sending the message to Provisioning API'
      );
      // This should be moved to HttpCalloutMock defined in the tests
      res = new HttpResponse();
      res.setHeader('Content-Type', 'application/json');
      res.setBody('{"example":"test"}');
      res.setStatusCode(200);
    }
    return res;
  }
}
