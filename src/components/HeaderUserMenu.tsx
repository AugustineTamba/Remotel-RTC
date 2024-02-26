import { EuiHeaderSectionItemButton, EuiPopover, useGeneratedHtmlId, EuiFlexGroup, EuiFlexItem, EuiText, EuiSpacer, EuiLink, EuiConfirmModal, EuiTextColor, EuiButtonIcon } from '@elastic/eui';
import React, { ChangeEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import HeaderAvatar from './FormComponents/HeaderAvatar';
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updateCurrentUser, updatePassword, updateProfile } from 'firebase/auth';
import { firebaseAuth } from '../utils/FirebaseConfig';
import { FieldErrorType } from '../utils/Types';
import LoginPasswordField from './FormComponents/LoginPasswordField';
import mylogo from '../assets/logo.PNG';

function HeaderUserMenu() {

    const username = useAppSelector((zoom) => zoom.auth.userInfo?.name);
    const [password, setPassword ] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [successText, setSuccessText] = useState(false); // Track whether the email has been sent
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrors, setShowErrors] = useState<{
      password: FieldErrorType;
      confirmedPassword: FieldErrorType;
      oldPassword: FieldErrorType;
    }>({

      password: {
        show: false,
        message: [],
      },
      
      confirmedPassword: {
        show: false,
        message: [],
      },
      
      oldPassword: {
        show: false,
        message: [],
      },

    });
    //const imageUrl = useAppSelector((zoom) => zoom.auth.userInfo?.imageUrl);

    const headerUserPopoverId = useGeneratedHtmlId({
        prefix: 'headerUserPopover',
    });
        const [isOpen, setIsOpen] = useState(false);

        const onMenuButtonClick = () => {
        setIsOpen(!isOpen);
        };

        const closeMenu = () => {
        setIsOpen(false);
        };

        const button = (
            <EuiHeaderSectionItemButton
                aria-controls={headerUserPopoverId}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Account menu"
                onClick={onMenuButtonClick}
            >
            username?(
                <HeaderAvatar name={username} size="m" imageUrl='../assets/user.png'  />
                
            ):null
                
            </EuiHeaderSectionItemButton>
        )

        const logout = () => {
          signOut(firebaseAuth);
        };

        const validateResetPassword = () => {
          const clonedShowErrors = { ...showErrors };
          let errors = false;
        
          if (!password.length) {
            clonedShowErrors.password.show = true;
            clonedShowErrors.password.message = [" Please Enter your Password !"];
            errors = true;
          } else {
            clonedShowErrors.password.show = false;
            clonedShowErrors.password.message = [];
          }
        
          // Validate confirmed password
          if (password !== confirmedPassword) {
            clonedShowErrors.confirmedPassword.show = true;
            clonedShowErrors.confirmedPassword.message = ["Passwords do not match!"];
            errors = true;
          } else {
            clonedShowErrors.confirmedPassword.show = false;
            clonedShowErrors.confirmedPassword.message = [];
          }
        
          if (!oldPassword) {
            // If old password is missing, set the error message
            clonedShowErrors.oldPassword.show = true;
            clonedShowErrors.oldPassword.message = ["Please enter your old password!"];
            errors = true;
          } else {
            clonedShowErrors.oldPassword.show = false;
            clonedShowErrors.oldPassword.message = [];
          }
        
          setShowErrors(clonedShowErrors);
          return errors;
        };
        
        const resetPasswordRequest = async () => {
          try {
            if (!validateResetPassword()) {
              // Reauthenticate the user with their current password
              const user = firebaseAuth.currentUser;
        
              if (user) {
                const credential = EmailAuthProvider.credential(
                  user.email as string,
                  oldPassword
                );
        
                
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, password);
                console.log("Successfully updated password!");
              }
        
              await setSuccessText(true);
              // Delay the closeModal function by 1000 milliseconds (1 second)
              setTimeout(() => {
                closeModal();
              }, 3000);
            }
          } catch (err: any) {
            console.log(err, "big error");
            const errorMessage = err.message;
            const errorCode = err.code;
            console.log(errorMessage);
        
            const clonedShowErrors = { ...showErrors };
            //let errors = false;
        
            setError(true);
        
            switch (errorCode) {
              case "auth/invalid-email":
                setErrorMessage("This email address is invalid.");
                break;
              case "auth/user-disabled":
                setErrorMessage(
                  "This email address is disabled by the administrator."
                );
                break;
              case "auth/user-not-found":
                setErrorMessage("This email address is not registered.");
                break;
              case "auth/invalid-credential":
                //errors = true;
                clonedShowErrors.oldPassword.show = true;
                clonedShowErrors.oldPassword.message = ["Passwords is wrong!"];
                break;
              case "auth/wrong-password":
                // Handle the case where the old password is incorrect
                //errors = true;
                clonedShowErrors.oldPassword.show = true;
                clonedShowErrors.oldPassword.message = ["Old password is incorrect!"];
                break;
              case "auth/invalid-login-credentials":
                setErrorMessage("The Email and/or Password is Invalid.");
                break;
              default:
                setErrorMessage(errorMessage);
                break;
            }
          }
        };

        // const validateResetPassword = () => {
        //   const clonedShowErrors = {...showErrors}
        //   let errors = false;
      
        //   if (!password.length) {
        //     clonedShowErrors.password.show = true;
        //     clonedShowErrors.password.message = [" Please Enter your Password !"];
        //     errors = true;
        //   } else {
        //     clonedShowErrors.password.show = false;
        //     clonedShowErrors.password.message = [];
        //   }
          
        //     // Validate confirmed password
        //   if (password !== confirmedPassword) {
        //     clonedShowErrors.confirmedPassword.show = true;
        //     clonedShowErrors.confirmedPassword.message = ["Passwords do not match!"];
        //     errors = true;
        //   } else {
        //     clonedShowErrors.confirmedPassword.show = false;
        //     clonedShowErrors.confirmedPassword.message = [];
        //   }               

        //   if (!oldPassword) {
        //     clonedShowErrors.oldPassword.show = true;
        //     clonedShowErrors.oldPassword.message = ["Passwords is wrong!"];
        //     errors = true;
        //   } else {
        //     clonedShowErrors.oldPassword.show = false;
        //     clonedShowErrors.oldPassword.message = [];
        //   }
      
        //   setShowErrors(clonedShowErrors);
        //   return errors;
        // };

        const closeModal = () => {
          setIsModalVisible(false);
          // Reset the email sent status when closing the modal
          setSuccessText(false);
        }

        const [isModalVisible, setIsModalVisible] = useState(false);
        const showResetPassword = () => {
          setIsModalVisible(true);
          // Reset the email sent status when showing the modal
          setSuccessText(false);
        }

        // const resetPasswordRequest = async  () => {
        //  try {
        //     if (!validateResetPassword()) {
        //       // Reauthenticate the user with their current password
             

        //       const user = firebaseAuth.currentUser;
        //       //const newpassword = password;
        //       //console.log(user)

        //       if (user) {

        //         // if(user) return;
        //         const credential = EmailAuthProvider.credential(
        //           user.email as string,
        //           oldPassword
        //         );

        //         await reauthenticateWithCredential(user, credential);
        //         await updatePassword(user, password).then(() =>{
        //           console.log("Successfully updated password!");

        //         });
        //       } 
        //       await setSuccessText(true); // Set the email sent status to true
        //       // Delay the closeModal function by 1000 milliseconds (1 second)
        //       setTimeout(() => {
        //         closeModal();
        //       }, 3000);
        //     }
      
            
            
        //   } catch (err:any) {
        //     console.log(err, "big error");
        //     const errorMessage = err.message;
        //     const errorCode = err.code;
        //     console.log(errorMessage)

        //     const clonedShowErrors = {...showErrors}
        //     let errors = false;
            
        //     setError(true);

        //     switch (errorCode) {
        //       case "auth/invalid-email":
        //         setErrorMessage("This email address is invalid.");
        //         break;
        //       case "auth/user-disabled":
        //         setErrorMessage(
        //           "This email address is disabled by the administrator."
        //         );
        //         break;
        //       case "auth/user-not-found":
        //         setErrorMessage("This email address is not registered.");
        //         break;
        //       case "auth/invalid-credential":
        //         errors = true;
        //         clonedShowErrors.oldPassword.show = true;
        //         clonedShowErrors.oldPassword.message = ["Passwords is wrong!"];
        //         //errors = true;
        //         break;
        //       case "auth/invalid-login-credentials":
        //         setErrorMessage("The Email and/or Password is Invalid.")
        //         break;
        //       default:
        //         setErrorMessage(errorMessage);
        //         break;
        //     }
        //  }
          
        // }
        const [profilePic, setProfilePic] = useState(null);

        const updateProfilePic = async () =>{
          const user = firebaseAuth.currentUser;
          if(user){
            await updateProfile(user, {
              photoURL: profilePic
            }).then(() =>{
          
            }).catch((err) => {
              console.log(err)
            })
          }

        }

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiConfirmModal
        title="Change Password"
        onCancel={closeModal}
        onConfirm={resetPasswordRequest}
        confirmButtonText="Reset"
        cancelButtonText="Close"
        initialFocus="[name=delete]"
      >
        {successText ? (
          <EuiTextColor color="success">Password has been changed Successfully! </EuiTextColor>
        ) : (

          <>
            <LoginPasswordField
              label="Old Password"
              placeholder="Enter your old Password"
              type='dual'
              value={oldPassword}
              setPassword={setOldPassword}
              aria-label="Use aria labels when no actual label is in use"
              isInvalid={showErrors.oldPassword.show}
              error={showErrors.oldPassword.message} 
            />

            <LoginPasswordField
              label="New Password"
              placeholder="Enter your Password"
              type='dual'
              value={password}
              setPassword={setPassword}
              aria-label="Use aria labels when no actual label is in use"
              isInvalid={showErrors.password.show}
              error={showErrors.password.message} 
            />
              
            <LoginPasswordField
              label="Confirm Password"
              placeholder="Confirm your Password"
              type='dual'
              value={confirmedPassword}
              setPassword={setConfirmedPassword}
              aria-label="Use aria labels when no actual label is in use"
              isInvalid={showErrors.confirmedPassword.show}
              error={showErrors.confirmedPassword.message}
            />

          </>

        )}
      </EuiConfirmModal>
    );
  }

  return (
    <EuiPopover
      id={headerUserPopoverId}
      button={button}
      isOpen={isOpen}
      anchorPosition="downRight"
      closePopover={closeMenu}
      panelPaddingSize="m"
    >
      <div style={{ width: 300 }}>
        <EuiFlexGroup gutterSize="m" responsive={false}>
          <EuiFlexItem grow={false}>

            <HeaderAvatar name={username} size="xl" imageUrl={mylogo}  />
            {/* <EuiButtonIcon
              iconType="pencil"
              aria-label="Change Picture"
              title="Change Picture"
              // onClick={() => {
              //   // Trigger the file input when the pencil icon is clicked
              //   const fileInput = document.querySelector('input[type="file"]');
              //   if (fileInput) {
              //     fileInput;
              //   }
              // }}
            />

            <EuiButtonIcon
              iconType="save"
              aria-label="Save Picture"
              title="Save Picture"
              // onClick={handleUpload}
              // disabled={!selectedImage}
            /> */}

          </EuiFlexItem>

          <EuiFlexItem>
            <EuiText>
              <p>{username}</p>
            </EuiText>

            <EuiSpacer size="m" />

            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiFlexGroup justifyContent="spaceBetween">
                  <EuiFlexItem grow={false}>
                    <EuiLink onClick={showResetPassword}> Change Password </EuiLink>
                  </EuiFlexItem>

                  <EuiFlexItem grow={false}>
                    <EuiLink onClick={logout}> Log out </EuiLink>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
      {modal}
    </EuiPopover>
  )
}

export default HeaderUserMenu