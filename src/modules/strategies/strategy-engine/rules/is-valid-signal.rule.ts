import { Rule } from './interfaces/rule.interface';
import { SignalDto } from '../../../scoring/dtos/signal.dto';

export class IsValidSignalRule implements Rule {
  name = 'is-valid-signal';
  description = 'Checks if the signal is valid';

  validate(signal: SignalDto): boolean {
    return !!signal && !!signal.strategy && !!signal.pair && !!signal.timeframe;
  }
}
