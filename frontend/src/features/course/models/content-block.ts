export interface ContentBlock{
    id : number;
    position : number;
    type : string;
}

export interface TextBlock extends ContentBlock {
  type: 'TEXT';
  content: string;
}