import { ContentBlockResponse } from "./content-block-response";

export interface LessonResponse{ 
    id : number;
    title : string;
    slug: string;
    orderId: number;
    contentBlocks: ContentBlockResponse[];
}