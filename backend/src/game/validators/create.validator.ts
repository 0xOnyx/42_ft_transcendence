
import { IsString, IsNumberString } from 'class-validator';

export class CreateGameValidator {

   @IsString()
   map_type : string; 

   @IsNumberString()
   player_one_id : number

   player_two_id : number

}
