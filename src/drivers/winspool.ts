
import { DriverAPI } from '../runner';
import { DriverFunctions, StructDeclarations } from '../runner/types';

const DRIVER_NAME = 'winspool.drv';

const WinspoolStruct: StructDeclarations = {
  DOC_INFO_1: {
    pDocName: 'str16',
    pOutputFile: 'str16',
    pDatatype: 'str16',
  },
};

const WinspoolFunctions: DriverFunctions = {
  ClosePrinter: {
    parameters: ['uint64_t'],
    returnType: 'int',
  },
  OpenPrinterW: {
    parameters: ['char16_t*', '_Out_ uint64_t*', 'void*'],
    returnType: 'bool',
  },
  StartDocPrinterW: {
    parameters: ['uint64_t', 'int', 'DOC_INFO_1*'],
    returnType: 'int',
  },
  WritePrinter: {
    parameters: ['uint64_t', 'char16_t*', 'int', '_Out_ uint64_t*'],
    returnType: 'int',
  },
};

export class Winspool extends DriverAPI {

  protected logger = console;

  constructor() {
    super(DRIVER_NAME, WinspoolFunctions, WinspoolStruct);
  }

  public printTextOnly(printerName: string, data: Buffer): boolean {
    const docInfo = {
      pDatatype: 'RAW',
      pDocName: 'Tasy Native - print label',
      pOutputFile: null,
    };

    const printerHandle = Buffer.alloc(8);
    const printerOpened = this.OpenPrinterW(printerName, printerHandle, null);
    if (!printerOpened) {
      this.logger.error('Error opening printer:', printerName);
      return false;
    }

    this.logger.debug('Opened printer');

    try {
      const docStarted = this.StartDocPrinterW(printerHandle.readBigUInt64LE(), 1, docInfo);
      if (docStarted <= 0) {
        this.logger.error('Error start document printer.');
        this.ClosePrinter(printerHandle.readBigUInt64LE());
        return false;
      }
      this.logger.error('Started document printer.');
    } catch (error) {
      this.logger.error('Error start document printer:', error);
      return false;
    }

    const bytesWritten = Buffer.alloc(8);
    const writeSuccess = this.WritePrinter(printerHandle.readBigUInt64LE(), data, data.length, bytesWritten);

    if (writeSuccess) {
      this.logger.debug('Document sent to printer spool.', bytesWritten);
    } else {
      this.logger.error('Error to send document to printer spool.', bytesWritten);
      return false;
    }

    this.ClosePrinter(printerHandle.readBigUInt64LE());
    return true;
  }
}
