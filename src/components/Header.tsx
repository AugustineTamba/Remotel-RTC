import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { useDispatch } from 'react-redux';
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiHeader, EuiHeaderLogo, EuiText, EuiTextColor } from '@elastic/eui';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../utils/FirebaseConfig';
import { changeTheme } from '../app/slices/AuthSlice';
import { getCreateMeetingBreadCrumbs, getJoinMeetingBreadCrumbs, getMeetingsBreadCrumbs, getMyMeetingsBreadCrumbs, getOneonOneMeetingBreadCrumbs, getVideoConferenceBreadCrumbs } from '../utils/breadCrumbs';
import HeaderUserMenu from './HeaderUserMenu';
import mylogo from '../assets/logo.PNG';


function Header() {

  const navigate = useNavigate();
  const location = useLocation();
  //const username = useAppSelector((zoom) => zoom.auth.userInfo?.name);
  const isDarkTheme = useAppSelector((zoomApp) => zoomApp.auth.isDarkTheme);
  const [breadCrumbs, setBreadCrumbs] =useState([{ text: "Dashboard" }]);
  const [isResponsive, setisResponsive] =useState(false);
  const dispatch = useDispatch();
  const logout = () => {
    signOut(firebaseAuth);
  };

  useEffect(() => {
    const { pathname } = location;
    if(pathname === "/create")
      setBreadCrumbs(getCreateMeetingBreadCrumbs(navigate));
    else if (pathname === "/create1on1")
      setBreadCrumbs(getOneonOneMeetingBreadCrumbs(navigate))
    else if (pathname === "/createvideoconference")
      setBreadCrumbs(getVideoConferenceBreadCrumbs(navigate))
    else if (pathname === "/mymeetings")
      setBreadCrumbs(getMyMeetingsBreadCrumbs(navigate))
    else if (pathname === "/meetings")
      setBreadCrumbs(getMeetingsBreadCrumbs(navigate))
    else if (pathname === "/join/:id")
      setBreadCrumbs(getJoinMeetingBreadCrumbs(navigate))
  }, [location, navigate]);

  const invertTheme = () => {
    const theme = localStorage.getItem("remotel-theme");
    localStorage.setItem("remotel-theme", theme === "light" ? "dark" : "light");
    dispatch(changeTheme({ isDarkTheme: !isDarkTheme }))
  }
  
  const section = [
    {
      items: [
        //<Link to="/">
          <EuiHeaderLogo
            iconType={mylogo}
            href="#"
            onClick={() => {
              navigate("/");
            }}
            aria-label="Go to home page"
          >
            {/* <h2 style={{ font: "10rem"}}> */}
              <EuiTextColor color='#FF6000'> Remotel-RTC </EuiTextColor>
            {/* </h2> */}
            
          </EuiHeaderLogo>,
          /* <EuiText>
            
            <h2 style={{ padding: "0 1vw"}}>
              <EuiTextColor color='#FF6000'> Remotel-RTC </EuiTextColor>
            </h2>
          </EuiText> */
        //</Link>,
      ],
    },
    // {
    //   items: [
    //     <>
    //       {
    //         username?(
    //           <EuiText>
    //             <h3>
    //               <EuiTextColor color='#fefefe'> Hello, </EuiTextColor>
    //               <EuiTextColor color='#FF6000'> {username} </EuiTextColor>
    //             </h3>
    //           </EuiText>
    //         ):null
    //       }
    //     </>
    //   ], 
    // }, 
    {
      items: [
        <EuiFlexGroup 
          justifyContent='center' 
          alignItems='center' 
          direction='row'
          style={{ gap: '1vw' }}
        >
          {/* <EuiFlexItem grow={true} style={{ flexBasis: "fit-content"}}> */}
            
          {/* </EuiFlexItem> */}
          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            {
              isDarkTheme? (
            
              <EuiButtonIcon 
                onClick={invertTheme} 
                iconType="sun"
                display='fill'
                size='s'
                color='warning'
                aria-label='theme-button-light'
              />
              ) : (
              <EuiButtonIcon 
                onClick={invertTheme} 
                iconType="moon"
                display='fill'
                size='s'
                color='text'
                aria-label='theme-button-dark'
              />
              )
            } 
          </EuiFlexItem>
          <HeaderUserMenu />
          {/* <EuiFlexItem grow={false}  style={{ flexBasis: "fit-content" }}>
            <EuiButtonIcon 
              onClick={logout} 
              iconType="lock"
              display='fill'
              size='s'
              aria-label='logout-button'
              
            />
          </EuiFlexItem> */}
        </EuiFlexGroup>
      ],
    }
  ];

  const responsiveSection = 
  [
    {
      items: [
        <Link to="/">
          <EuiText>
            <h2 style={{ padding: "0 1vw"}}>
              <EuiTextColor color='#FF6000'> Remotel-RTC </EuiTextColor>
            </h2>
          </EuiText>
        </Link>,
      ],
    },
    {
      items: [
        <EuiFlexGroup 
          justifyContent='center' 
          alignItems='center' 
          direction='row'
          style={{ gap: '2vw' }}
        >
          <EuiFlexItem grow={true} style={{ flexBasis: "fit-content"}}>
            <HeaderUserMenu />
          </EuiFlexItem>
          
          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            {
              isDarkTheme? (
            
              <EuiButtonIcon 
                onClick={invertTheme} 
                iconType="sun"
                display='fill'
                size='s'
                color='warning'
                aria-label='theme-button-light'
              />
              ) : (
              <EuiButtonIcon 
                onClick={invertTheme} 
                iconType="moon"
                display='fill'
                size='s'
                color='text'
                aria-label='theme-button-dark'
              />
            )} 
          </EuiFlexItem>

          <EuiFlexItem grow={false}  style={{ flexBasis: "fit-content" }}>
            <EuiButtonIcon 
              onClick={logout} 
              iconType="lock"
              display='fill'
              size='s'
              aria-label='logout-button'
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      ],
    },
  ];

  useEffect(() => {
    if (window.innerWidth < 480) setisResponsive(true)
  }, []);

  return (
    <>
      <EuiHeader 
        style={{ minHeight: "7vh", position: 'sticky', top: 0, zIndex: 1000}} 
        theme='dark' 
        sections={isResponsive ? responsiveSection : section } 
      />
      
      <EuiHeader style={{ minHeight: "8vh", position: 'sticky', top: 65, zIndex: 1000 }}
        sections={[
          { breadcrumbs: breadCrumbs }
        ]}
      />
    </>
    
  );
}

export default Header;
