import { SignalDto } from '../../../../scoring/dtos/signal.dto';

export interface Strategy {
  name: string;
  execute(signal: SignalDto): void;
}
