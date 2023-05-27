
//import "@babylonjs/core/Gamepads/gamepadSceneComponent";
import { GamepadManager, Xbox360Pad,Xbox360Button, DualShockPad, DualShockButton, GenericPad  } from "@babylonjs/core/Gamepads";
import { CommandAction, IAxisSpec, ICommandSepc, IGame, IInputAxis, IInputBase, IInputCommand, IInputManager } from "../interfaces";


abstract class InputBase implements IInputBase{
  constructor(readonly spec:IInputBase){
  }

  get name():string{
    return this.spec.name
  }

  get action():string{
    return this.spec.action
  }
} 


class InputAxis extends InputBase implements IInputAxis{
  constructor(readonly spec:IAxisSpec){
    super(spec)
  }

  get value():number{
    return 0
  }

  get defaultPositiveControls():string[]{
    return this.spec.defaultPositiveControls
  }
  get defaultNegativeControls():string[]{
    return this.spec.defaultNegativeControls
  }
}

class InputCommand implements IInputCommand{

  constructor(readonly spec:ICommandSepc){
  }

  get name():string{
    return this.spec.name
  }

  get action():string{
    return this.spec.action
  }


  private actions = new Array<CommandAction>();
  private active:boolean = false
  //default key code of command
  getDefaultControls():Readonly<Array<string>>{
    return this.spec.defaultControls
  }

  //is active
  get isActive():boolean{
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


export class InputManager implements IInputManager {
  readonly commandMap = new Map<string,InputCommand>()
  readonly keyMap = new Map<string, InputCommand[]>()
  downKeys = new Set<string>()

  public toggleDebug?:()=>void
  public togggleCamera?: () => void;
  public nextLevel?: () => void;
  public constructor(readonly owner: IGame) {
    
  //joypad
  const gpm = new GamepadManager();
  gpm.onGamepadConnectedObservable.add((gamepad, state) => {
   console.log(`gamepad connected ${gamepad.id}`)

  //Stick events
  gamepad.onleftstickchanged((values)=>{



  })

  gamepad.onrightstickchanged((values)=>{
    //console.log(`Left gamepad x:${values.x} y:${values.y}`)
    //this.joy2.set(values.x, values.y)
    //if (this.joy2.lengthSquared() > 1){
    //  this.joy2.normalize()
    //}
  })

  //Handle gamepad types
  if (gamepad instanceof Xbox360Pad) {
    //Xbox button down/up events
    gamepad.onButtonDownObservable.add((button, state)=>{
      this.keyDown("XB-" + Xbox360Button[button])
    })
    gamepad.onButtonUpObservable.add((button, state)=>{
      this.keyUp("XB-" + Xbox360Button[button])
    })
  } 
  else if (gamepad instanceof DualShockPad) {
    //Dual shock button down/up events
    gamepad.onButtonDownObservable.add((button, state)=>{
      this.keyDown("DS-" + DualShockButton[button])
    })
    gamepad.onButtonUpObservable.add((button, state)=>{
      this.keyUp("DS-" + DualShockButton[button])
    })
  }
  else if (gamepad instanceof GenericPad) {
    gamepad.onButtonDownObservable.add((button, state)=>{
      this.keyDown("GP-" + button)
    })
    gamepad.onButtonUpObservable.add((button, state)=>{
      this.keyUp("GP-" + button)
    })
  } 

 })

    gpm.onGamepadDisconnectedObservable.add((gp, state)=>{
      console.log(`gamepad disconnected ${gp.id}`)
    })

    if (document){
      document.addEventListener("keydown", (e:KeyboardEvent) =>{  
        if (!e.repeat) { 
          if (this.keyDown(e.key)){
            e.preventDefault()
            e.stopImmediatePropagation()
          }
        }

      })
      document.addEventListener("keyup", (e:KeyboardEvent) =>{ 
        this.keyUp(e.key)
      })
    }
  }

  bind(key:string, commandName:string):void{
    let command = this.commandMap.get(commandName) as InputCommand
    if (command){
      if (!this.keyMap.has(key)){
        this.keyMap.set(key, [])
      }
      this.keyMap.get(key)?.push(command)

      this.addSavedKey(command.name, key)

    }
  }

  getSavedKeys(name:string):string[]{
    return localStorage.getItem(`input.${name}`)?.split(',') ?? []
  }

  addSavedKey(name: string, key: string) {
    const keys = this.getSavedKeys(name)
    if (keys.findIndex(k=>key == k) === -1){
      keys.push(key)
      localStorage.setItem(`input.${name}`, keys.join(","))
    }
  }

  getCommand = (name:string) => this.commandMap.get(name) as IInputCommand
  

  registerCommands(commandSpecs: ICommandSepc[]):IInputCommand[]{
    return commandSpecs.map(c=>this.registerCommand(c));
  }


  registerCommand(spec: ICommandSepc):IInputCommand{
    if (!this.commandMap.has(spec.name)){
      const command = new InputCommand(spec)
      this.commandMap.set(command.name, command)
      
      this.getSavedKeys(command.name)

      command.getDefaultControls().forEach(code=>{ this.bind(code, command.name)})
      return command
    }
    else{
      throw new Error("Duplicate command registered: " + spec.name)
    }
  }

  keyDown(code: string):boolean {
    if (this.downKeys.has(code)){
      return false
    }
    this.downKeys.add(code)  
    this.keyMap.get(code)?.forEach(c=>c.Start())
    return true
  }  
  
  keyUp(code: string):void {
    if (!this.downKeys.has(code)){
      return
    }
    this.downKeys.delete(code)
    this.keyMap.get(code)?.forEach(c=>c.Stop())
    console.log(`keyup ${code}`)
  }

  updateMove():void {
 //   this.move.copyFrom(this.keyMove)
  //  this.move.normalize()
    //console.log(`keys ${this.keyMove.x}, ${this.keyMove.y}  move ${this.move.x}, ${this.move.y}`)
  }
}
