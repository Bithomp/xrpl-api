export interface HookExecutionObjectInterface {
  HookExecution: HookExecutionInterface;
}

export interface HookExecutionInterface {
  HookAccount: string;
  HookEmitCount: number;
  HookExecutionIndex: number;
  HookHash: string;
  HookInstructionCount: string;
  HookResult: number;
  HookReturnCode: string;
  HookReturnString: string;
  HookStateChangeCount: number;
}
