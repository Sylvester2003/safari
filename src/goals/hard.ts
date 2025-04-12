import Goal from '@/goals/goal'
import { goal } from '@/utils/registry'

@goal('safari:difficulty/hard')
export default class Easy extends Goal {
  public toString(): string {
    return 'safari:difficulty/hard'
  }
}
