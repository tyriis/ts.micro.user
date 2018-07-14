export interface RequestUser {
  id?: number;
  permissions?: Array<string>;
  roles?: Array<string>;
}

export interface Request {
  id: string,
  user: RequestUser,
}
