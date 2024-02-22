import { HookExecutionInterface } from "../../types/hooks";

interface FormattedHooksExecutionInterface {
  account: string;
  emitCount: number;
  executionIndex: number;
  hash: string;
  instructionCount: string;
  result: number;
  returnCode: string;
  returnString: string;
  stateChangeCount: number;
}

export function parseHooksExecutions(tx: any): FormattedHooksExecutionInterface[] | undefined {
  return new HooksExecutions(tx).call();
}

// "HookExecutions": [
//   {
//       "hookExecution": {
//           "HookAccount": "r4FRPZbLnyuVeGiSi1Ap6uaaPvPXYZh1XN",
//           "HookEmitCount": 0,
//           "HookExecutionIndex": 0,
//           "HookHash": "5EDF6439C47C423EAC99C1061EE2A0CE6A24A58C8E8A66E4B3AF91D76772DC77",
//           "HookInstructionCount": "28f",
//           "HookResult": 3,
//           "HookReturnCode": "d7",
//           "HookReturnString": "476F7665726E616E63653A20536574757020636F6D706C65746564207375636365737366756C6C792E00",
//           "HookStateChangeCount": 14
//       }
//   }
// ],

class HooksExecutions {
  tx: any;
  executions: FormattedHooksExecutionInterface[];

  constructor(tx: any) {
    this.tx = tx;
    this.executions = [];
  }

  call(): FormattedHooksExecutionInterface[] | undefined {
    const hookExecutions = this.tx.meta.HookExecutions;
    if (!hookExecutions) {
      return undefined;
    }

    for (const execution of hookExecutions) {
      if (execution.HookExecution) {
        this.executions.push(this.parseHookExecution(execution.HookExecution));
      }
    }

    if (this.executions.length === 0) {
      return undefined;
    }

    return this.executions;
  }

  parseHookExecution(hookExecution: HookExecutionInterface): FormattedHooksExecutionInterface {
    let hookReturnString = Buffer.from(hookExecution.HookReturnString, "hex");

    // remove trailing null bytes
    hookReturnString = hookReturnString.subarray(0, hookReturnString.indexOf(0x00));

    return {
      account: hookExecution.HookAccount,
      emitCount: hookExecution.HookEmitCount,
      executionIndex: hookExecution.HookExecutionIndex,
      hash: hookExecution.HookHash,
      instructionCount: hookExecution.HookInstructionCount,
      result: hookExecution.HookResult,
      returnCode: hookExecution.HookReturnCode,
      returnString: hookReturnString.toString("utf-8"),
      stateChangeCount: hookExecution.HookStateChangeCount,
    };
  }
}
