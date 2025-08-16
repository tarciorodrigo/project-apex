export interface Rule {
  name: string;
  description: string;
  validate(signal: any): boolean;
}
