function parseFlags(value: number, keys: any, options: { excludeFalse?: boolean } = {}): any {
  const flags = {};
  for (const flagName in keys) {
    // tslint:disable-next-line:no-bitwise
    if (value & keys[flagName]) {
      flags[flagName] = true;
    } else {
      if (!options.excludeFalse) {
        flags[flagName] = false;
      }
    }
  }
  return flags;
}

export { parseFlags };
