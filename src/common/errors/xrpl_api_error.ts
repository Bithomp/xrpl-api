import { inspect } from "util";
import { getConstructorName } from "./utils";

class XrplApiError extends Error {
  name: string;
  message: string;
  data?: any;

  constructor(message = "", data?: any) {
    super(message);

    this.name = getConstructorName(this) as string;
    this.message = message;
    this.data = data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toString() {
    let result = `[${this.name}(${this.message}`;
    if (this.data) {
      result += `, ${inspect(this.data)}`;
    }
    result += ")]";
    return result;
  }

  /* console.log in node uses util.inspect on object, and util.inspect allows
  us to customize its output:
  https://nodejs.org/api/util.html#util_custom_inspect_function_on_objects */
  inspect() {
    return this.toString();
  }
}

export { XrplApiError };
