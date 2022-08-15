import { IDGenerator } from "../utils.js";

enum FlowStepType {
  PROCESS,
  VALIDATION,
  TRANSFORM,
}

type FlowProcessStep<T> = (event: T, ...args: any[]) => void;

type FlowValidationStep<T> = (event: T, ...args: any[]) => boolean;

type FlowTransformStep<T> = (event: T, ...args: any[]) => any[];

interface FlowProcessInstruction<T> {
  flowStepType: FlowStepType.PROCESS;
  step: FlowProcessStep<T>;
}

interface FlowValidationInstruction<T> {
  flowStepType: FlowStepType.VALIDATION;
  step: FlowValidationStep<T>;
}

interface FlowTransformInstruction<T> {
  flowStepType: FlowStepType.TRANSFORM;
  step: FlowTransformStep<T>;
}

type FlowInstruction<T> = FlowProcessInstruction<T> | FlowValidationInstruction<T> | FlowTransformInstruction<T>;

interface Flow<T> {
  id: number;
  event: T;
  instructions: FlowInstruction<T>[];
  logArgs: () => Flow<T>
  process: (step: FlowProcessStep<T>) => Flow<T>;
  validate: (step: FlowValidationStep<T>) => Flow<T>
  transform: (step: FlowTransformStep<T>) => Flow<T>;
  execute: () => void;
}

const logArgs: FlowProcessStep<unknown> = <T>(event: T, ...args: any[]) => {
  console.log(args);
};

export const FlowEngine = {
  createFlow<T>(event: T): Flow<T> {
    return {
      id: IDGenerator.next().value,
      event,
      instructions: [],
      logArgs() {
        this.instructions.push({
          flowStepType: FlowStepType.PROCESS,
          step: logArgs
        });
        return this;
      },
      process(step) {
        this.instructions.push({
          flowStepType: FlowStepType.PROCESS,
          step
        });
        return this;
      },
      validate(step) {
        this.instructions.push({
          flowStepType: FlowStepType.VALIDATION,
          step
        });
        return this;
      },
      transform(step) {
        this.instructions.push({
          flowStepType: FlowStepType.TRANSFORM,
          step
        });
        return this;
      },
      execute() {
        let args: any[] = [];
        this.instructions.every(instruction => {
          switch (instruction.flowStepType) {
          case FlowStepType.PROCESS:
            instruction.step(this.event, ...args);
            break;
          case FlowStepType.VALIDATION:
            return instruction.step(this.event, ...args);
          case FlowStepType.TRANSFORM:
            args = instruction.step(this.event, ...args);
            break;
          default:
            console.error(`flow step instruction doesn't belong to any type?? ${instruction}`);
          }

          return true;
        });
        console.log(`${this.id} flow finished`);
      }
    };
  },
};