import React, { Component } from 'react';
import { createStore } from 'redux'
import { Button } from 'muicss/react';

import * as RotateFunctions from "./RotateFunctions";
// ^ To use e.g. RotateFunctions.4VERTICAL_FACING_BOTTOM_Z_1(params, ...)

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
        case 'ROTATE_ON_Z_AXIS' : {
            const newState = RotateOnZAxis(state);
            return { ...newState, lastAction: 'ROTATE_X_AXIS' }
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
                currentFallingGroupType: '4VERTICAL',
                nextGroupType: '4VERTICAL'
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


const RotateOnZAxis = (state) => {
    const newState = { ...state }
    let finalState;
    let currentBlockGroup = [];
    for(let i = 0; i<newState.blocks.length; i++){
        let block = newState.blocks[i];
        if (block.userData.status === 'falling'){
            currentBlockGroup.push(block)
        }
    }
    //head facing is recorded as if viewing the block group when X-Axis is left-to-right, Y-Axis is top-to-bottom, and z axis increases as it goes further away from the viewer (from the initial orientation at application start)
    //there are a total of 6 possible head positions and 4 possible zOrientations
    if(newState.currentFallingGroupType === '4VERTICAL'){
        if(newState.headFacing == 'bottom'){
            if(newState.zOrientation == 1){
                finalState = RotateFunctions.VERTICAL_FACING_BOTTOM_Z_1_ON_Z_AXIS(newState, currentBlockGroup)
            }
            //4VERTICAL zOrientation doesnt matter because of its shape
            //... Will need to handle different zOrientations for different types of block groups
        }
        else if (newState.headFacing == 'left'){
            finalState = RotateFunctions.VERTICAL_FACING_LEFT_Z_1_ON_AXIS(newState, currentBlockGroup)
        }
        else if (newState.headFacing == 'top'){
            
        }
        else if (newState.headFacing == 'right'){
            
        }
        else if (newState.headFacing == 'out'){
            
        }
        else if (newState.headFacing == 'in'){
            
        }
    }

    console.log('ended translation section, waiting to render')
    
    return finalState;
}

const checkCompletedRows = (state) => {
    const newState = { ...state }
    
    return newState
}

const newBlockGroup = (state) => {
    const newState = { ...state }
    //every group has four blocks and starting position
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const box1 = new THREE.Mesh(geometry, materialOrange);
    const box2 = new THREE.Mesh(geometry, materialOrange);
    const box3 = new THREE.Mesh(geometry, materialOrange);
    const box4 = new THREE.Mesh(geometry, materialOrange);
    
    box1.userData.status = 'falling'; //box status property is used to denote its state of 'falling' or 'resting'
    
    //data for rotating group 
    box1.userData.head = true;
    box1.userData.headFacing = 'bottom'
    box1.userData.zOrientation = '1' //zOrientation is increments clockwise. If you rotate 90 degrees clockwise, the zOrientation increments by one
    
    newState.headFacing = 'bottom';
    newState.zOrientation = '1';
    
    box2.userData.status = 'falling';
    box3.userData.status = 'falling';
    box4.userData.status = 'falling';
    
    box1.position.y = 20 ;
    box1.position.x = 2.5;
    box1.position.z = 2.5;

    switch(newState.nextGroupType){
        case '4VERTICAL' : {
            newState.currentFallingGroupType = '4VERTICAL';
            box2.position.y = box1.position.y + 1;
            box2.position.x = box1.position.x;
            box2.position.z = box1.position.z;
            
            box3.position.y = box2.position.y + 1;
            box3.position.x = box1.position.x;
            box3.position.z = box1.position.z;
           
            box4.position.y = box3.position.y + 1;
            box4.position.x = box1.position.x;
            box4.position.z = box1.position.z;
        }
    }
    
    newState.scene.add(box1);
    newState.blocks.push(box1);
    newState.scene.add(box2);
    newState.blocks.push(box2);
    newState.scene.add(box3);
    newState.blocks.push(box3);
    newState.scene.add(box4);
    newState.blocks.push(box4);
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
        this.RotateOnZAxis = this.RotateOnZAxis.bind(this)
        this.state = {};
    }
    
    RotateYAxis(){
        store.dispatch({type: 'ROTATE_Y_AXIS'})
    }
    
    RotateOnZAxis(){
        store.dispatch({type: 'ROTATE_ON_Z_AXIS'})
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
                <Button color="danger" onClick={this.RotateYAxis}>Rotate Y Axis</Button>
                <Button color="accent" onClick={this.RotateOnZAxis}>Rotate On Z Axis</Button>
          </div>
        )
    }
}

export default VizViewer;