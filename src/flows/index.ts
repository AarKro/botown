import { IDGenerator } from "../utils.js";

export type FlowStep<T> = (event: T, ...args: any[]) => any[];

export type FlowValidatorStep<T> = (event: T, ...args: any[]) => boolean;

interface FlowStepInstruction<T> {
  isValidator: false;
  step: FlowStep<T>;
}

interface FlowStepValidatorInstruction<T> {
  isValidator: true;
  step: FlowValidatorStep<T>;
}

export interface Flow<T> {
  id: number;
  event: T;
  steps: Array<FlowStepInstruction<T> | FlowStepValidatorInstruction<T>>;
  apply: (step: FlowStep<T>) => Flow<T>;
  validate: (step: FlowValidatorStep<T>) => Flow<T>
  process: () => void;
}


export const Flow = {
  new<T>(event: T): Flow<T> {
    return {
      id: IDGenerator.next().value,
      event,
      steps: [],
      apply(step) {
        this.steps.push({
          isValidator: false,
          step
        });
        return this;
      },
      validate(step) {
        this.steps.push({
          isValidator: true,
          step
        });
        return this;
      },
      process() {
        let args: any[] = [];
        this.steps.every(instruction => {
          if (!instruction.isValidator) {
            args = instruction.step(this.event, ...args);
            return true;
          } else {
            return instruction.step(this.event, ...args);
          }
        });
        console.log(`${this.id} flow finished`);
      }
    };
  },
};