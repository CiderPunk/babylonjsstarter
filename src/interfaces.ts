import { Vector2 } from "@babylonjs/core/Maths/math";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Scene } from "@babylonjs/core/scene";

export interface IGame{
  scene:Scene
}

export interface IEntity{
  rootMesh:AbstractMesh
  update(dT:number):void
}

export interface IInputManager{
  bind(keyCode:string, commandName:string):void
  getCommand(name:string):IInputCommand
  registerCommands(commandSpecs: ICommandSepc[]):IInputCommand[]
  registerCommand(spec: ICommandSepc):IInputCommand
}

export type CommandAction  = (active:boolean,action:string)=>void;
export type AxisAction  = (val:number,action:string)=>void;
/*
export interface IJoystickSpec{
  name:string
  action:string
  vertical:
  horizontal:IAxisSpec
}
*/

export interface IInputBase{
  name:string
  action:string
}

export interface IAxisBase extends IInputBase{
  value:number
  single:boolean
}

export interface ICommandAxisSpec extends IInputBase{
  single:boolean
  defaultPositiveControls:Array<string>
  defaultNegativeControls:Array<string>
}

export interface ICommandSepc extends IInputBase{
  defaultControls:Array<string>
}

export interface IInputCommand extends IInputBase{
  getDefaultControls():Readonly<Array<string>>
  //unique name of command
  name:string
  //is active
  isActive:boolean

  Subscribe(act:CommandAction):void
  Unsubscribe(act:CommandAction):void
}