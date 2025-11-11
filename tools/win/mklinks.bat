rmdir /S /Q "node_modules/@ips"
mkdir "node_modules/@ips"
mklink /J "node_modules/@ips/app" S:\ips-packages\app
mklink /J "node_modules/@ips/react" S:\ips-packages\react
mklink /J "node_modules/@ips/typo" S:\ips-packages\typo
