import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React from 'react';

function LoginButton({ signIn}: {
    signIn: () => {};
}) {
    
  return (
    <EuiFlexGroup>
       
      <EuiFlexItem grow={true}>

        <EuiButton  
          fill
          onClick={ signIn }
          style={{color: 'white'}}
        > Sign In </EuiButton>

      </EuiFlexItem>

      {/* <EuiFlexItem grow={false}>

        <EuiText 
          color='danger'
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            paddingTop: "1rem"
          }}
        > 
        
        <p> Forget Password? </p> 
        
        </EuiText>

      </EuiFlexItem> */}
      
    </EuiFlexGroup>
  );
}

export default LoginButton;
