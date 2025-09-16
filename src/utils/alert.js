/**
 * @file alert.js
 * @description The functions listed in this document are intended to display common program warnings and error messages. On some operating systems, warnings and errors are not clearly distinguished. The difference between alert and error functions here is that alert functions display non-fatal issues in a pop-up window, allowing users to continue using the program after clicking the confirmation button; whereas clicking the button for error functions will immediately exit the application.
 */

import { app, dialog } from "electron";

function warn(title = "APKSignerGUI", msg) {
  dialog.showMessageBox({
    type: "warning",
    title: title,
    message: title,
    detail: msg,
    buttons: ["Close Alert"],
    cancelId: 0,
    defaultId: 0,
  });
}

function error(title = "APKSignerGUI", msg) {
  const result = dialog.showMessageBoxSync({
    type: "warning",
    title: title,
    message: title,
    detail: msg,
    buttons: ["Quit Application"],
    cancelId: 0,
    defaultId: 0,
  });

  if (result === 0) {
    app.quit();
    return false;
  }
}

export { warn, error };
