import { alwaysFalse, IDGenerator, noop } from "../utils.js";

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
  validator: FlowValidator<T>;
}

interface FlowTransformInstruction<T> {
  flowStepType: FlowStepType.TRANSFORM;
  step: FlowTransformStep<T>;
}

type FlowInstruction<T> = FlowProcessInstruction<T> | FlowValidationInstruction<T> | FlowTransformInstruction<T>;

interface FlowValidator<T> {
  step: FlowValidationStep<T>;
  valid: FlowProcessStep<T>;
  invalid: FlowProcessStep<T>;
  inverse: boolean;
  check: (step: FlowValidationStep<T>) => FlowValidator<T>;
  not: () => FlowValidator<T>;
  onValid: (step: FlowProcessStep<T>) => FlowValidator<T>;
  onInvalid: (step: FlowProcessStep<T>) => FlowValidator<T>;
}

const createFlowValidator = <T>(): FlowValidator<T> => {
  return {
    step: alwaysFalse,
    valid: noop,
    invalid: noop,
    inverse: false,
    check(step) {
      this.step = step;
      return this;
    },
    not() {
      this.inverse = !this.inverse;
      return this;
    },
    onValid(step) {
      this.valid = step;
      return this;
    },
    onInvalid(step) {
      this.invalid = step;
      return this;
    }
  };
};

interface Flow<T> {
  id: number;
  name: string;
  interaction: T;
  instructions: FlowInstruction<T>[];
  log: () => Flow<T>
  process: (step: FlowProcessStep<T>) => Flow<T>;
  validate: (builder: (flowValidator: FlowValidator<T>) => FlowValidator<T>) => Flow<T>
  transform: (step: FlowTransformStep<T>) => Flow<T>;
  execute: () => void;
}

const log = <T>(interaction: T, id: number, name: string, args: any[]) => {
  console.log((interaction as any).client?.user?.username, id, name, args);
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
          step: (interaction, ...args) => log(interaction, this.id, this.name, args)
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
      validate(builder) {
        this.instructions.push({
          flowStepType: FlowStepType.VALIDATION,
          validator: builder(createFlowValidator())
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
        console.log("------------------------------");
        console.log(`${this.id} ${this.name} flow started`);

        let args: any[] = [];
        this.instructions.every(instruction => {
          switch (instruction.flowStepType) {
          case FlowStepType.PROCESS:
            instruction.step(this.interaction, ...args);
            break;
          case FlowStepType.TRANSFORM:
            args = instruction.step(this.interaction, ...args);
            break;
          case FlowStepType.VALIDATION:
            const result = instruction.validator.step(this.interaction, ...args);
            const isValid = instruction.validator.inverse ? !result : result;

            if (isValid){
              instruction.validator.valid(this.interaction, ...args);
            } else {
              instruction.validator.invalid(this.interaction, ...args);
            }

            return isValid;
          default:
            console.error(`flow step instruction doesn't belong to any type?? ${instruction}`);
          }

          return true;
        });

        console.log(`${this.id} ${this.name} flow finished`);
      }
    };
  },
};