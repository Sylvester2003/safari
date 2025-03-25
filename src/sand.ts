import Tile from '@/tile'

export default class Sand extends Tile {
    constructor(x: number, y: number) {
        super(x, y)
    }
    
    public toString(): string {
        return 'safari:sand'
    }
}