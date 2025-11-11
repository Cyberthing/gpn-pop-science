import {exec} from 'child_process';

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36';

export const downloadFile = (output, url) =>
  new Promise((resolve, reject) => {
    // trace('downloadFile', output, url)
    let cmd = `wget --user-agent="${userAgent}" --no-check-certificate --no-verbose -O "${output}" "${url}"`;
    let child = exec(cmd, function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      // if (stderr !== null) {
      //   console.log('exec error: ' + error);
      // }
      if (error) {
        reject(error);
      } else {
        resolve(output);
      }
    });
  });

export default downloadFile