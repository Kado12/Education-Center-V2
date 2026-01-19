import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Not, Repository } from "typeorm";
import { Sede } from "../entities/sede.entity";
import { SedeResponseDto } from "../dto/response/sede-response.dto";
import { CreateSedeDto } from "../dto/create/create-sede.dto";
import { UpdateSedeDto } from "../dto/update/update-sede.dto";

@Injectable()
export class SedeService {
  constructor(
    @InjectRepository(Sede)
    private readonly sedesRepository: Repository<Sede>,
  ) { }

  async findAll(page: number = 1, limit: number = 10, search?: string, isActive?: boolean): Promise<{
    sedes: Sede[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const whereConditions: any = {};

    if (search) {
      whereConditions.name = ILike(`%${search}%`);
    }

    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }

    const [sedes, total] = await this.sedesRepository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    const sedeDtos = sedes.map(sede => this.toResponseDto(sede));

    return {
      sedes: sedeDtos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<SedeResponseDto> {
    const sede = await this.sedesRepository.findOne({
      where: { id },
    });

    if (!sede) {
      throw new NotFoundException('Sede no encontrada');
    }

    return this.toResponseDto(sede);
  }

  async create(createSedeDto: CreateSedeDto): Promise<SedeResponseDto> {
    const existingName = await this.sedesRepository.findOne({
      where: { name: createSedeDto.name },
    });

    if (existingName) {
      throw new ConflictException('El nombre de la sede ya existe');
    }

    const existingCode = await this.sedesRepository.findOne({
      where: { code: createSedeDto.code },
    });

    if (existingCode) {
      throw new ConflictException('El código de la sede ya existe');
    }

    const sede = this.sedesRepository.create({
      ...createSedeDto,
      isActive: true,
    });

    const savedSede = await this.sedesRepository.save(sede);
    return this.toResponseDto(savedSede);
  }

  async update(id: number, updateSedeDto: UpdateSedeDto): Promise<SedeResponseDto> {
    const sede = await this.sedesRepository.findOne({
      where: { id },
    });

    if (!sede) {
      throw new NotFoundException('Sede no encontrada');
    }

    if (updateSedeDto.name && updateSedeDto.name !== sede.name) {
      const existingName = await this.sedesRepository.findOne({
        where: { name: updateSedeDto.name, id: Not(id) },
      });
      if (existingName) {
        throw new ConflictException('El nombre de la sede ya existe');
      }
    }

    if (updateSedeDto.code && updateSedeDto.code !== sede.code) {
      const existingCode = await this.sedesRepository.findOne({
        where: { code: updateSedeDto.code, id: Not(id) },
      });
      if (existingCode) {
        throw new ConflictException('El código de la sede ya existe');
      }
    }

    Object.assign(sede, updateSedeDto);
    const updatedSede = await this.sedesRepository.save(sede);
    return this.toResponseDto(updatedSede);
  }

  async toggleStatus(id: number): Promise<SedeResponseDto> {
    const sede = await this.sedesRepository.findOne({
      where: { id },
    });

    if (!sede) {
      throw new NotFoundException('Sede no encontrada');
    }

    sede.isActive = !sede.isActive;
    const updatedSede = await this.sedesRepository.save(sede);
    return this.toResponseDto(updatedSede);
  }

  async delete(id: number): Promise<void> {
    const sede = await this.sedesRepository.findOne({
      where: { id },
    });

    if (!sede) {
      throw new NotFoundException('Sede no encontrada');
    }

    await this.sedesRepository.remove(sede);
  }

  private toResponseDto(sede: Sede): SedeResponseDto {
    return {
      id: sede.id,
      name: sede.name,
      code: sede.code,
      isActive: sede.isActive,
      createdAt: sede.createdAt,
      updatedAt: sede.updatedAt,
    };
  }
}