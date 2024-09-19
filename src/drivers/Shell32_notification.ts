
import { DriverAPI } from '../runner';
import { DriverFunctions, StructDeclarations } from '../runner/types';

const DRIVER_NAME = 'shell32';

const ShellNotificationStruct: StructDeclarations = {
  NOTIFYICONDATA: {
    cbSize: 'uint32_t',
    hWnd: 'uint32_t',
    uID: 'uint32_t',
    uFlags: 'uint32_t',
    uCallbackMessage: 'uint32_t',
    hIcon: 'uint32_t',
    szTip: 'str16',
    dwState: 'uint32_t',
    dwStateMask: 'uint32_t',
    szInfo: 'str16',
    uTimeoutOrVersion: 'uint32_t',
    szInfoTitle:'str16',
    dwInfoFlags: 'uint32_t',
    guidItem: 'str16',
    hBalloonIcon: 'uint32_t',
  },
};

const ShellNotificationFunctions: DriverFunctions = {
  Shell_NotifyIcon: {
      parameters: ['uint32_t', 'NOTIFYICONDATA*'],
      returnType: 'bool',
    },
};

const NIM_ADD = 0x00000000;
// const NIM_MODIFY = 0x00000001;
// const NIM_DELETE = 0x00000002;
const NIF_MESSAGE = 0x00000001;
const NIF_ICON = 0x00000002;
const NIF_TIP = 0x00000004;
const NIF_INFO = 0x00000010;


export class ShellNotification extends DriverAPI {

  protected logger = console;

  constructor() {
    super(DRIVER_NAME, ShellNotificationFunctions, ShellNotificationStruct);
  }
  

  notify(){
    const notifyIconData = {
      cbSize: 1,
      hWnd: 0,
      uID: 1,
      uFlags: NIF_MESSAGE | NIF_ICON | NIF_TIP | NIF_INFO,
      uCallbackMessage: 0,
      hIcon: 0,
      szTip: 'Notification',
      dwState: 0,
      dwStateMask: 0,
      szInfo: 'testando 123123',
      uTimeoutOrVersion: 10000,
      szInfoTitle: 'Titulo',
      dwInfoFlags: 0,
      guidItem: '',
      hBalloonIcon: 0,
    };

    const result = this.Shell_NotifyIcon(NIF_MESSAGE, notifyIconData);
    if (!result) {
      this.logger.error('Failed to show notification.');
    } else {
      this.logger.log('Notification shown successfully.', result);
    }
  }

}
