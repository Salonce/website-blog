import { ContentBlock } from "./content-block";

export interface Lesson{ 
    id : number;
    title : string;
    slug: string;
    orderId: number;
    contentBlocks: ContentBlock[];
}