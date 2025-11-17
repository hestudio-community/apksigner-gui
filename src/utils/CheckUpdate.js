import { app, dialog } from "electron";
import { _log } from "./log";
import { internationalization } from "./i18nServices/server";

const logger = new _log("CheckUpdate");
const i18n = new internationalization();

export function CheckUpdate(forceShow) {
  logger.startload("CheckUpdate");
  logger.info(
    `[fetch] GET https://api.github.com/repos/hestudio-community/apksigner-gui/releases/latest`,
  );
  fetch(
    "https://api.github.com/repos/hestudio-community/apksigner-gui/releases/latest",
  )
    .then(async (response) => {
      let data = await response.text();
      logger.log(`[fetch] Response: ${data}`);
      data = JSON.parse(data);
      if (data.name == `v${app.getVersion()}`) {
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
                shell.openExternal(
                  "https://github.com/hestudio-community/apksigner-gui/releases/latest",
                );
              }
            });
        }
      } else {
        dialog
          .showMessageBox({
            title: "APKSignerGUI",
            message: "APKSignerGUI",
            detail: i18n.geti18n("newVersionAvailable")(data.name),
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
                  `https://github.com/hestudio-community/apksigner-gui/releases/download/${
                    data.name
                  }/apksignergui_${String(data.name).replace(
                    "v",
                    "",
                  )}_arm64.dmg`,
                );
              } else if (
                process.platform == "darwin" &&
                process.arch == "amd64"
              ) {
                shell.openExternal(
                  `https://github.com/hestudio-community/apksigner-gui/releases/download/${
                    data.name
                  }/apksignergui_${String(data.name).replace(
                    "v",
                    "",
                  )}_amd64.dmg`,
                );
              } else if (process.platform == "win32" && process.arch == "x64") {
                shell.openExternal(
                  `https://github.com/hestudio-community/apksigner-gui/releases/download/${
                    data.name
                  }/apksignergui_${String(data.name).replace(
                    "v",
                    "",
                  )}_amd64.msi`,
                );
              } else if (
                process.platform == "win32" &&
                process.arch == "arm64"
              ) {
                shell.openExternal(
                  `https://github.com/hestudio-community/apksigner-gui/releases/download/${
                    data.name
                  }/apksignergui_${String(data.name).replace(
                    "v",
                    "",
                  )}_arm64.msi`,
                );
              } else {
                shell.openExternal(
                  "https://github.com/hestudio-community/apksigner-gui/releases/latest",
                );
              }
            } else if (response.response == 2) {
              shell.openExternal(
                "https://github.com/hestudio-community/apksigner-gui/releases/latest",
              );
            }
          });
      }
    })
    .catch((e) => {
      console.log(e);
      if (forceShow) {
        warn(undefined, i18n.geti18n("checkUpdateFailed"));
      }
    });

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
          shell.openExternal(
            "https://github.com/hestudio-community/apksigner-gui/releases/latest",
          );
        }
      });
  }
  logger.endload("CheckUpdate");
}
