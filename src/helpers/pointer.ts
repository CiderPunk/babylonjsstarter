import { Color3, Quaternion, Vector2, Vector3 } from "@babylonjs/core/Maths/math"
import { Scene } from "@babylonjs/core/scene"

import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder"
import { Mesh } from "@babylonjs/core/Meshes/mesh"
import { Material } from "@babylonjs/core/Materials/material"
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial"
import { TransformNode } from "@babylonjs/core/Meshes/transformNode"

export class Pointer{

  readonly transformNode: TransformNode

  public constructor(readonly name:string, scene:Scene, colour:Color3, readonly scale:boolean = true, start?:Vector3, line?:Vector3){
    const mat = new StandardMaterial(`${name}_mat`, scene)
    mat.emissiveColor = colour
    mat.backFaceCulling = false
    this.transformNode=  new TransformNode(`${name}_root`, scene)
    
    const shaft = CreateCylinder(`${name}_shaft`, {height:9, tessellation:4, diameter:0.5, enclose:false,  }, scene)

    const head = CreateCylinder(`${name}_shaft`, {height:1, tessellation:4,  diameterBottom:1, diameterTop:0}, scene)
    shaft.setAbsolutePosition(new Vector3(0,0,4.5))
    shaft.setDirection(Vector3.Up(),Math.PI/2,0,0)
    shaft.parent = this.transformNode

    head.setAbsolutePosition(new Vector3(0,0,9.5))
    head.setDirection(Vector3.Up(),Math.PI/2,0,0)
    head.parent = this.transformNode
    head.material = shaft.material = mat
    if (start){ this.setStart(start)}
    if (line){this.setLine(line)}
  }

  setStart(pos:Vector3){
    this.transformNode.setAbsolutePosition(pos)
  }

  setLine(line:Vector3){
    this.transformNode.lookAt(line.add(this.transformNode.position))
    if (this.scale){
      const scale = line.length() / 10
      console.log(`${this.name} scale ${scale}`)
      this.transformNode.scaling = new Vector3(scale, scale, scale)
    }

    /*
    this.transformNode.computeWorldMatrix(true)
    


    const rotation = new Vector3( Math.atan(-line.x/(line.y == 0 ? 0.00000001 : line.y)), Math.atan(line.z/(line.y == 0 ? 0.00000001 : line.y)),0 )
    console.log(`${this.name} rotation ${rotation}`)
  
    this.transformNode.rotationQuaternion =  Quaternion.RotationAlphaBetaGamma(rotation.x, rotation.y, rotation.z)
    this.transformNode.computeWorldMatrix(true)
    //this.transformNode.rotation = rotation

*/
  }


}


