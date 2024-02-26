import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React from 'react';

function SignUpButton({ signUp }: {
    signUp: () => {};
}) {

  return (
    <EuiFlexGroup>
       
      <EuiFlexItem grow={true}>

        <EuiButton 
          fullWidth  
          fill
          onClick={ signUp }
          style={{color: 'white'}}
        > Sign Up </EuiButton>

      </EuiFlexItem>
      
    </EuiFlexGroup>
  );
}

export default SignUpButton;
