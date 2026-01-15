import { IsBoolean, IsOptional } from "class-validator";

export class UpdateProcessDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}