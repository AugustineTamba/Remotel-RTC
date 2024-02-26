import { EuiFieldText, EuiFormRow } from '@elastic/eui'
import React from 'react'

function LoginEmailField({
    label,
    icon,
    placeholder,
    value,
    isInvalid,
    error,
    setEmail,
} : {
    label: string;
    icon: string;
    placeholder: string;
    value: string | undefined;
    isInvalid: boolean;
    error: Array<string>,
    setEmail: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <EuiFormRow fullWidth label={label} isInvalid={isInvalid} error={error}>
        <EuiFieldText 
            icon={icon}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={isInvalid}
        />
    </EuiFormRow>
  )
}

export default LoginEmailField
