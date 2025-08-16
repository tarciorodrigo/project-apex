import { Injectable, Logger } from '@nestjs/common';
import { Rule } from './interfaces/rule.interface';
import { IsValidSignalRule } from './is-valid-signal.rule';

@Injectable()
export class RulesService {
  private readonly logger = new Logger(RulesService.name);
  private rules: Rule[] = [];

  constructor() {
    this.loadRules();
    this.logger.log(`Initialized RulesService with ${this.rules.length} rules`);
  }

  loadRules() {
    this.addRule(new IsValidSignalRule());
    // TODO: Load more rules from a configuration file
  }

  getRules(): Rule[] {
    return this.rules;
  }

  addRule(rule: Rule) {
    this.rules.push(rule);
    this.logger.log(`Added rule: ${rule.name}`);
  }
}
