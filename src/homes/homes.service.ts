import { Injectable, Container } from '@decorators/di'
import { Home } from './home.interface'

@Injectable()
export class HomesService {
    private readonly homes: Home[] = [
        {
        id: 1,
        name: 'Hus1',
        rooms: [
            {
            name: 'Vardagsrum',
            temperature: 21,
            humidity: 0.2
            },
            {
            name: 'Kök',
            temperature: 28,
            humidity: 0.95
    
            }
        ]
        },
        {
        id: 2,
        name: 'Hus2',
        rooms: [
            {
            name: 'Vardagsrum',
            temperature: 21,
            humidity: 0.20
            },
            {
            name: 'Kök',
            temperature: 28,
            humidity: 0.95
    
            }
        ]
        },
    ]

    findOne(id: number): Home {
        return this.homes.find(home => home.id == id)
    }

    findAll(): Home[] {
        return this.homes
    }
}
