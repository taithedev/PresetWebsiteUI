/* Run with: node --test tests/smoke.test.mjs
   Native Node test runner; no dependency install required. */
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve, dirname} from "node:path";
import vm from "node:vm";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const load=path=>readFileSync(resolve(root,path),"utf8");
const sourcePaths=[
  "assets/js/app.js","assets/js/vault.js","assets/js/zip.js",
  "assets/js/docs.js","assets/js/kit-interactions.js",
  "assets/data/buttons.js","assets/data/forms.js",
  "assets/data/navigation.js","assets/data/feedback.js",
  "assets/data/surfaces.js","assets/data/patterns.js"
];

test("all JavaScript files parse",()=>{
  for (const path of sourcePaths) assert.doesNotThrow(()=>new vm.Script(load(path),{filename:path}),path);
});

test("catalog has 30 components and 4 patterns with unique IDs",()=>{
  const window={PresetLibrary:[]};
  for(const path of sourcePaths.filter(name=>name.startsWith("assets/data/"))){
    vm.runInNewContext(load(path),{window},{filename:path});
  }
  const items=window.PresetLibrary;
  assert.equal(items.length,34);
  assert.equal(items.filter(c=>c.kind==="pattern").length,4);
  assert.equal(new Set(items.map(c=>c.id)).size,34);
  for(const item of items){
    assert.ok(item.id&&item.title&&item.description&&item.html&&item.category,item.id);
    assert.ok(item.html.length>10,item.id);
  }
  const manifest=JSON.parse(load("catalog/components.json"));
  assert.equal(manifest.components.length,items.length);
  assert.deepEqual(manifest.components.map(x=>x.id),items.map(x=>x.id));
});

test("index and docs reference existing local static assets",()=>{
  for(const file of ["index.html","docs/index.html","examples/dashboard/index.html","examples/sign-in/index.html"]){
    const html=load(file);
    for(const match of html.matchAll(/(?:src|href)="([^"#?]+)"/g)){
      const url=match[1];
      if(/^(https?:|mailto:|data:|#)/.test(url)||url.endsWith("/"))continue;
      const target=resolve(dirname(resolve(root,file)),url);
      assert.ok(existsSync(target),file+" references missing "+url);
    }
  }
});

test("package exports and machine-readable tokens remain valid",()=>{
  const pkg=JSON.parse(load("package.json"));
  const tokens=JSON.parse(load("design-tokens.json"));
  assert.equal(pkg.version,"2.0.0");
  assert.equal(tokens.catalog.components,30);
  assert.equal(tokens.catalog.patterns,4);
  for(const file of Object.values(pkg.exports))assert.ok(existsSync(resolve(root,file)),file);
});

test("ZIP writer makes a valid ZIP32 archive with central directory",async()=>{
  const context={window:{},TextEncoder,Blob,Uint8Array,DataView,Date};
  vm.runInNewContext(load("assets/js/zip.js"),context);
  const blob=await context.window.PresetZip.pack([{name:"hello.txt",data:"Preset UI"},{name:"sample/example.css",data:"a{}"}]);
  const bytes=new Uint8Array(await blob.arrayBuffer());
  const view=new DataView(bytes.buffer);
  assert.equal(view.getUint32(0,true),0x04034b50);
  assert.equal(view.getUint32(bytes.length-22,true),0x06054b50);
  assert.equal(view.getUint16(bytes.length-12,true),2);
  assert.equal(blob.type,"application/zip");
});
