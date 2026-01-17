import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Turn } from "../entities/turn.entity";
import { ILike, Not, Repository } from "typeorm";
import { TurnResponseDto } from "../dto/response/turn-response";
import { CreateTurnDto } from "../dto/create/create.turn.dto";
import { UpdateTurnDto } from "../dto/update/update-turn";

@Injectable()
export class TurnsService {
  constructor(
    @InjectRepository(Turn)
    private readonly turnsRepository: Repository<Turn>,
  ) { }

  async findAll(page: number = 1, limit: number = 10, search?: string, isActive?: boolean): Promise<{
    turns: Turn[];
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

    const [turns, total] = await this.turnsRepository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: {
        id: 'ASC',
      },
    });

    const turnDtos = turns.map(turn => this.toResponseDto(turn));

    return {
      turns: turnDtos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<TurnResponseDto> {
    const turn = await this.turnsRepository.findOne({
      where: { id },
    });

    if (!turn) {
      throw new NotFoundException('Turno no encontrado');
    }

    return this.toResponseDto(turn);
  }

  async create(createTurnDto: CreateTurnDto): Promise<TurnResponseDto> {
    const existingName = await this.turnsRepository.findOne({
      where: { name: createTurnDto.name },
    });

    if (existingName) {
      throw new ConflictException('El nombre del turno ya existe');
    }

    const turn = this.turnsRepository.create({
      ...createTurnDto,
      isActive: true,
    });

    const savedTurn = await this.turnsRepository.save(turn);
    return this.toResponseDto(savedTurn);
  }

  async update(id: number, updateTurnDto: UpdateTurnDto): Promise<TurnResponseDto> {
    const turn = await this.turnsRepository.findOne({
      where: { id },
    });

    if (!turn) {
      throw new NotFoundException('Turno no encontrado');
    }

    if (updateTurnDto.name && updateTurnDto.name !== turn.name) {
      const existingName = await this.turnsRepository.findOne({
        where: { name: updateTurnDto.name, id: Not(id) },
      });
      if (existingName) {
        throw new ConflictException('El nombre del turno ya existe');
      }
    }

    Object.assign(turn, updateTurnDto);
    const updatedTurn = await this.turnsRepository.save(turn);
    return this.toResponseDto(updatedTurn);
  }

  async toggleStatus(id: number): Promise<TurnResponseDto> {
    const turn = await this.turnsRepository.findOne({
      where: { id },
    });

    if (!turn) {
      throw new NotFoundException('Turno no encontrado');
    }

    turn.isActive = !turn.isActive;
    const updatedTurn = await this.turnsRepository.save(turn);
    return this.toResponseDto(updatedTurn);
  }

  async delete(id: number): Promise<void> {
    const turn = await this.turnsRepository.findOne({
      where: { id },
    });

    if (!turn) {
      throw new NotFoundException('Turno no encontrado');
    }

    await this.turnsRepository.remove(turn);
  }

  private toResponseDto(turn: Turn): TurnResponseDto {
    return {
      id: turn.id,
      name: turn.name,
      startTime: turn.startTime,
      endTime: turn.endTime,
      isActive: turn.isActive,
      createdAt: turn.createdAt,
      updatedAt: turn.updatedAt,
    };
  }
}