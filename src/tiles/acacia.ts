import Tile from '@/tiles/tile'
import { tile } from '@/utils/registry';

@tile('safari:acadia')
export default class Acacia extends Tile {
  /**
   * not for use, only for the decorator.
   */
    constructor() {
      super(0, 0); 
    }
  
  public toString(): string {
    return 'safari:acacia'
  }
}
