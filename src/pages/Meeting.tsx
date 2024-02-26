import {
    EuiBadge,
    EuiBasicTable,
    EuiButtonIcon,
    EuiCopy,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
} from "@elastic/eui";
  
import { getDocs, query } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { MeetingType } from "../utils/Types";
import { meetingsRef } from "../utils/FirebaseConfig";
import Footer from "../components/Footer";
  
  export default function Meeting() {
    useAuth();
    const userInfo = useAppSelector((zoom) => zoom.auth.userInfo);
    const [meetings, setMeetings] = useState<Array<MeetingType>>([]);
  
    useEffect(() => {
        if(userInfo){
            const getUserMeetings = async () => {
                const firestoreQuery = query(meetingsRef);
                const fetchedMeetings = await getDocs(firestoreQuery);
                if (fetchedMeetings.docs.length) {
                    const myMeetings: Array<MeetingType> = [];
                    fetchedMeetings.forEach((meeting) => {
                        const data = meeting.data() as MeetingType;
                        if (data.createdBy === userInfo?.uid) myMeetings.push(data);
                        else if (data.meetingType === "anyone-can-join")myMeetings.push(data);
                        else {
                            const index = data.invitedUsers.findIndex(
                            (user) => user === userInfo.uid
                            );
                            if (index !== -1) {
                                myMeetings.push(data);
                            }
                        }
                    });
        
                setMeetings(myMeetings);
                }
            }
            getUserMeetings();
        };
    }, [userInfo]);
  
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
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Header />
        <EuiFlexGroup justifyContent="center" style={{ margin: "1rem" }}>
          <EuiFlexItem>
            <EuiPanel>
              <EuiBasicTable items={meetings} columns={meetingColumns} />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
        <Footer />
      </div>
    );
  }
  