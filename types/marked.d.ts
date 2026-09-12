declare module 'marked' {
  export type Token = { type: string; text?: string; lang?: string; [key: string]: unknown };

  export class Renderer {
    code: (code: string, infostring: string | undefined) => string;
  }

  export const marked: {
    parse: (src: string, options?: { renderer?: Renderer }) => string;
    lexer: (src: string) => Token[];
    Renderer: typeof Renderer;
  };
  export default marked;
}
