const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    player_node: cc.Node = null;


    update (dt) {
        let target_pos = this.player_node.getPosition();
        let curent_pos = this.node.getPosition();
        
        curent_pos.lerp(target_pos,0.1,curent_pos);
        curent_pos.y = cc.misc.clampf(target_pos.y,0,1024);
        this.node.setPosition(curent_pos);
    }
}
