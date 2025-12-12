import type { DesignStyle } from "@/components/customs/SliderStyles";
import type { Outline } from "./outline";

export type Project ={
  userInpurPrompt: string;
  projectId: string;
  createdAt: string;
  noOfSliders: string;
  outline:Outline[];
  slides:any[]
  designStyle:DesignStyle
  }