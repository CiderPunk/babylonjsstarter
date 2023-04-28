import { AbstractMesh, CreateBox } from "@babylonjs/core/Meshes";
import { IEntity, IGame } from "../interfaces";
import { Material } from "@babylonjs/core/Materials/material";

import { PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core/Physics";
import { Color3, Vector2, Vector3, Vector4 } from "@babylonjs/core/Maths/math";
import { Pointer } from "../helpers/pointer";

export class TestShape implements IEntity{
  rootMesh: AbstractMesh;
  aggregate: PhysicsAggregate;
  time: number = 0;
  p:Pointer




  public constructor(readonly name:string, readonly owner:IGame){
    const chasis = CreateBox(`${name}_body`, {width:5, height:5, depth:5}, owner.scene)
    chasis.setAbsolutePosition(new Vector3(0,5,0))
    this.aggregate = new PhysicsAggregate(chasis, PhysicsShapeType.BOX, { mass:10 }, owner.scene)
    chasis.setDirection(Vector3.Forward(),Math.PI *0.5, 0,0)
    this.rootMesh = chasis


    this.p  = new Pointer(`${name}-pointer`, owner.scene, Color3.Gray(), true)
  }

  public update(dT:number){
    
    
    const strength = 50;
    this.time +=dT
    const f= new Vector3(strength * Math.sin(this.time*0.001),0,0)//strength * Math.cos(this.time*0.001))
    const off= new Vector3(0,0,3 * Math.sin(this.time*0.0033))//strength * Math.cos(this.time*0.001))
    const o = this.rootMesh.getAbsolutePosition().addInPlace(off);
    const offset = new Vector3(0,5,0)
    this.aggregate.body.applyForce(f, o)



    this.p.setStart(o)
    this.p.setLine(f)


  }

}