export interface DriverFunctions {
  [driverFunctionName: string]: {
    returnType: string;
    parameters: string[];
  };
}

export interface StructField {
  [fieldName: string]: string;
}

export interface StructDeclarations {
  [objectName: string]: StructField;
}
