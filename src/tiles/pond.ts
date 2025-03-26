import Tile from '@/tiles/tile'
import { tile } from '@/utils/registry';

@tile('safari:pond')
export default class Pond extends Tile {
  /**
   * not for use, only for the decorator.
   */
    constructor() {
      super(0, 0); 
    }
  
  public toString(): string {
    return 'safari:pond'
  }
}
