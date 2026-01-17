import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateTurnDto {
  @ApiProperty({ description: 'Nombre del turno', example: 'Turno 1' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'El nombre solo puede contener letras, números y guiones bajos' })
  name: string;

  @ApiProperty({ description: 'Hora de inicio del turno', example: '08:00:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'Hora de fin del turno', example: '12:00:00' })
  @IsString()
  @IsNotEmpty()
  endTime: string;
}