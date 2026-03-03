import { Injectable } from '@nestjs/common';
import { PromocionRepository } from '../repository/promocion.repository';

@Injectable()
export class PromocionService {
    constructor(private repo: PromocionRepository) { }

    async crearPromocion(data: any) {
        return this.repo.crearPromocion(data);
    }
}
