import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

const LineWithOr = () => {
  const isScreenLargeEnough = window.innerWidth >= 768;

  if (!isScreenLargeEnough) {
    return null; // Return null to hide the component on smaller screens
  }

  return (
    <EuiFlexGroup justifyContent="spaceAround" alignItems="center">
      <EuiFlexItem grow={false} style={{ width: '40%', borderBottom: '2px solid #000' }} />
      <EuiFlexItem grow={false}>
        <EuiText size="s" color="subdued">
          OR
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false} style={{ width: '40%', borderBottom: '2px solid #000' }} />
    </EuiFlexGroup>
  );
};

export default LineWithOr;
