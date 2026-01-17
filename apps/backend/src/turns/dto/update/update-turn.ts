import { PartialType } from "@nestjs/swagger";
import { CreateTurnDto } from "../create/create.turn.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateTurnDto extends PartialType(CreateTurnDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}