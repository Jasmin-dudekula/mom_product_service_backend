class ApiResponse {
  // properties
  public readonly statusCode: number;
  public readonly data: any;
  public readonly message: string;
  public readonly success: boolean;

  // constructor
  constructor(statusCode: number, data: any, message: string = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
