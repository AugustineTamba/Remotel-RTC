import { EuiDatePicker, EuiFormRow } from '@elastic/eui';
import moment from 'moment';
import React from 'react';

export default function MeetingDateField({
  selected,
  setStartDate,
  label,

} : {
  selected: moment.Moment;
  setStartDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
  label: string;
}) {
  return ( 
    <EuiFormRow label={label}>
      <EuiDatePicker 
        selected={selected}
        onChange={(date) => setStartDate(date!)}
        minDate={moment().startOf('day')}
      />
    </EuiFormRow>   
  );
}

