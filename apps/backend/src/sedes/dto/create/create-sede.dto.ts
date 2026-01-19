import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateSedeDto {
  @ApiProperty({ description: 'Nombre de la sede', example: 'Sede Central' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'El nombre de la sede solo puede contener letras, números, guiones bajos y guiones',
  })
  name: string;

  @ApiProperty({ description: 'Código único de la sede', example: 'SC-01' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'El código de la sede solo puede contener letras, números, guiones bajos y guiones',
  })
  code: string;
}