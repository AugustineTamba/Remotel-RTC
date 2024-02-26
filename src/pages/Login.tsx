import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiForm, EuiImage, EuiPanel, EuiProvider, EuiSpacer, EuiText, EuiCallOut, EuiLink, EuiConfirmModal, EuiTextColor } from '@elastic/eui';
import { useEffect, useState } from 'react';
import loginauto from '../assets/login.gif';
import logo from '../assets/remotel-logo2.png';
import { GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { firebaseAuth, userRef } from '../utils/FirebaseConfig';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setUser } from '../app/slices/AuthSlice';
import LoginEmailField from '../components/FormComponents/LoginEmailField';
import LoginPasswordField from '../components/FormComponents/LoginPasswordField';
import LoginButton from '../components/FormComponents/LoginButton';
import { FieldErrorType } from '../utils/Types';
import LineWithOr from '../components/LineWithOr';

function Login() {

  const [email, setEmail ] = useState("")
  const [reset, setReset ] = useState("")
  const [password, setPassword ] = useState("")
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [emailSent, setEmailSent] = useState(false); // Track whether the email has been sent
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrors, setShowErrors] = useState<{
    email: FieldErrorType;
    reset: FieldErrorType;
    password: FieldErrorType;
  }>({
    email: {
      show: false,
      message: [],
    },
    reset: {
      show: false,
      message: [],
    },
    password: {
      show: false,
      message: [],
    },
  });

  // check if there is a user login
  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser)  => {
      if(currentUser) {
        navigate("/")
      }
    })
    return () => unsubscribe(); //cleanup function to remove the listener when this component is removed
  }, [dispatch, navigate]);
  

  const validateForm = () => {
    const clonedShowErrors = {...showErrors}
    let errors = false;

    if (!email.length) {
      clonedShowErrors.email.show = true;
      clonedShowErrors.email.message = [" Please Enter your Email !"];
      errors = true;
    } else if (!email.includes('@')) {
      clonedShowErrors.email.show = true;
      clonedShowErrors.email.message = ["Please enter a valid email address!"];
      errors = true;
    }else {
      clonedShowErrors.email.show = false;
      clonedShowErrors.email.message = [];
    }
    
    if (!password.length) {
      clonedShowErrors.password.show = true;
      clonedShowErrors.password.message = [" Please Enter your Password !"];
      errors = true;
    } else {
      clonedShowErrors.password.show = false;
      clonedShowErrors.password.message = [];
    }

    setShowErrors(clonedShowErrors);
    return errors;
  };

  const validateResetPassword = () => {
    const clonedShowErrors = {...showErrors}
    let errors = false;

    if (!reset.length) {
      clonedShowErrors.reset.show = true;
      clonedShowErrors.reset.message = [" Please Enter your Email !"];
      errors = true;
    } else if (!reset.includes('@')) {
      clonedShowErrors.reset.show = true;
      clonedShowErrors.reset.message = ["Please enter a valid email address!"];
      errors = true;
    }else {
      clonedShowErrors.reset.show = false;
      clonedShowErrors.reset.message = [];
    }

    setShowErrors(clonedShowErrors);
    return errors;
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {

      const {
        user : { displayName, email, uid, photoURL }
      } = await signInWithPopup(firebaseAuth, provider);

      if (email) {
        // check if we have a user with the current user id
        const firestoreQuery = query(userRef, where("uid", "==", uid));

        // add the document inside the firebase 
        const fetchedUser = await getDocs(firestoreQuery);
        if (fetchedUser.docs.length === 0) {
          await addDoc(userRef, {
            uid,
            name: displayName,
            email,
            imageUrl: photoURL,
          })
        }

        dispatch(
          setUser(
            {
              uid, 
              name: displayName!, 
              email,
              imageUrl: photoURL!,
            }
          )
        );

        navigate("/");
      
      }
    } catch (error:any) {
      handleSignInError(error);
    }
  };
  // const login = async () => {
  //   const provider = new GoogleAuthProvider();
  //   const {
  //     user : { displayName, email, uid, photoURL }
  //   } = await signInWithRedirect(firebaseAuth, provider);

  //   if (email) {
  //     // check if we have a user with the current user id
  //     const firestoreQuery = query(userRef, where("uid", "==", uid));

  //     // add the document inside the firebase 
  //     const fetchedUser = await getDocs(firestoreQuery);
  //     if (fetchedUser.docs.length === 0) {
  //       await addDoc(userRef, {
  //         uid,
  //         name: displayName,
  //         email,
  //         imageUrl: photoURL,
  //       })
  //     }

  //     dispatch(
  //       setUser(
  //         {
  //           uid, 
  //           name: displayName!, 
  //           email,
  //           imageUrl: photoURL!,
  //         }
  //       )
  //     );

  //     navigate("/");
      
  //   }
  // };

  // const signIn = async () => {
  //   if (!validateForm()) {
  //     try {
  //       const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  //       const user = userCredential.user;

  //       if (user && user.email) {
  //         // check if we have a user with the current user id
  //         const firestoreQuery = query(userRef, where("uid", "==", user.uid));
  
  //         // add the document inside the firebase
  //         const fetchedUser = await getDocs(firestoreQuery);
  //         if (fetchedUser.docs.length === 0) {
  //           await addDoc(userRef, {
  //             uid: user.uid,
  //             name: user.displayName,
  //             email: user.email,
  //             imageUrl: user.photoURL,
  //           });
  //         }
  
  //         dispatch(
  //           setUser({
  //             uid: user.uid,
  //             name: user.displayName!,
  //             email: user.email,
  //             imageUrl: user.photoURL!,
  //           })
  //         );
  
  //         navigate("/");
  //       }
  //     } catch (error:any) {
  //       const errorMessage = error.message;
  //       const errorCode = error.code;
  //       console.log(errorMessage)
        
  //       setError(true);

  //       switch (errorCode) {
  //         case "auth/invalid-email":
  //           setErrorMessage("This email address is invalid.");
  //           break;
  //         case "auth/user-disabled":
  //           setErrorMessage(
  //             "This email address is disabled by the administrator."
  //           );
  //           break;
  //         case "auth/user-not-found":
  //           setErrorMessage("This email address is not registered.");
  //           break;
  //         case "auth/wrong-password":
  //           setErrorMessage("The password is invalid or the user does not have a password.")
  //           break;
  //           case "auth/invalid-login-credentials":
  //           setErrorMessage("The Email and/or Password is Invalid.")
  //           break;
  //         default:
  //           setErrorMessage(errorMessage);
  //           break;
  //       }
  //     }
  //   };

  // };

  const handleSignInError = (error: any) => {
    const errorMessage = error.message;
    const errorCode = error.code;
  
    setError(true);
  
    switch (errorCode) {
      case "auth/invalid-email":
        setErrorMessage("This email address is invalid.");
        break;
      case "auth/user-disabled":
        setErrorMessage("This email address is disabled by the administrator.");
        break;
      case "auth/user-not-found":
        setErrorMessage("This email address is not registered.");
        break;
      case "auth/wrong-password":
        setErrorMessage("The password is invalid or the user does not have a password.");
        break;
      case "auth/invalid-login-credentials":
        setErrorMessage("The Email and/or Password is Invalid.");
        break;
      default:
        setErrorMessage(errorMessage);
        break;
    }
  };
  
  const signIn = async () => {
    if (!validateForm()) {
      try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;
  
        if (user && user.email) {
          // check if we have a user with the current user id
          const firestoreQuery = query(userRef, where("uid", "==", user.uid));
          // add the document inside the firebase
          const fetchedUser = await getDocs(firestoreQuery);
  
          if (fetchedUser.docs.length === 0) {
            await addDoc(userRef, {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              imageUrl: user.photoURL,
            });
          }
  
          dispatch(
            setUser({
              uid: user.uid,
              name: user.displayName!,
              email: user.email,
              imageUrl: user.photoURL!,
            })
          );
  
          navigate("/");
        }
      } catch (error: any) {
        handleSignInError(error);
      }
    }
  };  

  const closeModal = () => {
    setIsModalVisible(false);
    // Reset the email sent status when closing the modal
    setEmailSent(false);
  }

  const resetPasswordRequest = async  () => {
    
    if (!validateResetPassword()) {
      await sendPasswordResetEmail(firebaseAuth, reset)
      await setEmailSent(true); // Set the email sent status to true
      // Delay the closeModal function by 1000 milliseconds (1 second)
      setTimeout(() => {
        closeModal();
      }, 3000);
    }
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showResetPassword = () => {
    setIsModalVisible(true);
    // Reset the email sent status when showing the modal
    setEmailSent(false);
  }

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiConfirmModal
        title="Reset Password"
        onCancel={closeModal}
        onConfirm={resetPasswordRequest}
        confirmButtonText="Reset"
        cancelButtonText="Close"
        initialFocus="[name=delete]"
      >
        {emailSent ? (
          <EuiTextColor color="success">Email sent successfully! </EuiTextColor>
        ) : (

          <LoginEmailField 
            icon="email" 
            label="Email"
            placeholder="Enter your Email"
            value={reset}
            setEmail={setReset}
            isInvalid = {showErrors.reset.show}
            error = {showErrors.reset.message}
          />
        )}
      </EuiConfirmModal>
    );
  }

  const styles = {
    paddingRight: window.innerWidth >= 768 ? '6rem' : '0',
  };

  return (
    <EuiProvider colorMode="dark">

      <EuiFlexGroup 
        alignItems='center' 
        justifyContent='center' 
        style={{ width: '100vw', height: '100vh' }}
      >
        <EuiFlexItem grow={false}>

          <EuiPanel paddingSize='xl'>
            <EuiForm>
              <EuiFlexGroup 
                justifyContent='center' 
                alignItems='center'
              > 
                <EuiFlexItem>
                  <EuiImage src={loginauto} alt='logo' />
                </EuiFlexItem>
                
                <EuiFlexItem>
                    <EuiImage src={logo} alt='logo' size="230px" />

                    <EuiText textAlign='center' >
                     <h2> Login </h2>
                    </EuiText>

                   {/* Display the error message below the Email field */}
                    <EuiSpacer size='s' />
                    {error && (

                      <EuiCallOut 
                        title="Sorry, Invalid Login Credential." 
                        color="danger" 
                        iconType="error"
                      >
                        <EuiText color='text' size='s'>
                          {"Check you email and Password and try again!"}
                        </EuiText>
                      </EuiCallOut>

                    )}

                    <EuiSpacer size='s' />

                    <LoginEmailField 
                      icon="email" 
                      label="Email"
                      placeholder="Enter your Email"
                      value={email}
                      setEmail={setEmail}
                      isInvalid = {showErrors.email.show}
                      error = {showErrors.email.message}
                    />
                    
                    <LoginPasswordField 
                      label="Password"
                      placeholder="Enter your Password"
                      type='dual'
                      value={password}
                      setPassword={setPassword}
                      aria-label="Use aria labels when no actual label is in use"
                      isInvalid = {showErrors.password.show}
                      error = {showErrors.password.message}
                    />

                    <EuiFlexItem grow={false}>
                        <EuiText>
                          <p style={{fontSize: '1rem'}}>  
                            <EuiLink 
                              style={{  textDecoration: 'none' }} onClick={showResetPassword} > Forgot Password 
                            </EuiLink>? 
                          </p>
                        </EuiText>
                    </EuiFlexItem>
  
                    <EuiSpacer size='s' />

                    <div style={styles}>

                    <LoginButton signIn={signIn} />

                    <EuiSpacer size='m' />
                    <LineWithOr />
                    <EuiSpacer size='m' />

                    <EuiButton 
                      fullWidth
                      iconType="logoGoogleG" 
                      iconSide="left" 
                      style={{textDecoration: 'none', color: 'black', border: '2px solid black', backgroundColor: "white"}} 
                      onClick={login}
                    > 
                      Login with Google 
                    </EuiButton>
                    
                    <EuiSpacer size='s' />

                    <EuiFlexItem grow={false}>
                        <EuiText>
                          <p> Need an account? Sign up <Link to="/signup">here</Link>. </p>
                        </EuiText>
                    </EuiFlexItem>
                    </div>

                </EuiFlexItem>

              </EuiFlexGroup>
            </EuiForm>          
          </EuiPanel>

        </EuiFlexItem>

      </EuiFlexGroup>
      {modal}
    </EuiProvider>
  );
}

export default Login;
