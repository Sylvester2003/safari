import Tile from '@/tiles/tile'
import { tile } from '@/utils/registry'

@tile('safari:road')
export default class Road extends Tile {
  public toString = (): string => {
    return 'safari:road'
  }
}
