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
            const newState = Rotate(state, 'right-on-z-axis');
            return { ...newState, lastAction: 'ROTATE' }
        }
        case 'ROTATE_LEFT_ON_Z_AXIS' : {
            const newState = Rotate(state, 'left-on-z-axis');
            return { ...newState, lastAction: 'ROTATE' }
        }
        case 'ROTATE_UP_ON_X_AXIS' : {
            const newState = Rotate(state, 'up-on-x-axis');
            return { ...newState, lastAction: 'ROTATE' }
        }
        case 'ROTATE_DOWN_ON_X_AXIS' : {
            const newState = Rotate(state, 'down-on-x-axis');
            return { ...newState, lastAction: 'ROTATE' }
        }
        case 'ROTATE_UP_ON_Y_AXIS' : {
            const newState = Rotate(state, 'up-on-y-axis');
            return { ...newState, lastAction: 'ROTATE' }
        }
        case 'ROTATE_DOWN_ON_Y_AXIS' : {
            const newState = Rotate(state, 'down-on-y-axis');
            return { ...newState, lastAction: 'ROTATE' }
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
                nextGroupType: ZShape
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





//game height variable
let GAME_HEIGHT = 20;
let GAME_WIDTH = 6;

//define colors
const materialOrange = new THREE.MeshBasicMaterial({ color: 0xffa500 ,transparent: true, opacity: 0.5});
const materialBlue = new THREE.MeshBasicMaterial({ color: 0x0900ff ,transparent: true, opacity: 0.5});
const materialGreen = new THREE.MeshBasicMaterial({ color: 0x00FF09 ,transparent: true, opacity: 0.5});
const materialWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
//...

const FourVert = {
    material: materialOrange,
    blocks: [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 2, z: 0},
        {x: 0, y: 3, z: 0}
    ]
 }
 
const TShape = {
    material: materialBlue,
    blocks: [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 2, z: 0},
        {x: 1, y: 1, z: 0}
    ]
 }
 
const ZShape = {
    material: materialGreen,
    blocks: [
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 2, y: 1, z: 0}
    ]
 }
 
const LShape = {
    material: materialOrange,
    blocks: [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 2, z: 0},
        {x: 1, y: 0, z: 0}
    ]
 }
 
const BigSquare = {
    material: materialOrange,
    blocks: [
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 0, z: 1},
        {x: 1, y: 0, z: 1},
        {x: 1, y: 1, z: 1},
        {x: 0, y: 1, z: 1}
    ]
 }
 

//send x,y locations for z axis
//y,z locations for x axis
//z,x for y axis
//first two variables are point to rotate around
function rotateHelper(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

const Rotate = (state, directionString) => {
    let newState = { ...state }
    if(newState.currentFallingGroupType == BigSquare){
        return newState;
    }
    let validMove = true;
    let testX;
    let testY;
    let testZ;
    let testBlocks = [];
    let restingBlocks = []; //get all resting blocks with for loop
    
    switch(directionString){
        case 'right-on-z-axis' : {
            for(let i = 0; i<newState.currentBlockGroup.length; i++){
                let block = newState.currentBlockGroup[i];
                let retArray = rotateHelper(newState.currentBlockGroup[0].position.x, newState.currentBlockGroup[0].position.y, block.position.x, block.position.y, -90);
                let obj = {};
                obj.x = retArray[0];
                obj.y = retArray[1];
                obj.z = block.position.z;
                testBlocks.push(obj);
            }
            break;
        }
        case 'left-on-z-axis' : {
            for(let i = 0; i<newState.currentBlockGroup.length; i++){
                let block = newState.currentBlockGroup[i];
                let retArray = rotateHelper(newState.currentBlockGroup[0].position.x, newState.currentBlockGroup[0].position.y, block.position.x, block.position.y, 90);
                let obj = {};
                obj.x = retArray[0];
                obj.y = retArray[1];
                obj.z = block.position.z;
                testBlocks.push(obj);
            }
            break;
        }
        case 'up-on-x-axis' : {
            for(let i = 0; i<newState.currentBlockGroup.length; i++){
                let block = newState.currentBlockGroup[i];
                let retArray = rotateHelper(newState.currentBlockGroup[0].position.y, newState.currentBlockGroup[0].position.z, block.position.y, block.position.z, -90);
                block.position.y = retArray[0];
                block.position.z = retArray[1];
                let obj = {};
                obj.y = retArray[0];
                obj.z = retArray[1];
                obj.x = block.position.x;
                testBlocks.push(obj);
            }
            break;
        }
        case 'down-on-x-axis' : {
            for(let i = 0; i<newState.currentBlockGroup.length; i++){
                let block = newState.currentBlockGroup[i];
                let retArray = rotateHelper(newState.currentBlockGroup[0].position.y, newState.currentBlockGroup[0].position.z, block.position.y, block.position.z, -90);
                let obj = {};
                obj.y = retArray[0];
                obj.z = retArray[1];
                obj.x = block.position.x;
                testBlocks.push(obj);
            }
            break;
        }
        case 'up-on-y-axis' : {
            for(let i = 0; i<newState.currentBlockGroup.length; i++){
                let block = newState.currentBlockGroup[i];
                let retArray = rotateHelper(newState.currentBlockGroup[0].position.z, newState.currentBlockGroup[0].position.x, block.position.z, block.position.x, -90);
                block.position.z = retArray[0];
                block.position.x = retArray[1];
                let obj = {};
                obj.z = retArray[0];
                obj.x = retArray[1];
                obj.y = block.position.y;
                testBlocks.push(obj);
            }
            break;
        }
        case 'down-on-y-axis' : {
            for(let i = 0; i<newState.currentBlockGroup.length; i++){
                let block = newState.currentBlockGroup[i];
                let retArray = rotateHelper(newState.currentBlockGroup[0].position.z, newState.currentBlockGroup[0].position.x, block.position.z, block.position.x, 90);
                let obj = {};
                obj.z = retArray[0];
                obj.x = retArray[1];
                obj.y = block.position.y;
                testBlocks.push(obj);
            }
            break;
        }
    }
    //test the test locations against out of bounds
    for(let i = 0; i<testBlocks.length; i++){
        testX = testBlocks[i].x;
        testY = testBlocks[i].y;
        testZ = testBlocks[i].z;
        if(testX > 2.5 || testX < -2.5 || testZ > 2.5 || testZ < -2.5 || testY < 0.5){
            validMove = false; 
        } 
    }
    //test new locations against resting blocks
    for(let i = 0; i<newState.blocks.length; i++){
        if(newState.blocks[i].userData.status != 'falling'){
            for(let p = 0; p<testBlocks.length; p++){
                 if(testBlocks[p].x == newState.blocks[i].position.x && Math.abs(testBlocks[p].y - newState.blocks[i].position.y) < 1 && testBlocks[p].z == newState.blocks[i].position.z){
                    validMove = false; 
                    break;
                }               
            }
        }
    }
    
    //place blocks in new locations if valid move
    console.log(validMove);
    if(validMove){
        for(let i = 0; i<testBlocks.length; i++){
            newState.currentBlockGroup[i].position.x = testBlocks[i].x;
            newState.currentBlockGroup[i].position.y = testBlocks[i].y;
            newState.currentBlockGroup[i].position.z = testBlocks[i].z;
        }
    }
    else{
        newState.successOnRotate = false;
    }   
    return newState;
}


const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


//** Currently working on this function **/
const checkCompletedRows = (state) => {
    const newState = { ...state }
    let currentRestingBlocks = [];
    let total = GAME_WIDTH * GAME_WIDTH;
    let blocksByHeight = [...new Array(GAME_HEIGHT)].map(x => 0);
    let deleteBlocks = [];
    for(let p = 0; p<newState.blocks.length; p++){
        if(newState.blocks[p].userData.status === 'resting'){
            currentRestingBlocks.push({height: Math.round(newState.blocks[p].position.y), block: newState.blocks[p]})
        }
    }
    //if all the blocks are resting, then check for levels
    if(currentRestingBlocks.length == newState.blocks.length){
        for(let i = 0; i<currentRestingBlocks.length; i++){
            let blockHeight = Math.round(currentRestingBlocks[i].block.position.y);
            blocksByHeight[blockHeight] += 1;
        }

    }
    //check if any value in blocksByHeight = total
    let height = blocksByHeight.indexOf(total);
    console.log('height: ', height)
    if(height != -1){
        //get all block at height, set material to white, wait a timeout, and then delete
        
        for(let i = 0; i<currentRestingBlocks.length; i++){
                console.log('inside timeout function')
                if(currentRestingBlocks[i].height == height){
                    let block = currentRestingBlocks[i].block;
                    deleteBlocks.push(block);
                    block.material = materialWhite;                  
                }
        }
        
        wait(500).then(() => {
            for(let p= 0; p<deleteBlocks.length; p++){
                console.log('inside delete blockds')
                newState.scene.remove(deleteBlocks[p])
                let index = newState.blocks.indexOf(deleteBlocks[p]);
                console.log('index: ', index)
                if (index > -1) {
                    console.log('inside remove from game blocks')
                    newState.blocks.splice(index, 1);
                }
            }
        });
        
        //move resting blocks above the height level down one
        for(let i = 0; i<newState.blocks.length; i++){
            newState.blocks[i].userData.status = 'falling';
        }

        //ADD TO SCORE
    }
    
    return newState
}

const typeArr = [FourVert, TShape, ZShape, LShape, BigSquare]
const generateRandomGroupType = () => {
    return typeArr[Math.floor(Math.random() * 5)]
}

const newBlockGroup = (state) => {
    let newState = { ...state }
    newState.currentFallingGroupType = newState.nextGroupType;
    console.log(newState.currentFallingGroupType)
    newState.nextGroupType = generateRandomGroupType();
    newState.currentBlockGroup = []
    const geometry = new THREE.BoxGeometry(1, 1, 1); //move this so its only declared at init
    for(let i = 0; i<newState.currentFallingGroupType.blocks.length; i++){
        const box = new THREE.Mesh(geometry, newState.currentFallingGroupType.material);
        box.userData.status = 'falling'; //status is used for collision detections
        box.position.y = GAME_HEIGHT + newState.currentFallingGroupType.blocks[i].y;
        box.position.x = 0.5 + newState.currentFallingGroupType.blocks[i].x;
        box.position.z = 0.5 + newState.currentFallingGroupType.blocks[i].z;
        newState.scene.add(box);
        newState.blocks.push(box);
        newState.currentBlockGroup.push(box);
    }
    console.log(newState)
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
        this.RotateRightOnZAxis = this.RotateRightOnZAxis.bind(this)
        this.RotateLeftOnZAxis = this.RotateLeftOnZAxis.bind(this)
        this.state = {};
    }
    
    RotateUpOnYAxis(){
        store.dispatch({type: 'ROTATE_UP_ON_Y_AXIS'})
    }
    RotateDownOnYAxis(){
        store.dispatch({type: 'ROTATE_DOWN_ON_Y_AXIS'})
    }
     
    RotateRightOnZAxis(){
        store.dispatch({type: 'ROTATE_RIGHT_ON_Z_AXIS'})
    }
    
    RotateLeftOnZAxis(){
        store.dispatch({type: 'ROTATE_LEFT_ON_Z_AXIS'})
    }
    
    RotateUpOnXAxis(){
        store.dispatch({type: 'ROTATE_UP_ON_X_AXIS'})
    }
    
    RotateDownOnXAxis(){
        store.dispatch({type: 'ROTATE_DOWN_ON_X_AXIS'})
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
                <Button color="danger" onClick={this.RotateUpOnXAxis}>Rotate up on x Axis</Button>
                <Button color="accent" onClick={this.RotateDownOnXAxis}>Rotate down On x Axis</Button>
                <Button color="danger" onClick={this.RotateUpOnYAxis}>Rotate up on y Axis</Button>
                <Button color="accent" onClick={this.RotateDownOnYAxis}>Rotate down On y Axis</Button>
          </div>
        )
    }
}

export default VizViewer;