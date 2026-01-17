import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TurnsService } from "../services/turns.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { CreateTurnDto } from "../dto/create/create.turn.dto";
import { TurnResponseDto } from "../dto/response/turn-response";
import { UpdateTurnDto } from "../dto/update/update-turn";

@ApiTags('turns')
@Controller('turns')
@ApiBearerAuth()
export class TurnsController {
  constructor(private readonly turnsService: TurnsService) { }

  @Get()
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Obtener lista de turnos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isActive') isActiveParam?: string, // Recibir como string primero
  ) {
    // Convertir string a boolean correctamente
    let isActive: boolean | undefined;
    if (isActiveParam !== undefined && isActiveParam !== '') {
      isActive = isActiveParam === 'true';
    }

    return await this.turnsService.findAll(page, limit, search, isActive);
  }

  @Get(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Obtener turno por ID' })
  @ApiQuery({ name: 'id', required: true, type: Number })
  async findOne(@Query('id') id: number) {
    return await this.turnsService.findOne(id);
  }

  @Post()
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Crear un nuevo turno' })
  @ApiResponse({ status: 201, description: 'Turno creado exitosamente.', type: TurnResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 409, description: 'El nombre del turno ya existe.' })
  async create(@Body() createTurnDto: CreateTurnDto) {
    return await this.turnsService.create(createTurnDto);
  }

  @Put(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Actualizar un turno existente' })
  @ApiResponse({ status: 200, description: 'Turno actualizado exitosamente.', type: TurnResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  @ApiResponse({ status: 409, description: 'El nombre del turno ya existe.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTurnDto: UpdateTurnDto
  ) {
    return await this.turnsService.update(id, updateTurnDto);
  }

  @Patch(':id/toggle-status')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Activar/Desactivar un turno' })
  @ApiResponse({ status: 200, description: 'Turno actualizado exitosamente.', type: TurnResponseDto })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return await this.turnsService.toggleStatus(id);
  }

  @Delete(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Eliminar un turno' })
  @ApiResponse({ status: 200, description: 'Turno eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.turnsService.delete(id);
  }
}