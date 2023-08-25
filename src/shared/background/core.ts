export interface Response {
  error?: string;
}

export interface GetUsersResponse extends Response {
  users: any;
}
