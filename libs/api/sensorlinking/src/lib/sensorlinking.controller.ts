import {
  Controller,
  UseGuards,
  SetMetadata,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import {
  RbacGuard,
  CsrfGuard,
  JwtGuard,
} from '@event-participation-trends/api/guards';
import { Role } from '@event-participation-trends/api/user/util';
import { SensorlinkingService } from './sensorlinking.service';

@Controller('sensorlinking')
export class SensorlinkingController {
  constructor(private readonly sensorLinkingService: SensorlinkingService) {}

  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard)
  @Get('getNewID')
  async getNewID() {
    return await this.sensorLinkingService.getNewEventSensorId();
  }

  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard)
  @Get('isLinked/:id')
  async isLinked(@Param('id') id: string): Promise<boolean> {
    return await this.sensorLinkingService.isLinked(id);
  }

  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard)
  @Get(':mac')
  async sensorlinking(@Param('mac') mac: string) {
    const evId = await this.sensorLinkingService.getNewEventSensorId();
    console.log(evId);
    return `
        <html>
            <head>
                <title>Link sensor</title>
            </head>
            <body>
                <h1>${evId}</h1>
                <form action="/api/sensorlinking/${mac}" method="POST">
                    <label for="id">MAC address</label>
                    <input type="text" id="id" name="id" />
                    <input type="submit" value="Submit" />
                </form>
            </body>
        </html>
        `;
  }

  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard)
  @Post(':mac')
  async linkDevice(@Body('id') id: string, @Param('mac') mac: string) {
    try {
      await this.sensorLinkingService.linkSensorToEventSensor(mac, id);
    } catch (e) {
      return `Oops, something went wrong while trying to link mac ${mac} to event sensor ${id}`;
    }
    return 'OK';
  }
}
