import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Scene } from "@babylonjs/core/scene";

export interface IGame{
  scene:Scene
}

export interface IEntity{
  rootMesh:AbstractMesh
  update(dT:number):void
}