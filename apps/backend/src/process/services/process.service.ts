import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Not, Repository } from "typeorm";
import { Process } from "../entities/process.entity";
import { ProcessResponseDto } from "../dto/response/process-response.dto";
import { CreateProcessDto } from "../dto/create/create-process.dto";
import { UpdateProcessDto } from "../dto/update/update-process.dto";

@Injectable()
export class ProcessService {
  constructor(
    @InjectRepository(Process)
    private readonly processesRepository: Repository<Process>,
  ) { }

  async findAll(page: number = 1, limit: number = 10, search?: string, isActive?: boolean): Promise<{
    processes: Process[];
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

    const [processes, total] = await this.processesRepository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    const processDtos = processes.map(process => this.toResponseDto(process));

    return {
      processes: processDtos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<ProcessResponseDto> {
    const process = await this.processesRepository.findOne({
      where: { id },
    });

    if (!process) {
      throw new NotFoundException('Proceso no encontrado');
    }

    return this.toResponseDto(process);
  }

  async create(createProcessDto: CreateProcessDto): Promise<ProcessResponseDto> {
    const existingName = await this.processesRepository.findOne({
      where: { name: createProcessDto.name },
    });

    if (existingName) {
      throw new ConflictException('El nombre del proceso ya existe');
    }

    const existingCode = await this.processesRepository.findOne({
      where: { code: createProcessDto.code },
    });

    if (existingCode) {
      throw new ConflictException('El código del proceso ya existe');
    }

    const process = this.processesRepository.create({
      ...createProcessDto,
      isActive: true,
    });

    const savedProcess = await this.processesRepository.save(process);
    return this.toResponseDto(savedProcess);
  }

  async update(id: number, updateProcessDto: UpdateProcessDto): Promise<ProcessResponseDto> {
    const process = await this.processesRepository.findOne({
      where: { id },
    });

    if (!process) {
      throw new NotFoundException('Proceso no encontrado');
    }

    if (updateProcessDto.name && updateProcessDto.name !== process.name) {
      const existingName = await this.processesRepository.findOne({
        where: { name: updateProcessDto.name, id: Not(id) },
      });
      if (existingName) {
        throw new ConflictException('El nombre del proceso ya existe');
      }
    }

    if (updateProcessDto.code && updateProcessDto.code !== process.code) {
      const existingCode = await this.processesRepository.findOne({
        where: { code: updateProcessDto.code, id: Not(id) },
      });
      if (existingCode) {
        throw new ConflictException('El codigo del proceso ya existe');
      }
    }

    Object.assign(process, updateProcessDto);
    const updatedProcess = await this.processesRepository.save(process);
    return this.toResponseDto(updatedProcess);
  }

  async toggleStatus(id: number): Promise<ProcessResponseDto> {
    const process = await this.processesRepository.findOne({
      where: { id },
    });

    if (!process) {
      throw new NotFoundException('Proceso no encontrado');
    }

    process.isActive = !process.isActive;
    const updatedProcess = await this.processesRepository.save(process);
    return this.toResponseDto(updatedProcess);
  }

  async delete(id: number): Promise<void> {
    const process = await this.processesRepository.findOne({
      where: { id },
    });

    if (!process) {
      throw new NotFoundException('Proceso no encontrado');
    }

    await this.processesRepository.remove(process);
  }

  private toResponseDto(process: Process): ProcessResponseDto {
    return {
      id: process.id,
      name: process.name,
      code: process.code,
      isActive: process.isActive,
      createdAt: process.createdAt,
      updatedAt: process.updatedAt,
    };
  }
}