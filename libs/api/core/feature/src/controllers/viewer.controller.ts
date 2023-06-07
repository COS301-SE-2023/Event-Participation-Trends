import { ViewerService } from '@event-participation-trends/api/viewer/feature';
import {
    ICreateViewerRequest,
    ICreateViewerResponse,
} from '@event-participation-trends/api/viewer/util';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('viewer')
export class ViewerController {
    constructor(private viewerService: ViewerService){}

    @Post('createViewer')
    async create(
        @Body() request: ICreateViewerRequest,
    ): Promise<ICreateViewerResponse> {
        return this.viewerService.createViewer(request);
    }
}