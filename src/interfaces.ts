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

export interface IJoystickSpec{
  name:string
  action:string
  vertical:IAxisSpec
  horizontal:IAxisSpec
}

export interface IAxisSpec{
  name:string
  action:string
  controlAxis:Array<string>
  positiveControls:Array<string>
  negativeControls:Array<string>
}

export interface IInputAxis{
  name:string
  action:string
  controlAxis:Array<string>
  positiveControls:Array<string>
  negativeControls:Array<string>
}

export interface ICommandSepc{
  name:string
  action:string
  defaultControls:Array<string>
}

export interface IInputCommand{
  getDefaultControls():Readonly<Array<string>>
  //unique name of command
  name:string
  //is active
  isActive:boolean

  Subscribe(act:CommandAction):void
  Unsubscribe(act:CommandAction):void
}