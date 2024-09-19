import { ShellNotification } from "./drivers/Shell32_notification";
import { Winspool } from "./drivers/winspool";

// const shell = new ShellNotification();

// console.log(shell.notify())

const winSpool = new Winspool();

for (let i = 0; i < 1; i++) {
  
  winSpool.printTextOnly('Betaprinter', Buffer.from('Hello World!'));
}
