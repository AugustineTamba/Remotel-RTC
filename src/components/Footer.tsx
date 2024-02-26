import React from 'react';
import {
  EuiBottomBar,
  EuiFlexItem,
  EuiText,
} from '@elastic/eui';

function Footer() {

    const currentYear = () => {
        return (new Date()).getFullYear();
    }

  return (
    <EuiBottomBar>
        <EuiFlexItem grow={false}>
            <EuiText textAlign="center">
                <p>
                    Copyright © {currentYear()}
                    <a href="https://augustinetamba.com"> Augustine. </a> All Rights Reserved
                </p>
            </EuiText>
        </EuiFlexItem>
      </EuiBottomBar>
  )
}

export default Footer
