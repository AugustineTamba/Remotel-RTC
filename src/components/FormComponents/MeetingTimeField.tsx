import { EuiDatePicker, EuiFormRow } from '@elastic/eui';
import moment from 'moment';
import React from 'react';

export default function MeetingTimeField({
  selected,
  setStartTime,
  label,

} : {
  selected: moment.Moment;
  setStartTime: React.Dispatch<React.SetStateAction<moment.Moment>>;
  label: string;
}) {
    // Set initial time to the current time
  const initialTime = moment().startOf('m');  

  return ( 
    
    <EuiFormRow label={label}>
      <EuiDatePicker 
        showTimeSelect
        selected={selected}
        showTimeSelectOnly
        // minTime={moment().startOf('m')}
        // maxTime={moment().endOf('day')}
        onChange={(time) => setStartTime(time!)}
        excludeTimes={[
            moment().startOf('minutes'),
            moment().endOf('day'),
        ]}
        dateFormat="LT"
        injectTimes={[initialTime]} // Add the initial time
        timeIntervals={15}
      />
    </EuiFormRow>

    
  );
}

