module ssp {

    export class LoginStartup extends puremvc.SimpleCommand {

         execute(notification: puremvc.INotification): void {

            if (utils.autoLogin()) {
                console.log("auto login");
            }

            else ui.open(cst.ui.LOGIN);
         }


    }


}