function getConstructorName(object: object): string | undefined {
  if (object.constructor.name) {
    return object.constructor.name;
  }
  // try to guess it on legacy browsers (ie)
  const constructorString = object.constructor.toString();
  const functionConstructor = constructorString.match(/^function\s+([^(]*)/);
  const classConstructor = constructorString.match(/^class\s([^\s]*)/);

  if (functionConstructor) {
    return functionConstructor[1];
  } else if (classConstructor) {
    return classConstructor[1];
  }

  return undefined;
}

export { getConstructorName };
