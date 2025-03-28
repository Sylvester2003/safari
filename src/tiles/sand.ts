import Tile from '@/tiles/tile'
import { tile } from '@/utils/registry'

@tile('safari:sand')
export default class Sand extends Tile {
  public toString = (): string => {
    return 'safari:sand'
  }
}
