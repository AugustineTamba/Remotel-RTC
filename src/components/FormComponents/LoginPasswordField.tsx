import { EuiFieldPassword, EuiFormRow } from '@elastic/eui';
import React from 'react'

function LoginPasswordField({
    label,
    placeholder,
    type,
    value,
    isInvalid,
    error,
    setPassword,
} : {
    label: string;
    placeholder: string;
    type?: "dual" | "text";
    value: string | undefined;
    isInvalid: boolean;
    error: Array<string>,
    setPassword: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <EuiFormRow label={label} isInvalid={isInvalid} error={error}>
        <EuiFieldPassword 
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={isInvalid}
        />
    </EuiFormRow>
  )
}

export default LoginPasswordField
