import { LessonMetadataResponse } from "./lesson-metadata-response";

export interface CourseResponse{
  id : number;
  name : string;
  slug : string;
  position : number;
  lessons: LessonMetadataResponse[];
}