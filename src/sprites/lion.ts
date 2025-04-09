import Carnivore from '@/sprites/carnivore'
import { carnivore } from '@/utils/registry'

@carnivore('safari:lion')
export default class Zebra extends Carnivore {
  public toString(): string {
    return 'safari:lion'
  }
}
