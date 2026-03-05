import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ClientModule } from './modules/client/client.module';
import { RoutesModule } from './modules/routes/routes.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { SalesModule } from './modules/sales/sales.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
    imports: [
        PrismaModule,
        InventoryModule,
        ClientModule,
        RoutesModule,
        PromotionsModule,
        SalesModule,
        DashboardModule,
        ReportsModule,
    ],
})
export class AppModule { }
