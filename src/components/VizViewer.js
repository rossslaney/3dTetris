import React, { Component } from 'react';
import { createStore } from 'redux'
import { Button } from 'muicss/react';

var THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)


let scene;
let camera;
let renderer;
let controls;

let ColumnTops = [] //store the resting position (top of the column) y value for each column in the 2d array of possible y values
for (var i = 0; i<6; i++){
    for (var p = 0; p<6; p++){
        var obj = {};
        obj.x = i;
        obj.y = p;
        obj.ColumnTop = 0.5;
        ColumnTops.push(obj)
    }
}

//define colors
const materialOrange = new THREE.MeshBasicMaterial({ color: 0xffa500 });
//...


//Action Functions. Used in the redux reducer switch statement
const updateFalling = (state) => {
    const newState = { ...state }
    
    for(let i = 0; i<newState.blocks.length; i++){
        let block = newState.blocks[i];
        if (block.userData.status === 'falling'){
            //find column height of current column
            console.log(block.userData)
            let GridXVal = block.position.x + 2.5;
            let GridYVal = block.position.z + 2.5;
            const index = newState.ColumnTops.findIndex(item => item.x === GridXVal && item.y === GridYVal);
            console.log(index, GridXVal, GridXVal, 'index, grid vals')
            let top = newState.ColumnTops[index].ColumnTop;

            if(block.position.y > top){
                newState.blocks[i].position.y = newState.blocks[i].position.y - 0.02
            }
            else{
                newState.blocks[i].userData.status = 'resting'
                newState.ColumnTops[index].ColumnTop += 1;
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
    //head facing is recorded as if viewing the block group when X-Axis is left-to-right, Y-Axis is top-to-bottom, and z axis increases as it goes further away from the viewer
    //there are a total of 6 possible head positions and 4 possible zOrientations
    
    if(newState.currentFallingGroupType === '4VERTICAL'){
        if(newState.headFacing == 'bottom'){
            if(newState.zOrientation == 1){
                console.log('entered translation section')
                currentBlockGroup[1].position.x = currentBlockGroup[0].position.x - 1;
                currentBlockGroup[1].position.y = currentBlockGroup[0].position.y;
                
                currentBlockGroup[2].position.x = currentBlockGroup[1].position.x - 1;
                currentBlockGroup[2].position.y = currentBlockGroup[1].position.y;
                
                currentBlockGroup[3].position.x = currentBlockGroup[2].position.x - 1;
                currentBlockGroup[3].position.y = currentBlockGroup[2].position.y;
            }
            //...
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
                ColumnTops: ColumnTops,
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