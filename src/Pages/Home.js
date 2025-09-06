import React, { useEffect, useContext } from 'react';

import Header from '../Components/Header/Header';
import Banner from '../Components/Banner/Banner';

import Posts from '../Components/Posts/Posts';
import Footer from '../Components/Footer/Footer';
import { onAuthStateChange } from '../firebase/authService';
import { AuthContext } from '../contextStore/AuthContext';

function Home(props) {
  const { setUser } = useContext(AuthContext)
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
    })
    
    return () => unsubscribe();
  }, [setUser])
  
  return (
    <div className="homeParentDiv">
      <Header />
      <Banner />
      <Posts />
      <Footer />
    </div>
  );
}

export default Home;
 
