import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateProcessDto {
  @ApiProperty({ description: 'Nombre del proceso de registro', example: '2026-I' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'El nombre del proceso solo puede contener letras, números, guiones bajos y guiones',
  })
  name: string;

  @ApiProperty({ description: 'Código único del proceso de registro', example: '20261' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: 'El código solo puede contener números',
  })
  code: string;
}