

export type CommandAction  = (active:boolean,name:string)=>void;

export class InputCommand{
  public constructor(readonly name:string, readonly action:string, readonly defaultControls:string[]){  }
  private actions = new Array<CommandAction>();
  private active:boolean = false
  //default key code of command
  get DefaultControls():string[]{
    return this.defaultControls
  }
  //unique name of command
  get Name():string{
    return this.name
  }
  //short non-unique name
  get Action():string{
    return this.action
  }
  //is active
  get IsActive():boolean{
    return this.active
  }

  public Subscribe(act:CommandAction){
    if (this.actions.indexOf(act) == -1){
      this.actions.push(act)
    }
  }

  public Unsubscribe(act:CommandAction){
    let index = this.actions.indexOf(act)
    if (index > -1){
      this.actions.splice(index, 1)
    }
  }

  public Start(){
    if (!this.active){
      this.actions.forEach((act)=>act(true, this.action))
      this.active = true
    }
  }

  public Stop(){
    this.active = false
    this.actions.forEach((act)=>act(false, this.action))
  }
}
