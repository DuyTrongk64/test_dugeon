

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

   onLoad () {
    let physics_manager = cc.director.getPhysicsManager();
    physics_manager.enabled = true;
    physics_manager.gravity = cc.v2(0,-2000);
   }

    start () {

    }

    // update (dt) {}
}
