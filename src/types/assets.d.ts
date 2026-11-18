/// <reference types="vite/client" />

declare module 'sql.js/dist/sql-wasm.js' {
  import initSqlJs from 'sql.js';
  export default initSqlJs;
}

declare module 'sql.js/dist/sql-wasm.wasm?url' {
  const url: string;
  export default url;
}
