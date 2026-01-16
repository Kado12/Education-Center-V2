import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProcessService } from "../services/process.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { CreateProcessDto } from "../dto/create/create-process.dto";
import { ProcessResponseDto } from "../dto/response/process-response.dto";
import { UpdateProcessDto } from "../dto/update/update-process.dto";

@ApiTags('processes')
@Controller('processes')
@ApiBearerAuth()
export class ProcessController {
  constructor(private readonly processService: ProcessService) { }

  @Get()
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Obtener lista de procesos de inscripción' })
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

    return this.processService.findAll(page, limit, search, isActive);
  }

  @Get(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Obtener proceso de inscripción por ID' })
  async findOne(@Query('id') id: number) {
    return this.processService.findOne(id);
  }

  @Post()
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Crear un nuevo proceso de inscripción' })
  @ApiResponse({ status: 201, description: 'Proceso de inscripción creado exitosamente.', type: ProcessResponseDto })
  @ApiResponse({ status: 409, description: 'Conflicto: El proceso de inscripción ya existe.' })
  async create(@Body() createProcessDto: CreateProcessDto) {
    return this.processService.create(createProcessDto);
  }

  @Put(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Actualizar un proceso de inscripción existente' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProcessDto: UpdateProcessDto,
  ) {
    return this.processService.update(id, updateProcessDto);
  }

  @Patch(':id/toggle-status')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Activar o desactivar un proceso de inscripción' })
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.processService.toggleStatus(id);
  }

  @Delete(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Eliminar un proceso de inscripción' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.processService.delete(id);
    return { message: 'Proceso de inscripción eliminado exitosamente.' };
  }
}