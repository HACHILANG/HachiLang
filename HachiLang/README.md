To developer...
before publishing fix the following temps.

in src/lib/files, make sure to change 
```js
async function Import(file, name){

  if(file.includes('.lnk')){
    if(fs.existsSync("LinkLang/src/lib/packages/"+file)){
      await RequireModule("LinkLang/src/lib/packages/"+file, name);
    } else {
      await RequireModule(file, name);
    }
  }
}
```
to
```js
async function Import(file, name){

  if(file.includes('.lnk')){
    if(fs.existsSync("/LinkLang/src/lib/packages/"+file)){
      await RequireModule("/LinkLang/src/lib/packages/"+file, name);
    } else {
      await RequireModule(file, name);
    }
  }
}
```
this just helps with the dir location
