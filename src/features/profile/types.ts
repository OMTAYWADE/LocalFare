export type TravelerType =
    | "tourist"
    | "citizen";

export interface TravelerProfile {
    travelerType: TravelerType;
    visitedPlaceIds: string[];
    savedPlaceIds: string[];
    plannedPlaceIds: string[];
    createdAt: string;
    updatedAt: string;
}