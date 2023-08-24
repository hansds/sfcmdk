import { doAuthenticatedSalesforceRequest } from "./utils";

export interface GetLoginAsUsersResponse {
  loginAsUsers: Record<string, string>;
}

export function fetchLoginAsUsers(
  sessionId: string
): Promise<GetLoginAsUsersResponse> {
  const url = `https://na1.salesforce.com/services/data/v50.0/query/?q=SELECT+Id,Name,Profile.Name+FROM+User+WHERE+IsActive+=+true`;
  const req = doAuthenticatedSalesforceRequest(sessionId, url);

  console.log("req", req);
  return req;
}
