import React, { useState } from 'react';
import Header from '../components/Header';
import { EuiFlexGroup, EuiForm, EuiSpacer } from '@elastic/eui';
import MeetingNameField from '../components/FormComponents/MeetingNameField';
import MeetingUsersField from '../components/FormComponents/MeetingUsersField';
import useAuth from '../hooks/useAuth';
import useFetchUsers from '../hooks/useFetchUsers';
import moment from 'moment';
import MeetingDateField from '../components/FormComponents/MeetingDateField';
import CreateMeetingButtons from '../components/FormComponents/CreateMeetingButtons';
import { FieldErrorType, UserType } from '../utils/Types';
import { addDoc } from 'firebase/firestore';
import { meetingsRef } from '../utils/FirebaseConfig';
import { generateMeetingID } from '../utils/generateMeetingID';
import { useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import MeetingTimeField from '../components/FormComponents/MeetingTimeField';
import Footer from '../components/Footer';

export default function OneOnOneMeeting() {

  useAuth();
  const [users] = useFetchUsers();
  const navigate = useNavigate();
  const [createToast] = useToast();
  const uid = useAppSelector((zoom) => zoom.auth.userInfo?.uid );
  const [meetingName, setMeetingName] = useState('');
  const [selectUsers, setSelectUsers] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment());
  const [startTime, setStartTime] = useState(moment().startOf('m')); // Default to the current hour
  const [showErrors, setShowErrors] = useState<{
    meetingName: FieldErrorType;
    meetingUser: FieldErrorType;
  }>({
    meetingName: {
      show: false,
      message: [],
    },

    meetingUser: {
      show: false,
      message: [],
    },
  });


  const onUserChange = (selectedOptions: Array<UserType>) => {
    setSelectUsers(selectedOptions)
  };

  const validateForm = () => {
    const clonedShowErrors = {...showErrors}
    let errors = false;

    if (!meetingName.length) {
      clonedShowErrors.meetingName.show = true;
      clonedShowErrors.meetingName.message = [" Please Enter Meeting Name !"];
      errors = true;
    } else {
      clonedShowErrors.meetingName.show = false;
      clonedShowErrors.meetingName.message = [];
    }
    
    if (!selectUsers.length) {
      clonedShowErrors.meetingUser.show = true;
      clonedShowErrors.meetingUser.message = [" Please Select a User !"];
      errors = true;
    } else {
      clonedShowErrors.meetingUser.show = false;
      clonedShowErrors.meetingUser.message = [];
    }
    setShowErrors(clonedShowErrors);
    return errors;
  } ;

  const createMeeting = async () => {
    if (!validateForm()) {
      const meetingId = generateMeetingID();
      await addDoc(meetingsRef, {
        createdBy: uid,
        meetingId,
        meetingName,
        meetingType: '1-on-1',
        invitedUsers: [selectUsers[0].uid],
        meetingDate: startDate.format("L"),
        meetingTime: startTime.format("LT"),
        maxUsers: 1,
        status: true,
      });
    
      createToast({
        title: "One on One meeting created Successfully",
        type: "success",
      });

      navigate("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
      }}
    >
      <Header />
      <EuiFlexGroup
        justifyContent='center'
        alignItems='center'
      >
        <EuiForm>
          <MeetingNameField
            label="Meeting Name"
            placeholder="Meeting Name"
            value={meetingName}
            setMeetingName={setMeetingName}
            isInvalid = {showErrors.meetingName.show}
            error = {showErrors.meetingName.message}
          />
          
          <MeetingUsersField 
            label="Invite User"
            isInvalid={showErrors.meetingUser.show}
            error={showErrors.meetingUser.message}
            options={users}
            onChange={onUserChange}
            selectedOptions={selectUsers}
            singleSelection={{ asPlainText: true }}
            isClearable={false}
            placeholder="Select a User"
          />

          <MeetingDateField 
            label='Set a Date'
            selected={startDate}
            setStartDate={setStartDate}
          />
          
          <EuiSpacer />
          
          <MeetingTimeField 
            label='Set a Time'
            selected={startTime}
            setStartTime={setStartTime}
          />

          <EuiSpacer />

          <CreateMeetingButtons createMeeting={createMeeting} />

        </EuiForm>
      </EuiFlexGroup>
      <Footer />
    </div>
  );
}