import React, { useCallback, useEffect, useState } from 'react'
import Header from '../components/Header'
import { EuiBadge, EuiBasicTable, EuiButtonIcon, EuiCopy, EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui'
import { MeetingType } from '../utils/Types'
import { getDocs, query, where } from 'firebase/firestore'
import { meetingsRef } from '../utils/FirebaseConfig'
import { useAppSelector } from '../app/hooks'
import UseAuth from '../hooks/useAuth'
import moment from 'moment'
import { Link } from 'react-router-dom'
import EditFlyout from '../components/EditFlyout'
import Footer from '../components/Footer'

function MyMeetings() {

  UseAuth();
  const userInfo = useAppSelector((zoom) => zoom.auth.userInfo);
  const [meetings, setMeetings] = useState<any>([])
  const getMyMeetings = useCallback(async () => {
    const firestoreQuery = query(meetingsRef, where("createdBy", "==", userInfo?.uid));
    const fetchedMeetings = await getDocs(firestoreQuery);
    if(fetchedMeetings.docs.length){
      const myMeetings:Array<MeetingType> = []
      fetchedMeetings.forEach((meeting) =>{
          myMeetings.push({
              docId: meeting.id,
              ...(meeting.data() as MeetingType),
          });
      });
      setMeetings(myMeetings);
    }
  }, [userInfo?.uid]);

  useEffect(() => {
    if (userInfo) getMyMeetings();     
  }, [userInfo, getMyMeetings]);

  const [showEditFlyout, setShowEditFlyout] = useState(false);
  const [editMeeting, setEditMeeting] = useState<MeetingType>();

  const openEditFlyout = (meeting : MeetingType) => {
    setShowEditFlyout(true);
    setEditMeeting(meeting);
  }
  
  const closeEditFlyout = (dataChanged = false) => {
    setShowEditFlyout(false);
    setEditMeeting(undefined);
    if (dataChanged) getMyMeetings();
  }
  
  const meetingColumns = [
    {
      field: "meetingName",
      name: "Meeting Name",
    },
    {
      field: "meetingType",
      name: "Meeting Type",
    },
    {
      field: "meetingDate",
      name: "Meeting Date",
    },
    {
      field: "meetingTime",
      name: "Meeting Time",
    },
    {
      field: "",
      name: "Status",
      render: (meeting: MeetingType) => {
        if (meeting.status) {
          if (meeting.meetingDate === moment().format("L") || meeting.meetingTime === moment().format("LT")) {
            return (
              <EuiBadge color="success">
                <Link
                  style={{ color: "black" }}
                  to={`/join/${meeting.meetingId}`}
                >
                  Join Now
                </Link>
              </EuiBadge>
            );
          } else if (
            moment(meeting.meetingDate).isBefore(moment().format("L")) || moment(meeting.meetingTime).isBefore(moment().format("LT"))
          ) {
            return <EuiBadge color="default">Ended</EuiBadge>;
          } else if (moment(meeting.meetingDate).isAfter() || moment(meeting.meetingTime).isAfter()) {
            return <EuiBadge color="primary">Upcoming</EuiBadge>;
          }
        } else return <EuiBadge color="danger">Cancelled</EuiBadge>;
      },
    },
    {
      field: "",
      name: "Edit",
      render: (meeting: MeetingType) => {
        return (
          <EuiButtonIcon
            aria-label="meeting-edit"
            iconType="indexEdit"
            color="danger"
            display="base"
            isDisabled={
              !meeting.status ||
              moment(meeting.meetingDate).isBefore(moment().format("L")) ||
              moment(meeting.meetingTime).isBefore(moment().format("LT"))
            }
            onClick={() => openEditFlyout(meeting)}
          />
        );
      },
    },
    {
      field: "meetingId",
      name: "Copy Link",
      width: "5%",
      render: (meetingId: string) => {
        return (
            <EuiCopy textToCopy={`${"localhost:3000"}/join/${meetingId}`}>
                {(copy: any) => (
                    <EuiButtonIcon 
                        iconType='copy'
                        onClick={copy}
                        display='base'
                        aria-label='Meeting Copy'
                    />
                )}
            </EuiCopy>
        );
      },
    },
      
  ];


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
        style={{ margin: '1rem'}}
      >

        <EuiFlexItem>
          <EuiPanel>
            <EuiBasicTable items={meetings} columns={meetingColumns} />
          </EuiPanel>
        </EuiFlexItem>
        
      </EuiFlexGroup>
      {
        showEditFlyout && (
          <EditFlyout closeFlyout={closeEditFlyout} meetings={editMeeting!} />
        )
      }
      <Footer />
    </div>
  )
}

export default MyMeetings
