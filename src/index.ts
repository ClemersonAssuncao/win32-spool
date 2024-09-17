import koffi from 'koffi';

// Load the DLL
const winspool = koffi.load('winspool.drv');

// Define a struct
koffi.struct('DOC_INFO_1', {
  pDocName: koffi.pointer('char16_t'),
  pOutputFile: koffi.pointer('char16_t'),
  pDatatype: koffi.pointer('char16_t'),
});

// Define functions
const OpenPrinter = winspool.func('OpenPrinterW','bool',['str16', '_Out_ uint64_t*', 'void*']);
const StartDocPrinter = winspool.func('StartDocPrinterW', 'int', ['uint64_t', 'int', 'DOC_INFO_1*']);
const WritePrinter = winspool.func('WritePrinter','int',['uint64_t', 'char16_t*', 'int', '_Out_ uint32_t*']);
const ClosePrinter = winspool.func('ClosePrinter','int', ['uint64_t']);

// Use the functions
async function imprimirRelatorio(printerName: string, conteudo: string) {
  const docInfo = {
    pDocName: 'Relatorio de Teste',
    pOutputFile: null,
    pDatatype: 'RAW',
  };

  const printerHandle = Buffer.alloc(8);
  const printerOpened = OpenPrinter(printerName, printerHandle, null);
  if (!printerOpened) {
    console.error('Erro ao abrir a impressora.', printerOpened);
    return;
  }

  try {
    const docStarted = StartDocPrinter(printerHandle.readBigUInt64LE(), 1, docInfo);
    if (docStarted <= 0) {
      console.error('Erro ao iniciar o documento.');
      ClosePrinter(printerHandle.readBigInt64LE());
      return;
    }
  } catch (error) {
    console.log(error);
  }

  const bufferRelatorio = Buffer.from(conteudo, 'utf16le');
  const bytesWritten = Buffer.alloc(4);
  const writeSuccess = WritePrinter(printerHandle.readBigUInt64LE(), bufferRelatorio, bufferRelatorio.length, bytesWritten);
  if (!writeSuccess) {
    console.error('Erro ao escrever na impressora.');
  } else {
    console.log('Relatório enviado para a fila de impressão com sucesso!');
  }

  ClosePrinter(printerHandle.readBigUInt64LE());
}

for (let i=0; i < 1; i++) {
    imprimirRelatorio('Betaprinter', 'teste conteudo');
}