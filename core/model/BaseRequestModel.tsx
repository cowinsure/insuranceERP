// models/BaseRequestModel.ts

export interface Location {
    latitude: number;
    longitude: number;
  }
  
  export interface BaseRequestModel {
    userId: string;
    phoneNumber: string;
    location: Location | null;
  }
  