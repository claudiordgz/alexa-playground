declare module 'which' {
  export interface WhichOptions {
    nothrow?: boolean;
    path?: string;
    pathExt?: string;
    all?: boolean;
  }

  export function sync(cmd: string, opt?: WhichOptions): string;
}
