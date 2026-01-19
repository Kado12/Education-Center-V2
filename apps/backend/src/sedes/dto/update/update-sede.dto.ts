import { PartialType } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateSedeDto } from "../create/create-sede.dto";

export class UpdateSedeDto extends PartialType(CreateSedeDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}