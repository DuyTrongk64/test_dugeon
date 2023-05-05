const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    Direction = 0;

    @property
    Velocity_Max_X = 0;

    @property
    Walk_Force = 0;

    @property
    Jump_Force = 0;

    @property(cc.Animation)
    animation_node: cc.Animation = null;

    @property jumpHeight: number = 0;
    @property jumpDuration: number = 0;
    
    private Rigid_Body;
    private on_the_ground: boolean;

    private jumpAction: cc.ActionInterval;
    
    private isIdle: boolean;
    private isMove: boolean;
    private isGoLeft: boolean;
    private isGoRight: boolean;

    private isAnimating: boolean;

    onLoad(){
        //set physics
        let physics_manager = cc.director.getPhysicsManager();
        physics_manager.enabled = true;
        physics_manager.gravity = cc.v2(0,-2000);

        this.Rigid_Body = this.node.getComponent(cc.RigidBody);

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    start () {
        this.on_the_ground = false;

        this.isIdle = true;
        this.isMove = false;
        this.isGoLeft = true;
        this.isGoRight = false;
        
        this.isAnimating = false;
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp, this);

        // this.jumpAction = cc.sequence(
        //     cc.jumpBy(this.jumpDuration, cc.v2(0, 0), this.jumpHeight, 1),
        //     cc.callFunc(() => {
        //         this.Rigid_Body.linearVelocity = cc.v2(this.Rigid_Body.linearVelocity.x, 0);
        //     }, this)
        // );
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.Direction = -1;
                if(!this.isGoLeft){
                    this.isGoLeft = true;
                    this.isGoRight = false;
                    this.node.scaleX*=-1;
                }
                this.isIdle = false;
                this.isMove = true;
                if(!this.isAnimating) {
                    this.isAnimating = true;
                    this.runAnimation();
                }
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.Direction = 1;
                if(!this.isGoRight){
                    this.isGoLeft = false;
                    this.isGoRight = true;
                    this.node.scaleX*=-1;
                }
                this.isIdle = false;
                this.isMove = true;
                if(!this.isAnimating) {
                    this.isAnimating = true;
                    this.runAnimation();
                }
                break;
            case cc. macro.KEY.w:
            case cc.macro.KEY.up:
                if(this.on_the_ground){
                    // if (this.jumpAction.isDone()) {
                    //     this.Rigid_Body.applyLinearImpulse(cc.v2(0, this.jumpHeight), this.Rigid_Body.getWorldCenter(), true);
                    //     this.node.runAction(this.jumpAction);
                    //     this.jumpAction.start();
                    // }
                    this.Rigid_Body.applyLinearImpulse(cc.v2(0, this.jumpHeight), this.Rigid_Body.getWorldCenter(), true);

                    //this.Rigid_Body.applyForceToCenter(cc.v2(0,this.Jump_Force),true);
                    this.on_the_ground = false;
                }
                break;
        }
    }

    onKeyUp(event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.d:
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.Direction = 0;
                this.isIdle = true;
                this.isMove = false;
                this.isAnimating = false;
                this.runAnimation();
                break;
        } 
    }

    runAnimation(){
        if(this.isIdle){
            this.animation_node.play("Idle");
            
        }

        if(!this.isIdle){
            this.animation_node.stop("Idle");
        }

        if(this.isMove){
            this.animation_node.play("Walk");
            console.log('1\n');
        }

        if(!this.isMove){
            this.animation_node.stop("Walk");
        }
    }

    moveAround(dt){
        if(this.Direction>0&&this.Rigid_Body.linearVelocity.x<this.Velocity_Max_X||
            this.Direction<0&&this.Rigid_Body.linearVelocity.x>-this.Velocity_Max_X){
                //this.Rigid_Body.applyForceToCenter(cc.v2(this.Direction*this.Walk_Force,0),true);
                this.Rigid_Body.linearVelocity = cc.v2(this.Direction*this.Walk_Force*dt,this.Rigid_Body.linearVelocity.y);
            }        
    }

    onBeginContact(contact,selfCollider, otherCollider){
        //console.log(`Collided with ${otherCollider.node.name}!`);
        if(selfCollider.tag === 2){
            this.on_the_ground = true;
        }
    }

    update (dt) {
        this.moveAround(dt);
     
    }
}