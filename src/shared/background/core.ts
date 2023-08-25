export interface Response {
  error?: string;
}

export interface GetLoginAsUsersResponse extends Response {
  loginAsUsers: any;
}
