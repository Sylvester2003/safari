import Carnivore from '@/sprites/carnivore'
import { carnivore } from '@/utils/registry'

@carnivore('safari:blackPanther')
export default class BlackPanther extends Carnivore {
  public toString(): string {
    return 'safari:blackPanther'
  }
}
