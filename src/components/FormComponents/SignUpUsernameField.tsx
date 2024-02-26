import { EuiFieldText, EuiFormRow } from '@elastic/eui'
import React from 'react'

function SignUpUsernameField({
    label,
    icon,
    placeholder,
    value,
    isInvalid,
    error,
    setUsername,
} : {
    label: string;
    icon: string;
    placeholder: string;
    value: string | undefined;
    isInvalid: boolean;
    error: Array<string>,
    setUsername: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <EuiFormRow label={label} isInvalid={isInvalid} error={error}>
        <EuiFieldText 
            icon={icon}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setUsername(e.target.value)}
            isInvalid={isInvalid}
        />
    </EuiFormRow>
  )
}

export default SignUpUsernameField
