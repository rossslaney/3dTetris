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
    
    for(let p = 0; p<newState.blocks.length; p++){
        //check that block1 doesnt go out of bounds or collide with another block 
        if(newState.blocks[p].userData.status === 'resting' && )
        
        //check that block2 doesnt go out of bounds or collide with another block 
        if(newState.blocks[p].userData.status === 'resting' && )
        
        //check that block3 doesnt go out of bounds or collide with another block 
        if(newState.blocks[p].userData.status === 'resting' && )
        
        //check that block4 doesnt go out of bounds or collide with another block 
        if(newState.blocks[p].userData.status === 'resting' && )
    }
    
    //if valid move, make rotation
    if(validMove){
        currentBlockGroup[1].position.x = currentBlockGroup[0].position.x - 1;
        currentBlockGroup[1].position.y = currentBlockGroup[0].position.y;
                    
        currentBlockGroup[2].position.x = currentBlockGroup[1].position.x - 1;
        currentBlockGroup[2].position.y = currentBlockGroup[1].position.y;
                    
        currentBlockGroup[3].position.x = currentBlockGroup[2].position.x - 1;
        currentBlockGroup[3].position.y = currentBlockGroup[2].position.y;
        
        newState.headFacing = 'left'
    }
    
    return newState
}






export const MyFunction2 = () => {}
export const MyFunction3 = () => {}