import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const FONT_EXTENSIONS = new Set([
  ".ttf",
  ".ttc",
  ".otf",
  ".otc",
  ".dfont",
  ".woff",
  ".woff2",
]);

const CACHE_DURATION = 5 * 60 * 1000;
let cachedFonts = null;
let cacheTimestamp = 0;

function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { maxBuffer: 32 * 1024 * 1024, windowsHide: true },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout, stderr });
      },
    );
  });
}

function cleanupFamilyValue(value) {
  if (!value) {
    return null;
  }
  const withoutExtension = String(value)
    .replace(/\.(ttf|otf|ttc|otc|dfont|woff2?|pcf)$/i, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .trim();
  if (!withoutExtension) {
    return null;
  }
  return withoutExtension.replace(/\s+/g, " ").trim();
}

function formatFontLabel(value) {
  const cleaned = cleanupFamilyValue(value);
  if (!cleaned) {
    return null;
  }
  const replaced = cleaned
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
  if (!replaced) {
    return cleaned;
  }
  const words = replaced.split(" ").map((word) => {
    if (/^[A-Za-z]+$/.test(word)) {
      if (/^[A-Z]+$/.test(word)) {
        return word;
      }
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    }
    return word;
  });
  return words.join(" ");
}

function normalizeFontIdentifier(value) {
  const cleaned = cleanupFamilyValue(value);
  if (!cleaned) {
    return null;
  }
  return cleaned.toLowerCase().replace(/[\s_-]+/g, "");
}

function buildFontEntries(fonts) {
  const dedupe = new Map();
  for (const item of fonts) {
    let rawValue = null;
    let presetLabel = null;
    if (item && typeof item === "object") {
      if (typeof item.value === "string") {
        rawValue = item.value;
      } else if (typeof item.postScript === "string") {
        rawValue = item.postScript;
      }
      if (typeof item.label === "string") {
        presetLabel = item.label;
      }
    } else if (typeof item === "string") {
      rawValue = item;
    }
    if (!rawValue) {
      continue;
    }
    const value = cleanupFamilyValue(rawValue);
    if (!value) {
      continue;
    }
    const key = normalizeFontIdentifier(value);
    if (!key) {
      continue;
    }
    const label =
      (presetLabel && presetLabel.trim()) || formatFontLabel(value) || value;
    const existing = dedupe.get(key);
    if (existing) {
      if (existing.label === existing.value && label !== existing.label) {
        dedupe.set(key, { value, label });
      }
      continue;
    }
    dedupe.set(key, { value, label });
  }
  return Array.from(dedupe.values()).sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );
}

async function listWindowsFonts() {
  const fonts = new Set();
  try {
    const { stdout } = await execAsync(
      'powershell -NoProfile -Command "Add-Type -AssemblyName System.Drawing; [System.Drawing.Text.InstalledFontCollection]::new().Families | ForEach-Object { $_.Name }"',
    );
    stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((name) => fonts.add(name));
  } catch (error) {
    const regSources = [
      '"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts"',
      '"HKCU\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts"',
    ];
    for (const source of regSources) {
      try {
        const { stdout } = await execAsync(`reg query ${source}`);
        stdout
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .forEach((line) => {
            const parts = line.split(/\s{2,}/);
            if (parts.length >= 1) {
              const family = cleanupFamilyValue(parts[0]);
              if (family) {
                fonts.add(family);
              }
            }
          });
      } catch (regError) {
        continue;
      }
    }
  }
  return Array.from(fonts);
}

async function listMacFonts() {
  try {
    const swiftScript = `
import AppKit
let manager = NSFontManager.shared
for family in manager.availableFontFamilies.sorted() {
  if let members = manager.availableMembers(ofFontFamily: family) {
    for member in members {
      if let items = member as? [Any], items.count >= 2 {
        let postScript = items[0] as? String ?? ""
        let face = items[1] as? String ?? ""
        if !postScript.isEmpty {
          print("\\(postScript)|\\(family)|\\(face)")
        }
      }
    }
  } else {
    if let font = NSFont(name: family, size: 12) {
      print("\\(font.fontName)|\\(family)|Regular")
    } else {
      print("\\(family)|\\(family)|Regular")
    }
  }
}
`;
    const { stdout } = await execAsync(
      `swift -e ${JSON.stringify(swiftScript)}`,
    );
    const swiftFonts = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (swiftFonts.length > 0) {
      return swiftFonts
        .map((line) => {
          const [postScript, family = "", face = ""] = line.split("|");
          if (!postScript) {
            return null;
          }
          const familyLabel = cleanupFamilyValue(family);
          const faceLabel = cleanupFamilyValue(face);
          const familyFormatted = familyLabel
            ? formatFontLabel(familyLabel) || familyLabel
            : "";
          const faceFormatted = faceLabel
            ? formatFontLabel(faceLabel) || faceLabel
            : "";
          let label = formatFontLabel(postScript) || postScript;
          if (
            familyFormatted &&
            label.toLowerCase() === familyFormatted.toLowerCase()
          ) {
            const combined = [familyFormatted, faceFormatted]
              .filter(Boolean)
              .join(" ");
            label = combined || label;
          } else if (
            faceFormatted &&
            !label.toLowerCase().includes(faceFormatted.toLowerCase())
          ) {
            label = `${label} ${faceFormatted}`;
          }
          return {
            value: postScript,
            label,
          };
        })
        .filter(Boolean);
    }
  } catch (error) {}
  try {
    const { stdout } = await execAsync("system_profiler SPFontsDataType -json");
    const parsed = JSON.parse(stdout);
    const result = new Set();
    const fonts = parsed?.SPFontsDataType;
    if (Array.isArray(fonts)) {
      for (const font of fonts) {
        if (Array.isArray(font?.font_family)) {
          font.font_family.forEach((name) => {
            const formatted = cleanupFamilyValue(name);
            if (formatted) {
              result.add(formatted);
            }
          });
        } else if (typeof font?.font_family === "string") {
          const formatted = cleanupFamilyValue(font.font_family);
          if (formatted) {
            result.add(formatted);
          }
        } else if (typeof font?._name === "string") {
          const formatted = cleanupFamilyValue(font._name);
          if (formatted) {
            result.add(formatted);
          }
        }
      }
    }
    if (result.size > 0) {
      return Array.from(result);
    }
  } catch (error) {}
  const fallbackDirs = [
    "/System/Library/Fonts",
    "/Library/Fonts",
    process.env.HOME ? path.join(process.env.HOME, "Library/Fonts") : null,
  ].filter(Boolean);
  return listFontsFromDirectories(fallbackDirs);
}

async function listLinuxFonts() {
  try {
    const { stdout } = await execAsync('fc-list --format "%{family}\\n"');
    const result = new Set();
    stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        line.split(",").forEach((name) => {
          const formatted = cleanupFamilyValue(name);
          if (formatted) {
            result.add(formatted);
          }
        });
      });
    if (result.size > 0) {
      return Array.from(result);
    }
  } catch (error) {}
  const home = process.env.HOME;
  const fallbackDirs = [
    "/usr/share/fonts",
    "/usr/local/share/fonts",
    home ? path.join(home, ".fonts") : null,
    home ? path.join(home, ".local/share/fonts") : null,
  ].filter(Boolean);
  return listFontsFromDirectories(fallbackDirs);
}

async function listFontsFromDirectories(directories) {
  const fonts = new Set();
  for (const directory of directories) {
    await collectFonts(directory, fonts);
  }
  return Array.from(fonts);
}

async function collectFonts(directory, fonts) {
  if (!directory) {
    return;
  }
  try {
    const entries = await fs.promises.readdir(directory, {
      withFileTypes: true,
    });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        continue;
      }
      if (entry.isDirectory()) {
        await collectFonts(fullPath, fonts);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (FONT_EXTENSIONS.has(ext)) {
          const parsedName = path.parse(entry.name).name;
          const name = cleanupFamilyValue(parsedName);
          if (name) {
            fonts.add(name);
          }
        }
      }
    }
  } catch (error) {}
}

export async function getSystemFonts() {
  if (cachedFonts && Date.now() - cacheTimestamp < CACHE_DURATION) {
    if (
      Array.isArray(cachedFonts) &&
      cachedFonts.length > 0 &&
      typeof cachedFonts[0] === "string"
    ) {
      const normalized = buildFontEntries(cachedFonts);
      cachedFonts = normalized;
      return normalized;
    }
    return cachedFonts;
  }
  let fonts = [];
  if (process.platform === "win32") {
    fonts = await listWindowsFonts();
  } else if (process.platform === "darwin") {
    fonts = await listMacFonts();
  } else {
    fonts = await listLinuxFonts();
  }
  const entries = buildFontEntries(fonts);
  cachedFonts = entries;
  cacheTimestamp = Date.now();
  return entries;
}
