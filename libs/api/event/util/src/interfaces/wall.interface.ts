import {Types} from 'mongoose';

export interface IWall{
    wallId?: Types.ObjectId | undefined | null;
    x_coordiante: number | undefined | null;
    y_coordiante: number | undefined | null;
    width: number | undefined | null;
    height: number | undefined | null;
}