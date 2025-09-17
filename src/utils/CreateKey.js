import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

function CheckJavaHome(javapath) {
  if (javapath) {
    try {
      if (!fs.existsSync(javapath)) {
        return false;
      }
      const javaBinDir = path.dirname(javapath);
      let keytoolPath;
      if (process.platform === "win32") {
        keytoolPath = path.join(javaBinDir, "keytool.exe");
      } else {
        keytoolPath = path.join(javaBinDir, "keytool");
      }
      if (!fs.existsSync(keytoolPath)) {
        return false;
      }
      const result = spawnSync(keytoolPath, ["-version"], { stdio: "pipe" });
      return result.status === 0;
    } catch (error) {
      return false;
    }
  }
  const javaHome = process.env.JAVA_HOME;
  if (!javaHome || !fs.existsSync(javaHome)) {
    try {
      const result = spawnSync("keytool", ["-version"], { stdio: "pipe" });
      if (result.status === 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  } else {
    let javaPath;
    let keytoolPath;
    if (process.platform == "win32") {
      javaPath = path.join(javaHome, "bin", "java.exe");
      keytoolPath = path.join(javaHome, "bin", "keytool.exe");
    } else {
      javaPath = path.join(javaHome, "bin", "java");
      keytoolPath = path.join(javaHome, "bin", "keytool");
    }
    return fs.existsSync(javaPath) && fs.existsSync(keytoolPath);
  }
}
export { CheckJavaHome };

export function CreateKey(
  keyPath,
  keyPasswd,
  alias,
  aliasPasswd,
  expireDay,
  name,
  org,
  orgUnit,
  locality,
  state,
  country,
  keyalg,
  keysize,
  sigalg,
) {
  let keytoolPath;
  if (fs.existsSync(process.env.JAVA_HOME)) {
    if (process.platform == "win32") {
      keytoolPath = path.join(process.env.JAVA_HOME, "bin", "keytool.exe");
    } else {
      keytoolPath = path.join(process.env.JAVA_HOME, "bin", "keytool");
    }
  }
  if (!fs.existsSync(keytoolPath)) {
    try {
      const result = spawnSync("keytool", ["-version"], { stdio: "pipe" });
      if (result.status === 0) {
        keytoolPath = "keytool";
      } else {
        return "keytool is not found, make sure to add Java's bin directory to the PATH or set JAVA_HOME.";
      }
    } catch (error) {
      return "keytool is not found, make sure to add Java's bin directory to the PATH or set JAVA_HOME.";
    }
  }

  const args = [
    "-genkeypair",
    "-v",
    "-keystore",
    keyPath,
    "-storepass",
    keyPasswd,
    "-alias",
    alias,
    "-keypass",
    aliasPasswd,
    "-validity",
    expireDay,
    "-dname",
    `CN=${name}, OU=${orgUnit}, O=${org}, L=${locality}, ST=${state}, C=${country}`,
    "-keyalg",
    keyalg,
    "-keysize",
    keysize,
    "-sigalg",
    sigalg,
  ];

  try {
    const result = spawnSync(keytoolPath, args, { stdio: "pipe" });
    if (result.error) {
      return result.error.message;
    }
    if (result.status !== 0) {
      const errorOutput =
        result.stderr?.toString() || result.stdout?.toString() || "";
      return `Keytool process exited with code ${result.status}${
        errorOutput ? ": " + errorOutput : ""
      }`;
    }
    return true;
  } catch (error) {
    return error.message;
  }
}
