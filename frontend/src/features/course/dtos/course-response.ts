import { LessonMetadataResponse } from "./lesson-metadata-response";

export interface CourseResponse{
  id : number;
  name : string;
  slug : string;
  orderId : string;
  lessons: LessonMetadataResponse[];
}