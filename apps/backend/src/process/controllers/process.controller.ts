import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('registration_processes')
@Controller('registration_processes')
@ApiBearerAuth()
export class ProcessController {

}