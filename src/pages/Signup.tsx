/* trunk-ignore-all(prettier) */
import { EuiButton, EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiForm, EuiImage, EuiPanel, EuiProvider, EuiSpacer, EuiText } from '@elastic/eui';
import { useEffect, useState } from 'react';
import animation from '../assets/signupnow.gif';
import logo from '../assets/remotel-logo2.png';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup, updateProfile } from 'firebase/auth';
import { firebaseAuth, userRef } from '../utils/FirebaseConfig';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setUser } from '../app/slices/AuthSlice';
import LoginEmailField from '../components/FormComponents/LoginEmailField';
import LoginPasswordField from '../components/FormComponents/LoginPasswordField';
import { FieldErrorType } from '../utils/Types';
import SignUpUsernameField from '../components/FormComponents/SignUpUsernameField';
import SignUpButton from '../components/FormComponents/SignUpButton';
import SignUpCheckbox from '../components/FormComponents/SignUpCheckbox';
import UseToast from '../hooks/useToast';
import LineWithOr from '../components/LineWithOr';


function Signup() {

  const [username, setUsername ] = useState("")
  const [email, setEmail ] = useState("")
  const [password, setPassword ] = useState("")
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [createToast] = UseToast();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrors, setShowErrors] = useState<{
    email: FieldErrorType;
    password: FieldErrorType;
    confirmedPassword: FieldErrorType;
    username: FieldErrorType;
    termsAgreed: FieldErrorType;
  }>({
    email: {
      show: false,
      message: [],
    },

    password: {
      show: false,
      message: [],
    },
    
    confirmedPassword: {
      show: false,
      message: [],
    },
    
    username: {
      show: false,
      message: [],
    },

    termsAgreed: {
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
  
  const generateID = () => {
    let checkboxID = "";
    const chars =
      "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
    const maxPos = chars.length;

    for (let i = 0; i < 8; i++) {
      checkboxID += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return checkboxID;
  }


  const validateForm = () => {
    const clonedShowErrors = {...showErrors}
    let errors = false;

    if (!email.length) {
      clonedShowErrors.email.show = true;
      clonedShowErrors.email.message = [" Please Enter your Email !"];
      errors = true;
    } else {
      clonedShowErrors.email.show = false;
      clonedShowErrors.email.message = [];
    }
    
    if (!username.length) {
      clonedShowErrors.username.show = true;
      clonedShowErrors.username.message = [" Please Enter your Name !"];
      errors = true;
    } else {
      clonedShowErrors.username.show = false;
      clonedShowErrors.username.message = [];
    }
    
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

    // Validate termsAgreed
    if (!termsAgreed) {
      clonedShowErrors.termsAgreed.show = true;
      clonedShowErrors.termsAgreed.message = ["Please agree to the terms and conditions!"];
      errors = true;
    } else {
      clonedShowErrors.termsAgreed.show = false;
      clonedShowErrors.termsAgreed.message = [];
    }

    setShowErrors(clonedShowErrors);
    return errors;
  };

  const handleCheckboxChange = (isChecked:any) => {
    setTermsAgreed(isChecked);
  
    // Validate the checkbox state
    const clonedShowErrors = { ...showErrors };
    clonedShowErrors.termsAgreed.show = !isChecked;
    clonedShowErrors.termsAgreed.message = ["Please agree to the terms and conditions."];
    setShowErrors(clonedShowErrors);
  };

  const signupGoogle = async () => {
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

  const signUp = async () => {

    try {

      if(!validateForm()){
        
        // Create the user with email and password
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        
        // Update the user profile with the provided username
        await updateProfile(userCredential.user, { displayName: username });
  
        createToast({
          title: "Welcome to the Dashboard | Your Account have been created successfully!",
          type: "success",
        });
  
        if (email) {
          // check if we have a user with the current user id
          const firestoreQuery = query(userRef, where("uid", "==", userCredential.user.uid));
  
          // add the document inside the firebase 
          const fetchedUser = await getDocs(firestoreQuery);
          if (fetchedUser.docs.length === 0) {
            await addDoc(userRef, {
              uid: userCredential.user.uid,
              name: userCredential.user.displayName,
              email: userCredential.user.email,
              imageUrl: userCredential.user.photoURL || null,
            })
          }
  
          dispatch(
            setUser(
              {
                uid: userCredential.user.uid,
                name: userCredential.user.displayName!,
                email: userCredential.user.email!,
                imageUrl: userCredential.user.photoURL!,
              }
            )
          );
  
          navigate("/");
        } 
      
      }
    } catch (error:any) {
      handleSignInError(error);
    }
  }

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

  const styles = {
    paddingRight: window.innerWidth >= 768 ? '8.2rem' : '0',
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
                  <EuiImage src={animation} alt='logo' />
                </EuiFlexItem>
                
                <EuiFlexItem>
                    <EuiImage src={logo} alt='logo' size="230px" />

                    <EuiText
                      style={{
                        textAlign:"center"
                      }}
                    >
                      
                      <h2> Sign Up </h2>
                      
                    </EuiText>

                    {/* Display the error message below the Email field */}
                    <EuiSpacer size='s' />
                    {error && (

                      <EuiCallOut 
                        title="Sorry, Invalid User Sign Up Credential." 
                        color="danger" 
                        iconType="error" 
                        size='s'
                      >
                        <EuiText color='text' size='s'>
                          {errorMessage}
                        </EuiText>
                      </EuiCallOut>

                    )}
                    <EuiSpacer size='l' />

                    <SignUpUsernameField
                      icon="user" 
                      label="Username"
                      placeholder="Enter your Username"
                      value={username}
                      setUsername={setUsername}
                      isInvalid = {showErrors.username.show}
                      error = {showErrors.username.message}
                    />

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
                    
                    <LoginPasswordField 
                      label="Confirm Password"
                      placeholder="Confirm your Password"
                      type='dual'
                      value={confirmedPassword}
                      setPassword={setConfirmedPassword}
                      aria-label="Use aria labels when no actual label is in use"
                      isInvalid = {showErrors.confirmedPassword.show}
                      error = {showErrors.confirmedPassword.message}
                    />

                    <EuiSpacer size='s' />


                    <SignUpCheckbox
                      id={generateID()}
                      checked={termsAgreed}
                      label="I agree to the terms and conditions."
                      onChange={() => handleCheckboxChange(!termsAgreed)}
                      isInvalid={showErrors.termsAgreed.show}
                      error={showErrors.termsAgreed.message}
                    />

                    <EuiSpacer size='s' />

                    <div style={styles}>

                    <SignUpButton signUp={signUp} />

                    <EuiSpacer size='m' />
                    <LineWithOr />
                    <EuiSpacer size='m' />

                    <EuiButton
                      fullWidth
                      iconType="logoGoogleG" 
                      iconSide="left" 
                      style={{textDecoration: 'none', color: 'black', border: '2px solid black', backgroundColor: "white"}} 
                      onClick={signupGoogle}
                      > 
                      Sign up with Google 
                    </EuiButton>
                    

                    <EuiFlexItem grow={false}>
                        <EuiText>
                          <p> Already have an account? Login <Link to="/login">here</Link>. </p>
                        </EuiText>
                    </EuiFlexItem>
                    </div>

                </EuiFlexItem>

              </EuiFlexGroup>
            </EuiForm>          
          </EuiPanel>

        </EuiFlexItem>

      </EuiFlexGroup>

    </EuiProvider>
  );
}

export default Signup;
