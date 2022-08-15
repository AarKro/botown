import { IDGenerator } from "../utils.js";

enum FlowStepType {
  PROCESS,
  VALIDATION,
  TRANSFORM,
}

type FlowProcessStep<T> = (interaction: T, ...args: any[]) => void;

type FlowValidationStep<T> = (interaction: T, ...args: any[]) => boolean;

type FlowTransformStep<T> = (interaction: T, ...args: any[]) => any[];

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
  name: string;
  interaction: T;
  instructions: FlowInstruction<T>[];
  log: () => Flow<T>
  process: (step: FlowProcessStep<T>) => Flow<T>;
  validate: (step: FlowValidationStep<T>) => Flow<T>
  transform: (step: FlowTransformStep<T>) => Flow<T>;
  execute: () => void;
}

const log = (id: number, name: string, args: any[]) => {
  console.log(id, name, args);
};

export const FlowEngine = {
  createFlow<T>(name: string, interaction: T): Flow<T> {
    return {
      id: IDGenerator.next().value,
      name,
      interaction,
      instructions: [],
      log() {
        this.instructions.push({
          flowStepType: FlowStepType.PROCESS,
          step: (interaction, ...args) => log(this.id, this.name, args)
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
            instruction.step(this.interaction, ...args);
            break;
          case FlowStepType.VALIDATION:
            return instruction.step(this.interaction, ...args);
          case FlowStepType.TRANSFORM:
            args = instruction.step(this.interaction, ...args);
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