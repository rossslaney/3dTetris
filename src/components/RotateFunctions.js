// TODO : Create rotating functions that are testable, will need a total of 24 but after refactoring we can run them all through the same test suite
// these functions need to make sure that a rotate doesnt allow any blocks to exit the game board, and that no blocks collide/overlap 

//      PARAMS:  CURRENT_BLOCK_GROUP = the current group of blocks that are falling down
//               X_SIZE = the size of the game board on x axis
//               Z_SIZE = the size of the game board on z axis
// e.g. const VERTICAL_FACING_BOTTOM_Z_1 = (CURRENT_BLOCK_GROUP)




export const VERTICAL_FACING_BOTTOM_Z_1_ON_Z_AXIS = (newState, currentBlockGroup) => {
    let block1 = currentBlockGroup[0];
    let block2 = currentBlockGroup[1];
    let block3 = currentBlockGroup[2];
    let block4 = currentBlockGroup[3];
    console.log(block1.userData.head)
    
    let validMove = true;
    let testPositionX;
    let testPositionY;
    let testPositionZ;
    for(let p = 0; p<newState.blocks.length; p++){
                //block 1 doesnt move in this rotation
                
                //block2
                testPositionX = block1.position.x - 1;
                testPositionY = block1.position.y;
                testPositionZ = block1.position.z;
                
                //check for collision with blocks[p]
                if(testPositionX == newState.blocks[p].position.x && Math.abs(testPositionY - newState.blocks[p].position.y) < 1 && testPositionZ == newState.blocks[p].position.z){
                    validMove = false; 
                    break;
                }
                
                //check out of bounds on x or z axis
                if(testPositionX > 2.5 || testPositionX < -2.5 || testPositionZ > 2.5 || testPositionZ < -2.5){
                    console.log('triggered out of bounds')
                    validMove = false; 
                    break;
                }
                
                
                //block 3
                testPositionX = block1.position.x - 2;
                testPositionY = block1.position.y;
                testPositionZ = block1.position.z;
                
                //check for collision with blocks[p]
                if(testPositionX == newState.blocks[p].position.x && Math.abs(testPositionY - newState.blocks[p].position.y) < 1 && testPositionZ == newState.blocks[p].position.z){
                    validMove = false; 
                    break;
                }
                
                //check out of bounds on x or z axis
                if(testPositionX > 2.5 || testPositionX < -2.5 || testPositionZ > 2.5 || testPositionZ < -2.5){
                    validMove = false; 
                    break;
                }
                
                //block 4
                testPositionX = block1.position.x - 3;
                testPositionY = block1.position.y;
                testPositionZ = block1.position.z;
                
                //check for collision with blocks[p]
                if(testPositionX == newState.blocks[p].position.x && Math.abs(testPositionY - newState.blocks[p].position.y) < 1 && testPositionZ == newState.blocks[p].position.z){
                    validMove = false; 
                    break;
                }
                
                //check out of bounds on x or z axis
                if(testPositionX > 2.5 || testPositionX < -2.5 || testPositionZ > 2.5 || testPositionZ < -2.5){
                    validMove = false; 
                    break;
                }
    }
    
    //if valid move, make rotation
    if(validMove){
        currentBlockGroup[1].position.x = currentBlockGroup[0].position.x - 1;
        currentBlockGroup[1].position.y = currentBlockGroup[0].position.y;
                    
        currentBlockGroup[2].position.x = currentBlockGroup[0].position.x - 2;
        currentBlockGroup[2].position.y = currentBlockGroup[0].position.y;
                    
        currentBlockGroup[3].position.x = currentBlockGroup[0].position.x - 3;
        currentBlockGroup[3].position.y = currentBlockGroup[0].position.y;
        
        //update state data and block data for future use
        newState.headFacing = 'left'
        block1.userData.facing = 'left'
    }
    
    return newState
}

















export const VERTICAL_FACING_LEFT_Z_1_ON_AXIS = (newState, currentBlockGroup) => {
    let block1 = currentBlockGroup[0];
    let block2 = currentBlockGroup[1];
    let block3 = currentBlockGroup[2];
    let block4 = currentBlockGroup[3];
    console.log(block1.userData.head)
    
    let validMove = true;
    let testPositionX;
    let testPositionY;
    let testPositionZ;
    for(let p = 0; p<newState.blocks.length; p++){
                //block 1 doesnt move in this rotation
                
                //block2
                testPositionX = block1.position.x;
                testPositionY = block1.position.y + 1;
                testPositionZ = block1.position.z;
                
                //check for collision with blocks[p]
                if(testPositionX == newState.blocks[p].position.x && Math.abs(testPositionY - newState.blocks[p].position.y) < 1 && testPositionZ == newState.blocks[p].position.z){
                    validMove = false; 
                    break;
                }
                
                //check out of bounds on x or z axis
                if(testPositionX > 2.5 || testPositionX < -2.5 || testPositionZ > 2.5 || testPositionZ < -2.5){
                    console.log('triggered out of bounds')
                    validMove = false; 
                    break;
                }
                
                
                //block 3
                testPositionX = block1.position.x;
                testPositionY = block1.position.y + 2;
                testPositionZ = block1.position.z;
                
                //check for collision with blocks[p]
                if(testPositionX == newState.blocks[p].position.x && Math.abs(testPositionY - newState.blocks[p].position.y) < 1 && testPositionZ == newState.blocks[p].position.z){
                    validMove = false; 
                    break;
                }
                
                //check out of bounds on x or z axis
                if(testPositionX > 2.5 || testPositionX < -2.5 || testPositionZ > 2.5 || testPositionZ < -2.5){
                    validMove = false; 
                    break;
                }
                
                //block 4
                testPositionX = block1.position.x;
                testPositionY = block1.position.y + 3;
                testPositionZ = block1.position.z;
                
                //check for collision with blocks[p]
                if(testPositionX == newState.blocks[p].position.x && Math.abs(testPositionY - newState.blocks[p].position.y) < 1 && testPositionZ == newState.blocks[p].position.z){
                    validMove = false; 
                    break;
                }
                
                //check out of bounds on x or z axis
                if(testPositionX > 2.5 || testPositionX < -2.5 || testPositionZ > 2.5 || testPositionZ < -2.5){
                    validMove = false; 
                    break;
                }
    }
    
    //if valid move, make rotation
    if(validMove){
        currentBlockGroup[1].position.x = currentBlockGroup[0].position.x;
        currentBlockGroup[1].position.y = currentBlockGroup[0].position.y + 1;
                    
        currentBlockGroup[2].position.x = currentBlockGroup[0].position.x;
        currentBlockGroup[2].position.y = currentBlockGroup[0].position.y + 2;
                    
        currentBlockGroup[3].position.x = currentBlockGroup[0].position.x;
        currentBlockGroup[3].position.y = currentBlockGroup[0].position.y + 3;
        
        //update state data and block data for future use
        newState.headFacing = 'down'
        block1.userData.facing = 'down'
    }
    
    return newState
}


export const MyFunction3 = () => {}