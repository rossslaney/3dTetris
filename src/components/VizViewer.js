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


//define colors
const materialOrange = new THREE.MeshBasicMaterial({ color: 0xffa500 });
//...
//...


const updateFalling = (state) => {
    const newState = { ...state }
    if(newState.blocks !== undefined && newState.blocks.length > 0){
        for(let i = 0; i<newState.blocks.length; i++){
            let block = newState.blocks[i];
            if (block.userData.status === 'falling'){
                let stillFall = true;
                //catch all blocks that reach the bottom
                if(block.position.y < 0.5){
                    stillFall = false;
                }
                else{
                    //check resting blocks if falling block is 1 above any resting blocks
                    for(let p = 0; p<newState.blocks.length; p++){
                        let checkBlock = newState.blocks[p]
                        if (block != checkBlock && block.position.x == checkBlock.position.x && block.position.z == checkBlock.position.z && block.position.y < checkBlock.position.y + 1 && checkBlock.userData.status === 'resting'){
                            stillFall = false;
                            break;
                        }
                    }
                }
                if(stillFall == true){
                    block.position.y = block.position.y - 0.04
                }
                else{
                    //set all falling blocks to resting
                    for(let p = 0; p<newState.blocks.length; p++){
                        newState.blocks[p].userData.status = 'resting'
                        /*
                        let y = newState.blocks[p].position.y
                        y = Math.max( Math.round(y * 10) / 10 ).toFixed(2);
                        newState.blocks[p].position.y = y
                        */
                    }
                }
            }
        }        
    }
    return newState
}

const RotateXAxis = (state) => {
    const newState = { ...state }
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
                currentBlockGroup[1].position.x = currentBlockGroup[0].position.x - 1;
                currentBlockGroup[1].position.y = currentBlockGroup[0].position.y;
                
                currentBlockGroup[2].position.x = currentBlockGroup[1].position.x - 1;
                currentBlockGroup[2].position.y = currentBlockGroup[1].position.y;
                
                currentBlockGroup[3].position.x = currentBlockGroup[2].position.x - 1;
                currentBlockGroup[3].position.y = currentBlockGroup[2].position.y;
            }
            //4VERTICAL zOrientation doesnt matter because of its shape
        }
        else if (newState.headFacing == 'left'){
            
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
    
    return newState;
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
    console.log(direction)
    const newState = { ...state }
    let currentBlockGroup = [];
    for(let i = 0; i<newState.blocks.length; i++){
        let block = newState.blocks[i];
        if (block.userData.status === 'falling'){
            currentBlockGroup.push(block)
        }
    }
    
    switch(direction){
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

//REDUX REDUCER
const rootReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_BLOCK_GROUP' : {
            const newState = newBlockGroup(state);
            return { ...newState, lastAction: 'ADD_BLOCK_GROUP' }
        }
        case 'ROTATE_X_AXIS' : {
            const newState = RotateXAxis(state);
            return { ...newState, lastAction: 'ROTATE_X_AXIS' }
        }
        case 'TRANSLATE_FALLING_GROUP' : {
            const newState = TranslateFallingGroup(state, action.direction)
            return { ...newState, lastAction: 'MOVE_FALLING_GROUP' }
        }
        case 'UPDATE': {
            const newState = updateFalling(state)
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

//Render loop
const render3js = () => {
    if(store.getState().lastAction === 'UPDATE'){
        renderer.render(store.getState().scene, store.getState().camera);
        requestAnimationFrame(() => store.dispatch({ type: 'UPDATE' }));
    }
} 











class VizViewer extends Component {
    constructor(props){
        super(props);
        this.AddBlock = this.AddBlock.bind(this)
        this.RotateYAxis = this.RotateYAxis.bind(this)
        this.RotateXAxis = this.RotateXAxis.bind(this)
        this.state = {};
    }
    
    RotateYAxis(){
        store.dispatch({type: 'ROTATE_Y_AXIS'})
    }
    
    RotateXAxis(){
        store.dispatch({type: 'ROTATE_X_AXIS'})
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
        var gridHelperBottom = new THREE.GridHelper( 6, 6 );
        var gridHelperTop = new THREE.GridHelper( 6, 6 );
        gridHelperTop.position.y = 20;
        scene.add( gridHelperBottom );
        scene.add( gridHelperTop );
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = -35;
        camera.position.y = 10;
        controls = new OrbitControls( camera );
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setClearColor(0xf0ffff)
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
                <Button color="accent" onClick={this.RotateXAxis}>Rotate X Axis</Button>
          </div>
        )
    }
}

export default VizViewer;