
import { IsString, IsNumber } from 'class-validator';

export class CreateGameValidator {

   @IsString()
   map_type : string; 

   @IsNumber()
   player_one_id : number

   player_two_id : number

}
