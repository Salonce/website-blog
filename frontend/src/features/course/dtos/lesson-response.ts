import { ContentBlockResponse } from "./content-block-response";

export interface LessonResponse{ 
    id : number;
    title : string;
    slug: string;
    position : number;
    contentBlocks: ContentBlockResponse[];
}