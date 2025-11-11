// cleanup ugly spaces which are A0
// how to print a character code: console.log("0x" + a.charCodeAt(0).toString(16));
// const cr = // 0x2028
// const nbsp = // 0xA0

export const filterReadable = t=>t
    .replace(/\xA0 /g, ' ') // nbsp
    .replace(/ \xA0/g, ' ')
    .replace(/\xA0/g, ' ')
    .replace(/\u2028/g, ' ')  // cr
    // .replace(/\r?\n|\r/, ' ')

export const filterReadableEsc = t=>t
    .replace(/\xA0/g, '&nbsp;') // nbsp
    .replace(/\u2028/g, '\n')  // cr
    // .replace(/\r?\n|\r/, ' ')

