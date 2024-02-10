declare namespace Express {
  export interface Response {
    api: {
      error: (data?: object, status?: number, message?: string) => void;
      success: (data?: object, status?: number, message?: string) => void;
    };
  }
}
