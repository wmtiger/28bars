module mvc {

    export class cst {


        static UI_UPDATE_ALL_POINTS:string = "UI_UPDATE_ALL_POINTS";


        static GO_LOGIN:string = "GO_LOGIN";
        static GO_HALL:string = "GO_HALL";
        static GO_SLOT:string = "GO_SLOT";
        static GO_FLIP:string = "GO_FLIP";
        static GO_TUITONG:string = "GO_TUITONG";
        static GO_LUCKY_PK_SIZE:string = "GO_LUCKY_PK_SIZE";
        static GO_FIGHT_GRID:string = "GO_FIGHT_GRID";

        
    }





    export function send(name:string, body?:any, type?:string ):void {
        puremvc.Facade.getInstance().sendNotification(name,body,type);
    }
    export function has(name:string ):boolean {
        return puremvc.Facade.getInstance().hasCommand(name) 
            || puremvc.Facade.getInstance().hasMediator(name)
            || puremvc.Facade.getInstance().hasProxy(name);
    }
    
    export function regCmd( notificationName:string, commandClassRef:Function ):void {
        puremvc.Facade.getInstance().registerCommand(notificationName, commandClassRef);
    }

}