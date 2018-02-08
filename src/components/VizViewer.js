import React, { Component } from 'react';
import { createStore } from 'redux'
import { Button } from 'muicss/react';


var THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)


let scene;
let camera;
let renderer;
let controls;



//REDUX REDUCER    --> only use these to interact with the state of the application
const rootReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_BLOCK_GROUP' : {
            const newState = newBlockGroup(state);
            return { ...newState, lastAction: 'ADD_BLOCK_GROUP' }
        }
        case 'ROTATE_RIGHT_ON_Z_AXIS' : {
            const newState = RotateRightOnZAxis(state);
            return { ...newState, lastAction: 'ROTATE_RIGHT_ON_Z_AXIS' }
        }
        case 'ROTATE_LEFT_ON_Z_AXIS' : {
            const newState = RotateLeftOnZAxis(state);
            return { ...newState, lastAction: 'ROTATE_LEFT_ON_Z_AXIS' }
        }
        case 'TRANSLATE_FALLING_GROUP' : {
            const newState = TranslateFallingGroup(state, action.direction)
            return { ...newState, lastAction: 'MOVE_FALLING_GROUP' }
        }
        case 'UPDATE': {
            const newState = TranslateFallingGroup(state, 'down-y-axis')
            const finalState = checkCompletedRows(newState)
            return { ...finalState, lastAction: 'UPDATE' }
        }
        case 'init3js' : {
            const initState = {
                scene,
                camera,
                lastAction: '',
                blocks: [],
                currentFallingGroupType: FourVert,
                nextGroupType: FourVert
            }
            return initState;
        }
        default:
            return state;
    }
}

//Redux create store 
const store = createStore(rootReducer, this.state)

//Render loop (redux store.subscribe method calls this every time the store is updated... which creates a loop)
const render3js = () => {
    if(store.getState().lastAction === 'UPDATE'){
        renderer.render(store.getState().scene, store.getState().camera);
        requestAnimationFrame(() => store.dispatch({ type: 'UPDATE' }));
    }
} 






//define colors
const materialOrange = new THREE.MeshBasicMaterial({ color: 0xffa500 ,transparent: true, opacity: 0.5});

//...


/*****************************************
 * 
 *    Allow 90 degree rotation on z a & x axis in both directions
 *    
 *    There is the standard set state where the block is facing down
 *     
 *    Then there is the facing right & left from z-axis rotations
 *    and out & in from x-axis rotation
 *        
 *    
 *      I think hard-coding in these states (as the blocks relate to the 'head' block) will save time
 * 
 *  After, I will add the four y-axis rotation states to each block group 
 * 
 * 
 *  Y Values will start from the way it drops then increment by one for each 90 degree turn to the right (facing initial forward direction)
 * 
 * **************************************/
 
 const FourVert = {
     FacingDown : {
         YRotationOne : {
            //these store the positions of the block relative to the first block 
             block1: {
                 x: 0,
                 y: 0,
                 z: 0
             },
             block2: {
                 x: 0,
                 y: 1,
                 z: 0
             },
             block3: {
                 x: 0,
                 y: 2,
                 z: 0
             },
             block4: {
                 x: 0,
                 y: 3,
                 z: 0
             }      
         }
     },
     FacingLeft : {
         YRotationOne : {
            //these store the positions of the block relative to the first block 
             block1: {
                 x: 0,
                 y: 0,
                 z: 0
             },
             block2: {
                 x: -1,
                 y: 0,
                 z: 0
             },
             block3: {
                 x: -2,
                 y: 0,
                 z: 0
             },
             block4: {
                 x: -3,
                 y: 0,
                 z: 0
             }           
         }
     },
    FacingRight : {
         YRotationOne : {
            //these store the positions of the block relative to the first block 
             block1: {
                 x: 0,
                 y: 0,
                 z: 0
             },
             block2: {
                 x: 1,
                 y: 0,
                 z: 0
             },
             block3: {
                 x: 2,
                 y: 0,
                 z: 0
             },
             block4: {
                 x: 3,
                 y: 0,
                 z: 0
             }           
         }
     },
    FacingIn : {
        YRotationOne : {
            //these store the positions of the block relative to the first block 
             block1: {
                 x: 0,
                 y: 0,
                 z: 0
             },
             block2: {
                 x: 0,
                 y: 0,
                 z: 1
             },
             block3: {
                 x: 0,
                 y: 0,
                 z: 2
             },
             block4: {
                 x: 0,
                 y: 0,
                 z: 3
             }       
        }
     },
    FacingOut : {
        YRotationOne : {
            //these store the positions of the block relative to the first block 
             block1: {
                 x: 0,
                 y: 0,
                 z: 0
             },
             block2: {
                 x: 0,
                 y: 0,
                 z: -1
             },
             block3: {
                 x: 0,
                 y: 0,
                 z: -2
             },
             block4: {
                 x: 0,
                 y: 0,
                 z: -3
             }       
        }
     }
 }
 
 
 const whatIsNextRotationState = (currentHeadFacing, rotationType, yRotationAsString) => {
    let obj = {};
    console.log(currentHeadFacing)
    switch(rotationType){
        case 'right-on-z-axis' : {
            switch(currentHeadFacing){
                case 'FacingDown' : {
                    obj.Facing = 'FacingLeft';
                    obj.yRotation = 'YRotationOne'
                    return obj
                }
                case 'FacingRight' : {
                    obj.Facing = 'FacingDown';
                    obj.yRotation = 'YRotationOne'
                    return obj
                }
            }
            break;
        }
        case 'left-on-z-axis' : {
            switch(currentHeadFacing){
                case 'FacingDown' : {
                    obj.Facing = 'FacingRight';
                    obj.yRotation = 'YRotationOne'
                    return obj
                }
                case 'FacingLeft' : {
                    obj.Facing = 'FacingDown';
                    obj.yRotation = 'YRotationOne'
                    return obj
                }
            }
            break
        }
    }
}
 
const RotateRightOnZAxis = (state) => {
    let newState = { ...state }
    console.log(newState.currentFallingGroupType, newState.headFacing, newState.yRotation)
    let newRotationState = whatIsNextRotationState(newState.headFacing, 'right-on-z-axis', newState.yRotation)
    if(newRotationState != undefined){
        newState = changeBlocksState(newState, newState.currentFallingGroupType[newRotationState.Facing][newRotationState.yRotation])
        if(newState.successOnRotate){
            newState.headFacing = newRotationState.Facing;
        }        
    }
    return newState;
}

const RotateLeftOnZAxis = (state) => {
    let newState = { ...state }
    console.log(newState.currentFallingGroupType, newState.headFacing, newState.yRotation)
    let newRotationState = whatIsNextRotationState(newState.headFacing, 'left-on-z-axis', newState.yRotation)
    if(newRotationState != undefined){
        console.log('falling group type: ')
        console.log(newRotationState)
        newState = changeBlocksState(newState, newState.currentFallingGroupType[newRotationState.Facing][newRotationState.yRotation])
        if(newState.successOnRotate){
            newState.headFacing = newRotationState.Facing;
        }        
    }
    return newState;
}

//receives the current game state, and the proposed changed blocks state, and return finalState
// POSITION OF BLOCK 1 NEVER CHANGES, all rotations are relative to block 1
const changeBlocksState = (finalState, newBlocksState) => {
    let newState = { ...finalState}
    let validMove = true;
    let testX;
    let testY;
    let testZ;
    let restingBlocks = []
    for(let i = 0; i<newState.blocks.length; i++){
        if(newState.blocks[i].userData.status != 'falling'){
            restingBlocks.push(newState.blocks[i])
        }
    }
    for(let i = 0; i<restingBlocks.length; i++){
        //test block 2 vs restingblocks[i]
        testX = newState.currentBlockGroup[0].position.x + newBlocksState.block2.x
        testY = newState.currentBlockGroup[0].position.y + newBlocksState.block2.y
        testZ = newState.currentBlockGroup[0].position.z + newBlocksState.block2.z
        
        if(testX == restingBlocks[i].position.x && Math.abs(testY - restingBlocks[i].position.y) < 1 && testZ == restingBlocks[i].position.z){
            validMove = false; 
            break;
        }
                                
        //test block 3
        testX = newState.currentBlockGroup[0].position.x + newBlocksState.block3.x
        testY = newState.currentBlockGroup[0].position.y + newBlocksState.block3.y
        testZ = newState.currentBlockGroup[0].position.z + newBlocksState.block3.z
        
        if(testX == restingBlocks[i].position.x && Math.abs(testY - restingBlocks[i].position.y) < 1 && testZ == restingBlocks[i].position.z){
            validMove = false; 
            break;
        }
        
        //test block 4
        testX = newState.currentBlockGroup[0].position.x + newBlocksState.block4.x
        testY = newState.currentBlockGroup[0].position.y + newBlocksState.block4.y
        testZ = newState.currentBlockGroup[0].position.z + newBlocksState.block4.z
        
        if(testX == restingBlocks[i].position.x && Math.abs(testY - restingBlocks[i].position.y) < 1 && testZ == restingBlocks[i].position.z){
            validMove = false; 
            break;
        }
    }
    //test block 2 ob
    testX = newState.currentBlockGroup[0].position.x + newBlocksState.block2.x
    testY = newState.currentBlockGroup[0].position.y + newBlocksState.block2.y
    testZ = newState.currentBlockGroup[0].position.z + newBlocksState.block2.z
    if(testX > 2.5 || testX < -2.5 || testZ > 2.5 || testZ < -2.5){
        validMove = false; 
    }        
    //test block 3 ob
    testX = newState.currentBlockGroup[0].position.x + newBlocksState.block3.x
    testY = newState.currentBlockGroup[0].position.y + newBlocksState.block3.y
    testZ = newState.currentBlockGroup[0].position.z + newBlocksState.block3.z
    if(testX > 2.5 || testX < -2.5 || testZ > 2.5 || testZ < -2.5){
        validMove = false; 
    }     
    //test block 4 ob
    testX = newState.currentBlockGroup[0].position.x + newBlocksState.block4.x
    testY = newState.currentBlockGroup[0].position.y + newBlocksState.block4.y
    testZ = newState.currentBlockGroup[0].position.z + newBlocksState.block4.z
    if(testX > 2.5 || testX < -2.5 || testZ > 2.5 || testZ < -2.5){
        validMove = false; 
    }     
    
    if(validMove){
        //block 2
        newState.currentBlockGroup[1].position.x = newState.currentBlockGroup[0].position.x + newBlocksState.block2.x
        newState.currentBlockGroup[1].position.y = newState.currentBlockGroup[0].position.y + newBlocksState.block2.y
        newState.currentBlockGroup[1].position.z = newState.currentBlockGroup[0].position.z + newBlocksState.block2.z
    
        //block 3
        newState.currentBlockGroup[2].position.x = newState.currentBlockGroup[0].position.x + newBlocksState.block3.x
        newState.currentBlockGroup[2].position.y = newState.currentBlockGroup[0].position.y + newBlocksState.block3.y
        newState.currentBlockGroup[2].position.z = newState.currentBlockGroup[0].position.z + newBlocksState.block3.z
        
        //block 4 
        newState.currentBlockGroup[3].position.x = newState.currentBlockGroup[0].position.x + newBlocksState.block4.x
        newState.currentBlockGroup[3].position.y = newState.currentBlockGroup[0].position.y + newBlocksState.block4.y
        newState.currentBlockGroup[3].position.z = newState.currentBlockGroup[0].position.z + newBlocksState.block4.z
        newState.successOnRotate = true;
    }
    else{
        newState.successOnRotate = false;
    }
    return newState;
}


const checkCompletedRows = (state) => {
    const newState = { ...state }
    
    return newState
}

const newBlockGroup = (state) => {
    const newState = { ...state }
    newState.currentBlockGroup = []
    //every group has four blocks and starting position
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const box1 = new THREE.Mesh(geometry, materialOrange);
    const box2 = new THREE.Mesh(geometry, materialOrange);
    const box3 = new THREE.Mesh(geometry, materialOrange);
    const box4 = new THREE.Mesh(geometry, materialOrange);
    
    box1.userData.status = 'falling'; //box status property is used to denote its state of 'falling' or 'resting'
    
    //data for rotating group 
    box1.userData.head = true;

    newState.headFacing = 'FacingDown';
    newState.yRotation = 1;
    
    box2.userData.status = 'falling';
    box3.userData.status = 'falling';
    box4.userData.status = 'falling';
    
    box1.position.y = 20 ;
    box1.position.x = 2.5;
    box1.position.z = 2.5;

    switch(newState.nextGroupType){
        case FourVert : {
            newState.currentFallingGroupType = FourVert;
            box2.position.y = box1.position.y + 1;
            box2.position.x = box1.position.x;
            box2.position.z = box1.position.z;
            
            box3.position.y = box2.position.y + 1;
            box3.position.x = box1.position.x;
            box3.position.z = box1.position.z;
           
            box4.position.y = box3.position.y + 1;
            box4.position.x = box1.position.x;
            box4.position.z = box1.position.z;
            newState.scene.add(box1);
            newState.blocks.push(box1);
            newState.scene.add(box2);
            newState.blocks.push(box2);
            newState.scene.add(box3);
            newState.blocks.push(box3);
            newState.scene.add(box4);
            newState.blocks.push(box4);
            newState.currentBlockGroup.push(box1)
            newState.currentBlockGroup.push(box2)
            newState.currentBlockGroup.push(box3)
            newState.currentBlockGroup.push(box4)
        }
    }
    
    return newState;
}

const TranslateFallingGroup = (state, direction) => {
    const newState = { ...state }
    switch(direction){
        case 'down-y-axis' : {
            let checkValidMove = true //need to check if any block leaves the game board or runs into another block
            let currentBlockGroup = [];
            for(let i = 0; i<newState.blocks.length; i++){
                let block = newState.blocks[i];
                if (block.userData.status === 'falling'){
                    currentBlockGroup.push(block)
                }
            }
            if(currentBlockGroup.length === 0){
                newState.currentBlockGroup = [];
            }
            for(let i = 0; i<currentBlockGroup.length; i++){
                if(currentBlockGroup[i].position.y + 1 <= 1.5){
                    checkValidMove = false;
                }
            }
            //compare each of the currently falling blocks to every state block that is resting
            for(let i = 0; i<currentBlockGroup.length; i++){
                let block = currentBlockGroup[i]
                for(let p = 0; p<newState.blocks.length; p++){
                    if(newState.blocks[p].userData.status === 'resting' && block.position.z == newState.blocks[p].position.z && block.position.x == newState.blocks[p].position.x && Math.abs(block.position.y - newState.blocks[p].position.y) < 1){
                        checkValidMove = false
                    }
                }
            }
            if(checkValidMove == true){
                for(let i = 0; i<currentBlockGroup.length; i++){
                    currentBlockGroup[i].position.y -= .04;
                }                
            }
            else{
                //set all currentBlockGroup to resting
                for(let i = 0; i<currentBlockGroup.length; i++){
                    currentBlockGroup[i].userData.status = 'resting'
                }                    
            }
            break;
        }
        
        case 'up-z-axis' : {
            let checkValidMove = true //need to check if any block leaves the game board or runs into another block
            let currentBlockGroup = [];
            for(let i = 0; i<newState.blocks.length; i++){
                let block = newState.blocks[i];
                if (block.userData.status === 'falling'){
                    currentBlockGroup.push(block)
                }
            }
            for(let i = 0; i<currentBlockGroup.length; i++){
                if(currentBlockGroup[i].position.z + 1 > 2.5){
                    checkValidMove = false;
                }
            }
            //compare each of the currently falling blocks to every state block that is resting
            for(let i = 0; i<currentBlockGroup.length; i++){
                let block = currentBlockGroup[i]
                for(let p = 0; p<newState.blocks.length; p++){
                    if(newState.blocks[p].userData.status === 'resting' && block.position.z + 1 >= newState.blocks[p].position.z && block.position.x == newState.blocks[p].position.x && Math.abs(block.position.y - newState.blocks[p].position.y) < 1){
                        checkValidMove = false
                    }
                }
            }
            if(checkValidMove == true){
                for(let i = 0; i<currentBlockGroup.length; i++){
                    currentBlockGroup[i].position.z += 1;
                }                
            }
            break;
        }
        
        case 'down-z-axis' : {
            let checkValidMove = true //need to check if any block leaves the game board or runs into another block
            let currentBlockGroup = [];
            for(let i = 0; i<newState.blocks.length; i++){
                let block = newState.blocks[i];
                if (block.userData.status === 'falling'){
                    currentBlockGroup.push(block)
                }
            }
            for(let i = 0; i<currentBlockGroup.length; i++){
                if(currentBlockGroup[i].position.z - 1 < -2.5){
                    checkValidMove = false;
                }
            }
            //compare each of the currently falling blocks to every state block that is resting
            for(let i = 0; i<currentBlockGroup.length; i++){
                let block = currentBlockGroup[i]
                for(let p = 0; p<newState.blocks.length; p++){
                    if(newState.blocks[p].userData.status === 'resting' && block.position.z - 1 <= newState.blocks[p].position.z && block.position.x == newState.blocks[p].position.x && Math.abs(block.position.y - newState.blocks[p].position.y) < 1){
                        checkValidMove = false
                    }
                }
            }
            if(checkValidMove == true){
                for(let i = 0; i<currentBlockGroup.length; i++){
                    currentBlockGroup[i].position.z -= 1;
                }                
            }
            break;
        }
        case 'up-x-axis' : {
            let checkValidMove = true //need to check if any block leaves the game board or runs into another block
            let currentBlockGroup = [];
            for(let i = 0; i<newState.blocks.length; i++){
                let block = newState.blocks[i];
                if (block.userData.status === 'falling'){
                    currentBlockGroup.push(block)
                }
            }
            for(let i = 0; i<currentBlockGroup.length; i++){
                if(currentBlockGroup[i].position.x + 1 > 2.5){
                    checkValidMove = false;
                }
            }
            //compare each of the currently falling blocks to every state block that is resting
            for(let i = 0; i<currentBlockGroup.length; i++){
                let block = currentBlockGroup[i]
                for(let p = 0; p<newState.blocks.length; p++){
                    if(newState.blocks[p].userData.status === 'resting' && block.position.x + 1 >= newState.blocks[p].position.x && block.position.z == newState.blocks[p].position.z && Math.abs(block.position.y - newState.blocks[p].position.y) < 1){
                        checkValidMove = false
                    }
                }
            }
            if(checkValidMove == true){
                for(let i = 0; i<currentBlockGroup.length; i++){
                    currentBlockGroup[i].position.x += 1;
                }                
            }
            break;
        }
        case 'down-x-axis' : {
            let checkValidMove = true //need to check if any block leaves the game board or runs into another block
            let currentBlockGroup = [];
            for(let i = 0; i<newState.blocks.length; i++){
                let block = newState.blocks[i];
                if (block.userData.status === 'falling'){
                    currentBlockGroup.push(block)
                }
            }
            for(let i = 0; i<currentBlockGroup.length; i++){
                if(currentBlockGroup[i].position.x - 1 < -2.5){
                    checkValidMove = false;
                }
            }
            //compare each of the currently falling blocks to every state block that is resting
            for(let i = 0; i<currentBlockGroup.length; i++){
                let block = currentBlockGroup[i]
                for(let p = 0; p<newState.blocks.length; p++){
                    if(newState.blocks[p].userData.status === 'resting' && block.position.x - 1 <= newState.blocks[p].position.x && block.position.z == newState.blocks[p].position.z && Math.abs(block.position.y - newState.blocks[p].position.y) < 1){
                        checkValidMove = false
                    }
                }
            }
            if(checkValidMove == true){
                for(let i = 0; i<currentBlockGroup.length; i++){
                    currentBlockGroup[i].position.x -= 1;
                }                
            }
            break;
        }
        
        default: 
            break;
    }
    
    
    
    return newState
}



class VizViewer extends Component {
    constructor(props){
        super(props);
        this.AddBlock = this.AddBlock.bind(this)
        this.RotateYAxis = this.RotateYAxis.bind(this)
        this.RotateRightOnZAxis = this.RotateRightOnZAxis.bind(this)
        this.RotateLeftOnZAxis = this.RotateLeftOnZAxis.bind(this)
        this.state = {};
    }
    
    RotateYAxis(){
        store.dispatch({type: 'ROTATE_Y_AXIS'})
    }
    
    RotateRightOnZAxis(){
        store.dispatch({type: 'ROTATE_RIGHT_ON_Z_AXIS'})
    }
    
    RotateLeftOnZAxis(){
        store.dispatch({type: 'ROTATE_LEFT_ON_Z_AXIS'})
    }
    
    
    AddBlock(){
        store.dispatch({type: 'ADD_BLOCK_GROUP'})
    }
    
   

    _handleKeyDown = (event) => {
        switch( event.keyCode ) {
            case 27: //escape key
                console.log(event.keyCode)
                break;
            case 87: //w key
                store.dispatch({type: 'TRANSLATE_FALLING_GROUP', direction: 'up-z-axis'})
                break;
            case 83: //s key
                store.dispatch({type: 'TRANSLATE_FALLING_GROUP', direction: 'down-z-axis'})
                break;
            case 65: //a key
                store.dispatch({type: 'TRANSLATE_FALLING_GROUP', direction: 'up-x-axis'})
                break;
            case 68: //d key
                store.dispatch({type: 'TRANSLATE_FALLING_GROUP', direction: 'down-x-axis'})
                break;
            default: 
                break;
        }
    }


    componentWillMount(){
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }
    
    componentDidMount() {
        const height = this.divElement.clientHeight;
        this.setState({ height });
        const container = this.divElement
        scene = new THREE.Scene();
        
        //Game Board stuff
        var gridHelperBottom = new THREE.GridHelper( 6, 6 );
        var gridHelperTop = new THREE.GridHelper( 6, 6 );
        gridHelperTop.position.y = 20;
        scene.add( gridHelperBottom );
        scene.add( gridHelperTop );
        
        var topLeftGeometry = new THREE.Geometry();
        topLeftGeometry.vertices.push(new THREE.Vector3(3, 20, 3));
        topLeftGeometry.vertices.push(new THREE.Vector3(3, 0, 3));
        var topLeftLine = new THREE.Line(topLeftGeometry, materialOrange);
        scene.add(topLeftLine);
        
        var topRightGeometry = new THREE.Geometry();
        topRightGeometry.vertices.push(new THREE.Vector3(-3, 20, 3));
        topRightGeometry.vertices.push(new THREE.Vector3(-3, 0, 3));
        var topRightLine = new THREE.Line(topRightGeometry, materialOrange);
        scene.add(topRightLine);
        
        var botLeftGeometry = new THREE.Geometry();
        botLeftGeometry.vertices.push(new THREE.Vector3(3, 20, -3));
        botLeftGeometry.vertices.push(new THREE.Vector3(3, 0, -3));
        var botLeftLine = new THREE.Line(botLeftGeometry, materialOrange);
        scene.add(botLeftLine);
        
        var botRightGeometry = new THREE.Geometry();
        botRightGeometry.vertices.push(new THREE.Vector3(-3, 20, -3));
        botRightGeometry.vertices.push(new THREE.Vector3(-3, 0, -3));
        var botRightLine = new THREE.Line(botRightGeometry, materialOrange);
        scene.add(botRightLine);
        
        
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 3));
        geometry.vertices.push(new THREE.Vector3(0, 0, 10));
        geometry.vertices.push(new THREE.Vector3(2, 0, 7));
        geometry.vertices.push(new THREE.Vector3(-2, 0, 7));
        geometry.vertices.push(new THREE.Vector3(0, 0, 10));
        var line = new THREE.Line(geometry, materialOrange);
        scene.add(line);
        
        var z = new THREE.Geometry();
        z.vertices.push(new THREE.Vector3(1.5, 0, 5));
        z.vertices.push(new THREE.Vector3(.5, 0, 5));
        z.vertices.push(new THREE.Vector3(1.5, 0, 4.5));
        z.vertices.push(new THREE.Vector3(.5, 0, 4.5));
        var zline = new THREE.Line(z, materialOrange);
        scene.add(zline);
        //Game Board Stuff ^

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = -35;
        camera.position.y = 10;
        controls = new OrbitControls( camera );
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setClearColor(0x656868)
        renderer.setSize(window.innerWidth, window.innerHeight)
        container.appendChild(renderer.domElement);     
        store.dispatch({ type: 'init3js' })
        store.subscribe(render3js)
        store.dispatch({ type: 'UPDATE' })
    } 
    
    render(){
       return (
           <div className="appContainer">
           
                <div className="vizContainer" ref={ (divElement) => this.divElement = divElement}>
                </div>
                <Button color="primary" onClick={this.AddBlock}>button</Button>
                <Button color="danger" onClick={this.RotateLeftOnZAxis}>Rotate Left on Z Axis</Button>
                <Button color="accent" onClick={this.RotateRightOnZAxis}>Rotate Right On Z Axis</Button>
          </div>
        )
    }
}

export default VizViewer;