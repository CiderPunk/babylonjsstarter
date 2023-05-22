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
  fire:boolean
  jump:boolean
  joy1:Vector2
  joy2:Vector2
}


export type CommandAction  = (active:boolean,name:string)=>void;

export interface ICommandSepc{
  name:string
  action:string
  defaultControls:Array<string>
}

export interface IInputCommand{
  DefaultControls:string[]
  //unique name of command
  Name:string
  //short non-unique name
  Action:string
  //is active
  IsActive:boolean

  Subscribe(act:CommandAction):void
  Unsubscribe(act:CommandAction):void

}