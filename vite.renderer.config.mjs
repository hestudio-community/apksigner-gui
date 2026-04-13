import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import JavaScriptObfuscator from "javascript-obfuscator";

function createObfuscationPlugin() {
  return {
    name: "obfuscate-renderer",
    apply: "build",
    enforce: "post",
    renderChunk(code, chunk) {
      if (!chunk.fileName.endsWith(".js")) {
        return null;
      }
      const result = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: "hexadecimal",
        numbersToExpressions: true,
        renameGlobals: false,
        renameProperties: false,
        selfDefending: false,
        splitStrings: true,
        splitStringsChunkLength: 8,
        stringArray: true,
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false,
      });
      return {
        code: result.getObfuscatedCode(),
        map: null,
      };
    },
  };
}

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  return {
    plugins: isProd ? [vue(), createObfuscationPlugin()] : [vue()],
    build: {
      sourcemap: isProd ? false : true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
  };
});
