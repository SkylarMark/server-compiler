import { glob } from "glob";
import { checkOutDir, compileCode } from "./compiler";

function processFile(filePath: string) {
  console.log(`Processing file: ${filePath}`);
  checkOutDir();
  console.log(`Processing file: ${filePath}`);
  compileCode(filePath);
}

async function readTypeScriptFiles() {
  const files = await glob("./test/**/*.ts");
  files.forEach(processFile);
  console.log("Compilation successful");
}

readTypeScriptFiles();
