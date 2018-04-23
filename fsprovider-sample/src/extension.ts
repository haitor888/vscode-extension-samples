'use strict';

import * as vscode from 'vscode';
import { MemFS } from './fileSystemProvider';

export function activate(context: vscode.ExtensionContext) {

    const memFs = new MemFS();
    const registration = vscode.workspace.registerFileSystemProvider2('memfs', memFs, { isCaseSensitive: true });

    let initialzied = false;
    vscode.commands.registerCommand('memfs.init', _ => {
        if (!initialzied) {
            initialzied = true;

            memFs.createDirectory(vscode.Uri.parse(`memfs:/folder/`));
            memFs.createDirectory(vscode.Uri.parse(`memfs:/large/`));
            memFs.createDirectory(vscode.Uri.parse(`memfs:/xyz/`));
            memFs.createDirectory(vscode.Uri.parse(`memfs:/xyz/abc`));
            memFs.createDirectory(vscode.Uri.parse(`memfs:/xyz/def`));

            memFs.writeFile(vscode.Uri.parse(`memfs:/empty.txt`), new Uint8Array(0), { create: true });
            memFs.writeFile(vscode.Uri.parse(`memfs:/file.txt`), Buffer.from('foo'), { create: true });
            memFs.writeFile(vscode.Uri.parse(`memfs:/file.css`), Buffer.from('* { color: green; }'), { create: true });
            memFs.writeFile(vscode.Uri.parse(`memfs:/large/rnd.foo`), randomData(30000), { create: true });
            memFs.writeFile(vscode.Uri.parse(`memfs:/large/too_large.foo`), randomData(50000), { create: true });
            memFs.writeFile(vscode.Uri.parse(`memfs:/folder/empty.foo`), new Uint8Array(0), { create: true });
            memFs.writeFile(vscode.Uri.parse(`memfs:/folder/file.ts`), Buffer.from('let a:number = true; console.log(a);'), { create: true });
            memFs.writeFile(vscode.Uri.parse(`memfs:/xyz/def/foo.md`), Buffer.from('*MemFS*'), { create: true });
            memFs.writeFile(vscode.Uri.parse(`memfs:/xyz/def/foo.bin`), Buffer.from([0, 0, 0, 1, 7, 0, 0, 1, 1]), { create: true });

            memFs.writeFile(vscode.Uri.parse(`memfs:/UPPER.txt`), Buffer.from('UPPER'), { create: true });
            memFs.writeFile(vscode.Uri.parse(`memfs:/upper.txt`), Buffer.from('upper'), { create: true });
        }
    });

    function randomData(lineCnt: number, lineLen = 155): Buffer {
        let lines: string[] = [];
        for (let i = 0; i < lineCnt; i++) {
            let line = '';
            while (line.length < lineLen) {
                line += Math.random().toString(2 + (i % 34)).substr(2);
            }
            lines.push(line.substr(0, lineLen));
        }
        return Buffer.from(lines.join('\n'), 'utf8');
    }

    context.subscriptions.push(registration);
}
