import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SedeService } from "../services/sedes.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { CreateSedeDto } from "../dto/create/create-sede.dto";
import { SedeResponseDto } from "../dto/response/sede-response.dto";
import { UpdateSedeDto } from "../dto/update/update-sede.dto";

@ApiTags('sedes')
@Controller('sedes')
@ApiBearerAuth()
export class SedeController {
  constructor(private readonly sedeService: SedeService) { }

  @Get()
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Obtener lista de sedes' })
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

    return this.sedeService.findAll(page, limit, search, isActive);
  }

  @Get(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Obtener sede por ID' })
  async findOne(@Query('id') id: number) {
    return this.sedeService.findOne(id);
  }

  @Post()
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Crear una nueva sede' })
  @ApiResponse({ status: 201, description: 'Sede creada exitosamente.', type: SedeResponseDto })
  @ApiResponse({ status: 409, description: 'Conflicto: El proceso de inscripción ya existe.' })
  async create(@Body() createSedeDto: CreateSedeDto) {
    return this.sedeService.create(createSedeDto);
  }

  @Put(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Actualizar una sede existente' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSedeDto: UpdateSedeDto,
  ) {
    return this.sedeService.update(id, updateSedeDto);
  }

  @Patch(':id/toggle-status')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Activar o desactivar una sede' })
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.sedeService.toggleStatus(id);
  }

  @Delete(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Eliminar una sede' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.sedeService.delete(id);
    return { message: 'Sede eliminada exitosamente.' };
  }
}