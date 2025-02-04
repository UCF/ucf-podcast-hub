import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { db } from '../firebase';
import './HomeView.scss'

import { collection, getDocs } from 'firebase/firestore';
import PodcastShow from '../models/PodcastShow';

function HomeView() {
  const [shows, setShows] = useState<PodcastShow[]>();

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
      <ul>
      {shows?.map(show => (
        <li key={show.slug}>
          <Link to={{ pathname: "/" + show.slug }}>{show.name}</Link>
        </li>
      ))}
      </ul>
    </div>
  )
}

export default HomeView
