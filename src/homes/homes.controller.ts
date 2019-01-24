import { Response, Params, Controller, Get } from '@decorators/express'
import { Injectable } from '@decorators/di'

import { HomesService } from './homes.service'
import { Home } from './home.interface'
import { CreateHomeDto } from './create-home.dto'

@Controller('/homes')
@Injectable()
export class HomesController {

    constructor(private readonly _homesService: HomesService) {}

    @Get('/')
    async getHomes(@Response() res) {
      res.send( this._homesService.findAll() )
    }

    // @Get('/')
    async findAll(): Promise<Home[]> {
        return this._homesService.findAll()
    }

    // @Post()
    // @UsePipes(new ValidationPipe())
    async create(home: CreateHomeDto) {
        // req.body['item']
        this._homesService.create(home)
    }
}