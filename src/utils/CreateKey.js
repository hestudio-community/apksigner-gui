import path from "node:path";
import fs from "node:fs";

export function CheckJavaHome() {
  const javaHome = process.env.JAVA_HOME;
  if (!javaHome) {
    return false;
  }
  let javaPath;
  let keytoolPath;
  if (process.platform == "win32") {
    javaPath = path.join(javaHome, "bin", "java.exe");
    keytoolPath = path.join(process.env.JAVA_HOME, "bin", "keytool.exe");
  } else {
    javaPath = path.join(javaHome, "bin", "java");
    keytoolPath = path.join(process.env.JAVA_HOME, "bin", "keytool");
  }
  return fs.existsSync(javaPath) && fs.existsSync(keytoolPath);
}

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
  sigalg
) {
  let keytoolPath;
  if (process.platform == "win32") {
    keytoolPath = path.join(process.env.JAVA_HOME, "bin", "keytool.exe");
  } else {
    keytoolPath = path.join(process.env.JAVA_HOME, "bin", "keytool");
  }
  if (!fs.existsSync(keytoolPath)) {
    throw new Error(
      "Java keytool not found. Please ensure JAVA_HOME is set correctly."
    );
  }

  const args = [
    "-genkeypair",
    "-v",
    "-keystore", keyPath,
    "-storepass", keyPasswd,
    "-alias", alias,
    "-keypass", aliasPasswd,
    "-validity", expireDay,
    "-dname", `CN=${name}, OU=${orgUnit}, O=${org}, L=${locality}, ST=${state}, C=${country}`,
    "-keyalg", keyalg,
    "-keysize", keysize,
    "-sigalg", sigalg
  ];

  const { spawnSync } = require("child_process");
  try {
    const result = spawnSync(keytoolPath, args, { stdio: "inherit" });
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(`Keytool process exited with code ${result.status}`);
    }
    return true;
  } catch (error) {
    throw new Error(`Failed to create key: ${error.message}`);
  }
}
