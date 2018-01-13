import React, { Component } from 'react';
import { createStore } from 'redux'
import { Button } from 'muicss/react';

var THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)


          let scene;
          let camera;
          let renderer;
          let controls;
        

    //3js functions 
      const changeMaterial = (state) => {
        const newState = { ...state }
        newState.scene.getObjectByName('box').material.wireframe = !newState.scene.getObjectByName('box').material.wireframe
        return newState
      }
      
      
      const rotate = (state) => {
        const newState = { ...state }
        let position = newState.scene.getObjectByName('box').position.y
        if(position > 0.6){
            newState.scene.getObjectByName('box').position.y =  newState.scene.getObjectByName('box').position.y - 0.05
            newState.scene.getObjectByName('box2').position.y =  newState.scene.getObjectByName('box2').position.y - 0.05
        }
        return newState
      }
      
        //REDUX REDUCER
  const rootReducer = (state, action) => {
      switch (action.type) {
        case 'CHANGE_MATERIAL': {
            const newState = changeMaterial(state)
            return { ...newState, lastAction: 'CHANGE_MATERIAL' }
         }
        case 'UPDATE': {
            const newState = rotate(state)
            return { ...newState, lastAction: 'UPDATE' }
         }
         case 'init3js' : {
            const initState = {
              scene,
              camera,
              lastAction: ''
            }
            console.log("new state:", initState);
            return initState;
         }
         default:
            return state
         }
  }
  //REDUX REDUCER ^
        const store = createStore(rootReducer, this.state)
        
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
        this.state = {};
    }
    
    
    AddBlock(){
        store.dispatch({type: 'CHANGE_MATERIAL'})
    }
    
    componentDidMount() {
        const height = this.divElement.clientHeight;
        this.setState({ height });
        
        const container = this.divElement
        console.log(container)
        
        scene = new THREE.Scene();



      var gridHelper = new THREE.GridHelper( 6, 6 );
      scene.add( gridHelper );
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xffa500 });
      const box = new THREE.Mesh(geometry, material);
        let geometry2 = new THREE.BoxGeometry(1, 1, 1);
        let box2 = new THREE.Mesh(geometry2, material);
        box2.position.y = 10;
        box2.position.x = 1.5;
        box2.position.z = 0.5
        box2.name = 'box2'
        scene.add(box2)
        
      box.name = 'box';
      box.position.y = 10;
      box.position.x = 0.5;
      box.position.z = 0.5;
      scene.add(box)
      
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = -12;
      camera.position.y = 5;
      controls = new OrbitControls( camera );
      //controls.addEventListener( 'change', render3js );


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
                <Button color="danger">button</Button>
                <Button color="accent">button</Button>
          </div>
        )
    }
}

export default VizViewer;