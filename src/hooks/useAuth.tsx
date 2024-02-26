import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth } from '../utils/FirebaseConfig';
import { setUser } from '../app/slices/AuthSlice';

function UseAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {

      if (!currentUser) {
        navigate("/login");
      } else {
        dispatch (
          setUser({
            uid: currentUser.uid,
            email: currentUser.email!,
            name: currentUser.displayName!,
            imageUrl: currentUser.photoURL!
          })
        );
      }
    });
    return () => unsubscribe(); //cleanup function to remove the listener when this component is removed
  }, [dispatch, navigate]);

}

export default UseAuth;
