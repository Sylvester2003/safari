import Tile from '@/tiles/tile'
import { tile } from '@/utils/registry'

@tile('safari:river')
export default class River extends Tile {
  public toString = (): string => {
    return 'safari:river'
  }
}
