import { Injectable } from '@nestjs/common';
import { CobroRepository } from '../repository/cobro.repository';

@Injectable()
export class CobroService {
    constructor(private repo: CobroRepository) { }

    async registrarCobro(data: any) {
        return this.repo.registrarCobro(data);
    }
}
