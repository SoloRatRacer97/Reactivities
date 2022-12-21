// Setting up an interface for our ServerError to render consistent data to the frontend

export interface ServerError {
      satusCode: number;
      message: string;
      details: string;
}