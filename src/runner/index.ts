import koffi from 'koffi';
import type { IKoffiLib } from 'koffi';
import { DriverFunctions, StructDeclarations } from './types';


export class DriverAPI {

  protected logger = console;
  protected driverName: string;
  [key: string]: any;

  constructor(driverName: string, driverFunction: DriverFunctions, structDeclarations?: StructDeclarations) {
    this.logger.debug(`Loading driver ${driverName}`);

    this.driverName = driverName;
    const driver = koffi.load(driverName);

    if (!driver) {
      this.logger.error(`Error loading driver ${driverName}`);
      return;
    }

    if (structDeclarations) {
      this.loadStructs(structDeclarations);
    }

    this.loadFunctions(driver, driverFunction);
  }

  private loadStructs(structDeclarations: StructDeclarations): void {
    if (typeof structDeclarations === 'object') {
      for (const structName in structDeclarations) {
        const structFields = structDeclarations[structName];
        try {
          koffi.struct(structName, structFields);
          this.logger.debug(`Loaded ${structName} struct`, structFields);
        }	catch (error) {
          this.logger.error(`Error loading ${structName} struct:`, error);
        }
      }
    }
  }

  private loadFunctions(driver: IKoffiLib, driverFunction: DriverFunctions): void {
    for (const spoolFunction in driverFunction) {
      const { parameters, returnType } = driverFunction[spoolFunction];
      try {
        this[spoolFunction] = driver.func(spoolFunction, returnType, parameters);
        this.logger.debug(`Loaded ${ this.driverName } ${spoolFunction} function`, {
          parameters,
          returnType,
        });
      }	catch (error) {
        this[spoolFunction] = () => this.notImplementedError(spoolFunction);
        this.logger.error(`Error loading ${ this.driverName } ${spoolFunction} function:`, {
          error,
          parameters,
          returnType,
        });
      }
    }
  }

  protected notImplementedError(methodName: string): void {
    this.logger.error(`Method ${methodName} not implemented.`);
  }
}
