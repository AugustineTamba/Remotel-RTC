import React from 'react'
import UseAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiImage } from '@elastic/eui';
import Dashboard1 from '../assets/appointment.gif';
import Dashboard2 from '../assets/calendar.gif';
import Dashboard3 from '../assets/upcoming.gif';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Dashboard() {
  UseAuth();
  const navigate = useNavigate();
  
  return (
    <>
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
              icon={<EuiImage size="5rem" alt="icon" src={Dashboard1} />}
              title={`Create a Meeting`}
              description="Create a new meeting and invite people to join."
              onClick={() => navigate('/create')}
              paddingSize='xl'
            />
          </EuiFlexItem>
          
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage size="8rem" alt="icon" src={Dashboard2} />}
              title={`My Meetings`}
              description="View your created meetings."
              onClick={() => navigate('/mymeetings')}
              paddingSize='xl'
             />
          </EuiFlexItem>
          
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage size="5rem" alt="icon" src={Dashboard3} />}
              title={`Meetings`}
              description="View meetings that you're invited to."
              onClick={() => navigate('/meetings')}
              paddingSize='xl'
             />
          </EuiFlexItem>
        </EuiFlexGroup>
        <Footer />

      </div>
    </>
  );
}

export default Dashboard;
