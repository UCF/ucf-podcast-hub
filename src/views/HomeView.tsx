import { useEffect, useState } from 'react';
import { db } from '../firebase';
import './HomeView.scss'

import { collection, getDocs } from 'firebase/firestore';
import PodcastShow from '../models/PodcastShow';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import ShowCard from '../components/ShowCard';

function HomeView() {
  const [shows, setShows] = useState<PodcastShow[]>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User|false>(false);
  const auth = getAuth();

  // Navbar State
  const [navbarExpanded, setNavbarExpanded] = useState<boolean>(false);

  onAuthStateChanged(auth, (_user: User|null) => {
    if (_user) {
      setUser(_user);
      setIsAuthenticated(true)
    } else {
      setUser(false);
      setIsAuthenticated(false);
    }
  });

  useEffect(() => {
    const shows = getDocs(collection(db, 'shows'));
    shows.then((snapshot) => {
      const retval: PodcastShow[] = [];
      snapshot.forEach((doc) => {
        retval.push(doc.data() as PodcastShow);
      })
      setShows(retval);
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <div className='container'>
      <h1>Home</h1>
      {isAuthenticated && user && (
        <nav className='navbar navbar-toggleable-md navbar-light bg-faded'>
          <button className={'navbar-toggler' + (!navbarExpanded ? '' : ' collapsed') } type='button' aria-controls="admin-menu" aria-expanded={navbarExpanded} aria-label="Toggle navigation" onClick={() => setNavbarExpanded(!navbarExpanded)}>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='admin-menu'>
            <ul className='navbar-nav mr-auto'>
              <li className='nav-item'>
                <a className='nav-link' href='#'>Add New Show</a>
              </li>
            </ul>
          </div>
          <span className='navbar-text'>
            Welcome {user.displayName}!
          </span>
        </nav>
      )}
      <div className='row'>
        <div className='col-12 col-sm-6 col-md-4'>
          {shows?.map(show => (
            <ShowCard slug={show.slug} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeView
