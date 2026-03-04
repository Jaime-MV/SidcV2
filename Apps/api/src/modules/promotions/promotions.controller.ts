import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';

@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreatePromocionDto) {
        return this.promotionsService.create(dto);
    }

    @Get()
    findAll() {
        return this.promotionsService.findAll();
    }

    @Get('vigentes')
    findVigentes() {
        return this.promotionsService.findVigentes();
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.promotionsService.findById(id);
    }

    @Patch(':id/toggle')
    toggleActiva(@Param('id', ParseIntPipe) id: number) {
        return this.promotionsService.toggleActiva(id);
    }
}
