import { Lesson } from "./lesson";

export interface Course{
  id : number;
  name : string;
  slug : string;
  orderId : string;
  lessons: Lesson[];
}