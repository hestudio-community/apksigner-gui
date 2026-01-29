import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { _log } from "./log";

const logger = new _log("SignAPK");

/**
 * Sign an APK file using apksigner
 * @param {Object} options - Signing options
 * @param {string} options.apkPath - APK file path (temporary path)
 * @param {string} options.outputPath - Output path
 * @param {boolean} options.overwrite - Whether to overwrite the original file
 * @param {string} options.keystore - Keystore path
 * @param {string} options.keyAlias - Key alias
 * @param {string} options.keyPassword - Key password
 * @param {string} options.apksignerPath - apksigner tool path
 * @param {number} [options.minSdkVersion] - Minimum SDK version
 * @param {number} [options.maxSdkVersion] - Maximum SDK version
 * @param {boolean} [options.v1SigningEnabled] - V1 signing enabled
 * @param {boolean} [options.v2SigningEnabled] - V2 signing enabled
 * @param {boolean} [options.v3SigningEnabled] - V3 signing enabled
 * @param {boolean} [options.v4SigningEnabled] - V4 signing enabled
 * @param {boolean} [options.useZipalign] - Whether to use zipalign
 * @param {string} [options.zipalignPath] - zipalign tool path
 * @param {number} [options.pageSize] - Page size (4/16/64)
 * @param {boolean} [options.useZopfli] - Whether to use Zopfli compression
 * @returns {Promise<string>} Promise that resolves with stdout or rejects with error
 */
export function SignAPK(options) {
  logger.startload("SignAPK");

  return new Promise((resolve, reject) => {
    // Validate required parameters
    if (!options.apksignerPath || !fs.existsSync(options.apksignerPath)) {
      logger.endload("SignAPK");
      logger.warn("apksigner tool not found");
      reject("apksigner tool not found");
      return;
    }

    if (!options.apkPath || !fs.existsSync(options.apkPath)) {
      logger.endload("SignAPK");
      logger.warn("APK file not found");
      reject("APK file not found");
      return;
    }

    // If zipalign is enabled, validate zipalign path
    if (options.useZipalign) {
      if (!options.zipalignPath || !fs.existsSync(options.zipalignPath)) {
        logger.endload("SignAPK");
        logger.warn("zipalign tool not found");
        reject("zipalign tool not found");
        return;
      }
    }

    // If zipalign is enabled, execute zipalign first, then sign
    if (options.useZipalign) {
      executeZipalign(options)
        .then((zipalignedPath) => {
          // Update apkPath to the zipaligned file
          const zipalignedOptions = { ...options, apkPath: zipalignedPath };
          return executeApksigner(zipalignedOptions);
        })
        .then((stdout) => {
          logger.endload("SignAPK");
          resolve(stdout);
        })
        .catch((error) => {
          logger.endload("SignAPK");
          logger.warn(error);
          reject(error);
        });
    } else {
      // Execute apksigner directly
      executeApksigner(options)
        .then((stdout) => {
          logger.endload("SignAPK");
          resolve(stdout);
        })
        .catch((error) => {
          logger.endload("SignAPK");
          logger.warn(error);
          reject(error);
        });
    }
  });
}

/**
 * Execute zipalign on the APK file
 * @param {Object} options - Zipalign options
 * @returns {Promise<string>} Promise that resolves with the zipaligned file path
 */
function executeZipalign(options) {
  return new Promise((resolve, reject) => {
    const zipalignedPath = `${options.apkPath}_zipalign.apk`;

    const args = [
      "-v",
      "-P",
      options.pageSize.toString(),
      "-f",
    ];

    // Add Zopfli compression flag if enabled
    if (options.useZopfli) {
      args.push("-z");
    }

    args.push("4", options.apkPath, zipalignedPath);

    logger.info(`Executing zipalign: ${options.zipalignPath} ${args.join(" ")}`);

    const zipalignProcess = spawn(options.zipalignPath, args);
    let stdout = "";
    let stderr = "";

    zipalignProcess.stdout.on("data", (data) => {
      const output = data.toString();
      stdout += output;
      logger.info(output);
    });

    zipalignProcess.stderr.on("data", (data) => {
      const output = data.toString();
      stderr += output;
      logger.warn(output);
    });

    zipalignProcess.on("error", (error) => {
      reject(`Zipalign process error: ${error.message}`);
    });

    zipalignProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Zipalign process exited with code ${code}: ${stderr || stdout}`);
      } else {
        logger.info(`Zipalign completed successfully`);
        resolve(zipalignedPath);
      }
    });
  });
}

/**
 * Execute apksigner to sign the APK
 * @param {Object} options - Signing options
 * @returns {Promise<string>} Promise that resolves with stdout
 */
function executeApksigner(options) {
  return new Promise((resolve, reject) => {
    const args = buildApksignerCommand(options);

    logger.info(`Executing apksigner: ${options.apksignerPath} ${maskSensitiveArgs(args)}`);

    const apksignerProcess = spawn(options.apksignerPath, args);
    let stdout = "";
    let stderr = "";

    apksignerProcess.stdout.on("data", (data) => {
      const output = data.toString();
      stdout += output;
      logger.info(output);
    });

    apksignerProcess.stderr.on("data", (data) => {
      const output = data.toString();
      stderr += output;
      logger.warn(output);
    });

    apksignerProcess.on("error", (error) => {
      reject(`Apksigner process error: ${error.message}`);
    });

    apksignerProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Apksigner process exited with code ${code}: ${stderr || stdout}`);
      } else {
        logger.info(`Apksigner completed successfully`);
        resolve(stdout + stderr);
      }
    });
  });
}

/**
 * Build apksigner command arguments
 * @param {Object} options - Signing options
 * @returns {Array<string>} Command arguments array
 */
function buildApksignerCommand(options) {
  const args = [
    "sign",
    "-v",
    "--ks",
    options.keystore,
    "--ks-key-alias",
    options.keyAlias,
    "--ks-pass",
    `pass:${options.keyPassword}`,
  ];

  // Add min SDK version if specified
  if (options.minSdkVersion !== undefined && options.minSdkVersion !== null) {
    args.push("--min-sdk-version", options.minSdkVersion.toString());
  }

  // Add max SDK version if specified
  if (options.maxSdkVersion !== undefined && options.maxSdkVersion !== null) {
    args.push("--max-sdk-version", options.maxSdkVersion.toString());
  }

  // Add signing scheme options if specified
  if (options.v1SigningEnabled !== undefined) {
    args.push("--v1-signing-enabled", options.v1SigningEnabled.toString());
  }

  if (options.v2SigningEnabled !== undefined) {
    args.push("--v2-signing-enabled", options.v2SigningEnabled.toString());
  }

  if (options.v3SigningEnabled !== undefined) {
    args.push("--v3-signing-enabled", options.v3SigningEnabled.toString());
  }

  if (options.v4SigningEnabled !== undefined) {
    args.push("--v4-signing-enabled", options.v4SigningEnabled.toString());
  }

  // Add output path
  args.push("--out", options.outputPath);

  // Add input APK path
  args.push(options.apkPath);

  return args;
}

/**
 * Mask sensitive information in command arguments for logging
 * @param {Array<string>} args - Command arguments
 * @returns {string} Masked command string safe for logging
 */
function maskSensitiveArgs(args) {
  const masked = [...args];

  // Find --ks-pass argument and mask the password
  const ksPassIndex = masked.indexOf("--ks-pass");
  if (ksPassIndex !== -1 && ksPassIndex + 1 < masked.length) {
    const passArg = masked[ksPassIndex + 1];
    // Replace password with asterisks, keeping "pass:" prefix
    if (passArg.startsWith("pass:")) {
      masked[ksPassIndex + 1] = "pass:***";
    }
  }

  return masked.join(" ");
}
