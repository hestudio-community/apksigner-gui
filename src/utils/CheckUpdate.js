import { app, dialog, shell } from "electron";
import { _log } from "./log";
import { internationalization } from "./i18nServices/server";
import { CheckAppStore } from "./CheckAppStore";
import { warn } from "./alert";

const logger = new _log("CheckUpdate");
const i18n = new internationalization();

const UPDATE_API =
  "https://api.github.com/repos/hestudio-community/apksigner-gui/releases/latest";
const REPO_URL = "https://github.com/hestudio-community/apksigner-gui";

function UpdateDialog(latestVersion) {
  dialog
    .showMessageBox({
      title: "APKSignerGUI",
      message: "APKSignerGUI",
      detail: i18n.geti18n("newVersionAvailable")(latestVersion),
      type: "info",
      buttons: [
        process.platform == "win32" ? "Cancel" : i18n.geti18n("cancel"),
        ...(process.platform == "darwin" || process.platform == "win32"
          ? [i18n.geti18n("downloadNOW")]
          : []),
        i18n.geti18n("viewInGithub"),
      ],
      cancelId: 0,
    })
    .then((response) => {
      if (response.response == 1) {
        if (process.platform == "darwin" && process.arch == "arm64") {
          shell.openExternal(
            `${REPO_URL}/releases/download/${
              latestVersion
            }/apksignergui_${String(latestVersion).replace("v", "")}_arm64.dmg`,
          );
        } else if (process.platform == "win32" && process.arch == "x64") {
          shell.openExternal(
            `${REPO_URL}/releases/download/${
              latestVersion
            }/apksignergui_${String(latestVersion).replace("v", "")}_amd64.msi`,
          );
        } else if (process.platform == "win32" && process.arch == "arm64") {
          shell.openExternal(
            `${REPO_URL}/releases/download/${
              latestVersion
            }/apksignergui_${String(latestVersion).replace("v", "")}_arm64.msi`,
          );
        } else {
          shell.openExternal(`${REPO_URL}/releases/latest`);
        }
      } else if (response.response == 2) {
        shell.openExternal(`${REPO_URL}/releases/latest`);
      }
    });
}

export function CheckUpdate(forceShow) {
  if (app.runningUnderARM64Translation) {
    dialog
      .showMessageBox({
        title: "APKSignerGUI",
        message: "APKSignerGUI",
        detail: i18n.geti18n("warnInARM64WithX86Program"),
        type: "warning",
        buttons: [
          process.platform == "win32" ? "Cancel" : i18n.geti18n("cancel"),
          i18n.geti18n("viewInGithub"),
        ],
        cancelId: 0,
      })
      .then((response) => {
        if (response.response == 1) {
          shell.openExternal(`${REPO_URL}/releases/latest`);
        }
      });
  }

  if (CheckAppStore()) return;
  logger.startload("CheckUpdate");
  logger.info(`[fetch] GET ${UPDATE_API}`);
  fetch(UPDATE_API)
    .then(async (response) => {
      let data = await response.text();
      logger.log(`[fetch] Response: ${data}`);
      data = JSON.parse(data);
      const latestVersion = String(data.name);

      if (latestVersion == `v${app.getVersion()}`) {
        if (forceShow) {
          dialog
            .showMessageBox({
              title: "APKSignerGUI",
              message: "APKSignerGUI",
              detail: i18n.geti18n("latestVersion"),
              type: "info",
              buttons: [
                process.platform == "win32" ? "Yes" : i18n.geti18n("confirm"),
                i18n.geti18n("viewInGithub"),
              ],
              cancelId: 0,
            })
            .then((response) => {
              if (response.response == 1) {
                shell.openExternal(`${REPO_URL}/releases/latest`);
              }
            });
        }
      } else {
        if (latestVersion == "undefined") {
          if (forceShow) {
            warn(undefined, i18n.geti18n("checkUpdateFailed"));
          }
          return
        }
        if (!forceShow) {
          if (!/^\d+(\.\d+)*$/.test(app.getVersion()) | !app.isPackaged) {
            logger.debug(
              `You are now running the test version ${app.getVersion()} ${!app.isPackaged ? "Develop Mode" : ""}. Skip the version check pop-up.`,
            );
            return;
          }
        }
        UpdateDialog(latestVersion);
      }
    })
    .catch((e) => {
      console.log(e);
      if (forceShow) {
        warn(undefined, i18n.geti18n("checkUpdateFailed"));
      }
    });
  logger.endload("CheckUpdate");
}
