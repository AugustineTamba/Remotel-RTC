import { EuiCheckbox, EuiFormRow } from '@elastic/eui';

function SignUpCheckbox({ 
  id,
  label,
  checked,
  onChange,
  isInvalid,
  error,
}: {

  id: string;
  label: string;
  checked?: boolean;
  onChange: any; 
  isInvalid: boolean;
  error: Array<string>,
    
}) {

  return (
    <EuiFormRow  isInvalid={isInvalid} error={error}>
        <EuiCheckbox 
            label={label}
            id={id}
            checked={checked}
            onChange={onChange}
        />
    </EuiFormRow>
  );
}

export default SignUpCheckbox;
