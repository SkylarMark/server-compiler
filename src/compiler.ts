import { Output, transform } from "@swc/core";
import { basename, dirname, extname, join, sep } from "path";
import {
  existsSync,
  mkdir,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";

const DEFAULT_OUT_DIR = "./dist";
const DEFAULT_CONFIG_FILE = ".swcrc";

export function checkOutDir(): void {
  if (!directoryExists(DEFAULT_OUT_DIR)) {
    mkdir(DEFAULT_OUT_DIR, (error) => {});
  }

  rmSync(DEFAULT_OUT_DIR, { recursive: true, force: true });
}

function writeFile(path: string, data: string) {
  ensureDirectoryExists(path);
  writeFileSync(path, data, {
    encoding: "utf-8",
  });
}

function writeCompiledFile(filePath: string, result: Output) {
  const directory = removePathSegment(dirname(filePath), "test");
  const fileName = changeExtension(filePath, ".js");
  const mapName = changeExtension(filePath, ".map.js");
  const outPath = join(DEFAULT_OUT_DIR, directory, fileName);

  writeFile(outPath, result.code);

  if (result.map) {
    const mapOutputPath = join(DEFAULT_OUT_DIR, directory, mapName);
    writeFile(mapOutputPath, result.map);
  }
}

function removePathSegment(filePath: string, segmentToRemove: string): string {
  const segments = filePath.split(sep); // Split the file path into segments
  const updatedSegments = segments.filter(
    (segment) => segment !== segmentToRemove
  ); // Remove the specified segment

  // Reconstruct the file path with the updated segments
  const updatedFilePath = updatedSegments.join(sep);

  return updatedFilePath;
}

function changeExtension(filePath: string, newExtension: string) {
  const fileName = basename(filePath, extname(filePath)); // Get the current filename without extension
  const newFileName = fileName + newExtension;
  return newFileName;
}

export function directoryExists(directoryPath: string): boolean {
  try {
    // Use fs.statSync to check if the path points to a directory
    const stats = statSync(directoryPath);
    return stats.isDirectory();
  } catch (error) {
    // An error is thrown if the directory does not exist
    return false;
  }
}

function ensureDirectoryExists(filePath: string) {
  const path = dirname(filePath);
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

async function compile(code: string, fileName: string) {
  return await transform(code, {
    filename: fileName,
    sourceMaps: true,
    isModule: true,
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: false,
        decorators: true,
        dynamicImport: false,
      },
      transform: {},
    },
  });
}

export async function compileCode(filePath: string) {
  try {
    const code = readFileSync(filePath, "utf-8");
    const result = await compile(code, basename(filePath));

    writeCompiledFile(filePath, result);
  } catch (error) {
    console.error("Compilation failed:", error);
    // You can exit the process here or take other actions based on the error.
  }
}
