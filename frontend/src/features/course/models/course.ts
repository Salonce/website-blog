import { LessonMetadataResponse } from "./lesson-metadata-response";

export interface Course{
  id : number;
  name : string;
  slug : string;
  orderId : string;
  lessons: LessonMetadataResponse[];
}