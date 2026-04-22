export type ResourceCategory =
  | "LECTURE_HALL"
  | "LAB"
  | "MEETING_ROOM"
  | "EQUIPMENT";

export type Resource = {
  id: number;
  code: string;
  name: string;
  category: ResourceCategory;
  location: string;
  capacity: number;
  active: boolean;
};

