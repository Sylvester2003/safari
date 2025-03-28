import Tile from '@/tiles/tile'
import { tile } from '@/utils/registry'

@tile('safari:hill')
export default class Hill extends Tile {
  public toString = (): string => {
    return 'safari:hill'
  }
}
