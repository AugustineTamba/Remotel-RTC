import React, { useEffect, useState } from 'react'
import { FieldErrorType, MeetingType, UserType } from '../utils/Types';
import { EuiFlyout, EuiFlyoutBody, EuiFlyoutHeader, EuiForm, EuiFormRow, EuiSpacer, EuiSwitch, EuiTitle } from '@elastic/eui';
import UseAuth from '../hooks/useAuth';
import UseFetchUsers from '../hooks/useFetchUsers';
import UseToast from '../hooks/useToast';
import moment from 'moment';
import MeetingNameField from './FormComponents/MeetingNameField';
import MeetingUsersField from './FormComponents/MeetingUsersField';
import MeetingDateField from './FormComponents/MeetingDateField';
import MeetingMaximumUserField from './FormComponents/MeetingMaximumUserField';
import CreateMeetingButtons from './FormComponents/CreateMeetingButtons';
import { doc, updateDoc } from 'firebase/firestore';
import { firebaseDB } from '../utils/FirebaseConfig';
import MeetingTimeField from './FormComponents/MeetingTimeField';

function EditFlyout({ 
    closeFlyout, 
    meetings
} : {
    closeFlyout: any;
    meetings: MeetingType
}) {

  UseAuth();
  const [users] = UseFetchUsers();
  const [createToast] = UseToast();
  const [meetingName, setMeetingName] = useState(meetings.meetingName);
  const [selectedUser, setSelectedUser] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment(meetings.meetingDate));
  const [startTime, setStartTime] = useState(moment(meetings.meetingDate)); // Default to the current hour
  const [size, setSize] = useState(1);
  const [meetingType] = useState(meetings.meetingType);
  const [status, setStatus] = useState(false);
  const [showErrors] = useState<{
    meetingName: FieldErrorType;
    meetingUsers: FieldErrorType;
  }>({
    meetingName: {
      show: false,
      message: [],
    },
    meetingUsers: {
      show: false,
      message: [],
    },
  });
  
  useEffect(() =>{
    if(users) {
        const foundUsers :Array<UserType> = [];
        meetings.invitedUsers.forEach((user:string) =>{
            const findUser = users.find(
                (tempUser:UserType) => tempUser.uid === user
            );
            if(findUser) foundUsers.push(findUser);
        })
        setSelectedUser(foundUsers)
    }
  }, [meetings, users])

  const onUserChange = (selectedOptions: Array<UserType>) => {
    setSelectedUser(selectedOptions);
  };


  const editMeeting = async () => {
    
    const editedMeeting = {
      ...meetings,
      meetingName,
      meetingType,
      invitedUsers: selectedUser.map((user: UserType) => user.uid),
      maxUsers: size,
      meetingDate: startDate.format("L"),
      meetingTime: startTime.format("LT"),
      status: !status,
    };
    delete editedMeeting.docId;
    const docRef = doc(firebaseDB, "meetings", meetings.docId!);
    await updateDoc(docRef, editedMeeting);
    createToast({ title: "Meeting updated successfully.", type: "success" });
    closeFlyout(true);
  };

  return (
    <EuiFlyout ownFocus onClose={() => closeFlyout()}>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>{meetings.meetingName}</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiForm>
          <MeetingNameField
            label="Meeting name"
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
            placeholder="Meeting name"
            value={meetingName}
            setMeetingName={setMeetingName}
          />
          {meetingType === "anyone-can-join" ? (
            <MeetingMaximumUserField value={size} setValue={setSize} />
          ) : (
            <MeetingUsersField
              label="Invite Users"
              isInvalid={showErrors.meetingUsers.show}
              error={showErrors.meetingUsers.message}
              options={users}
              onChange={onUserChange}
              selectedOptions={selectedUser}
              singleSelection={
                meetingType === "1-on-1" ? { asPlainText: true } : false
              }
              isClearable={false}
              placeholder="Select a Users"
            />
          )}

          <MeetingDateField 
            label='Set a Date'
            selected={startDate}
            setStartDate={setStartDate}
          />
          <MeetingTimeField 
            label='Set a Time'
            selected={startTime}
            setStartTime={setStartTime}
          />

          <EuiFormRow display="columnCompressedSwitch" label="Cancel Meeting">
            <EuiSwitch
              showLabel={false}
              label="Cancel Meeting"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
          </EuiFormRow>
          <EuiSpacer />
          <CreateMeetingButtons
            createMeeting={editMeeting}
            isEdit
            closeFlyout={closeFlyout}
          />
        </EuiForm>
      </EuiFlyoutBody>
    </EuiFlyout> 
  )
}

export default EditFlyout
