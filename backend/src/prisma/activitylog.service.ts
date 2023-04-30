import { Injectable } from '@nestjs/common';
import {PrismaService} from "./prisma.service";
import {ActivityLog, Prisma} from '@prisma/client'

@Injectable()
export class ActivitylogService {
    constructor(private prisma: PrismaService) {
    }

    async createLog(data: Prisma.ActivityLogCreateInput): Promise<ActivityLog> {
        return this.prisma.activityLog.create({
            data,
        })
    }

}
