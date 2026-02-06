export interface ContentBlockResponse {
  id: number;
  type: string;
  position: number;
  data: { [key: string]: any };
}