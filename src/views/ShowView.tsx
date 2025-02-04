import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import './ShowView.scss'

import { useParams } from 'react-router'
import PodcastShow from '../models/PodcastShow';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ShowView() {
  const {show} = useParams();
  const [showData, setShowData] = useState<PodcastShow>();

  useEffect(() => {
    const showRef = doc(db, 'shows', show!);
    getDoc(showRef).then((snap) => {
      if (!snap.exists) return;
      setShowData(snap.data() as PodcastShow);
    });

  }, []);

  return (
    <div className='container pt-5'>
      <div className='row'>
        <div className='col-2'>
          <img src={showData?.image} className='img-fluid mb-4' alt="" />
        </div>
        <div className='col-10'>
          <h1>{showData?.name}</h1>
        </div>
      </div>
      <p>{showData?.description}</p>
      <h2>Episodes</h2>
      <ul>
        {showData?.episodes.map(episode => {
          return (
            <li key={episode.slug}>
              <Link
                to={{
                  pathname: "/" + show + "/" + episode.slug
                }}>
                  {episode.title}
                </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ShowView
