
import { GameLog, Visit } from "@prisma/client";
export interface OpponentStat {
    name:string;
    wins:number;
    losses:number;
    draws:number;
    winRate:string;
}


export interface FoodStat {
    name:string;
    count:number; 
    stadiumCount:number;
}

export interface StadiumStat {
    id: string;
    name: string;
    lat: number;
    lng: number;
    team: string;
    wins: number;
    losses: number;
    draws: number;
    winRate: string;
    isVisited: boolean;
   
}