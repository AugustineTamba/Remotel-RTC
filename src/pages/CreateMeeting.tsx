import React from 'react';
import Header from '../components/Header';
import UseAuth from '../hooks/useAuth';
import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiImage } from '@elastic/eui';
import meeting1 from '../assets/1-on-1.gif';
import meeting2 from '../assets/video-conference.gif';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';


function CreateMeeting() {

  UseAuth();
  const navigate = useNavigate();

  return (
    <div 
      style={{
        display: 'flex',
        height: '90vh',
        flexDirection: 'column',
      }}
    >
      <Header />
      <EuiFlexGroup
        justifyContent='center'
        alignItems='center'
        style={{ margin: "5vh 10vw"}}
      >
        <EuiFlexItem> 
          <EuiCard
            icon={<EuiImage size="5rem" alt="icon" src={meeting1} />}
            title={`Create 1 on 1 Meeting`}
            description="Create a personal meeting with a single person."
            onClick={() => navigate('/create1on1')}
            paddingSize='xl'
          />
        </EuiFlexItem>
        
        <EuiFlexItem> 
          <EuiCard
            icon={<EuiImage size="5rem" alt="icon" src={meeting2} />}
            title={`Create a Video Conference`}
            description="Invite multiple people to join the meeting."
            onClick={() => navigate('/createvideoconference')}
            paddingSize='xl'
          />
        </EuiFlexItem>

      </EuiFlexGroup>
      <Footer />
    </div>
  );
}

export default CreateMeeting;
