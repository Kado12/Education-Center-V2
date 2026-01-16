import { PartialType } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateProcessDto } from "../create/create-process.dto";

export class UpdateProcessDto extends PartialType(CreateProcessDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}