import { useEffect, useState } from "react";
import PodcastEpisode from "../models/PodcastEpisode";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import PodcastShow from "../models/PodcastShow";

import parse from 'html-react-parser';
import { Link } from "react-router";

interface EpisodeCardParams {
  slug: string
  showData?: PodcastShow,
  cardClasses?: string
}

export default function EpisodeCard(params: EpisodeCardParams) {
  const slug = params.slug;
  const showData = params.showData;
  const cardClasses = params.cardClasses;
  const [episodeData, setEpisodeData] = useState<PodcastEpisode>();

  useEffect(() => {
    const episode = getDoc(doc(db, `episodes/${slug}`));
    episode.then(doc => {
      setEpisodeData(doc.data() as PodcastEpisode);
    }).catch(err => {
      console.error(err);
    });
  }, [slug]);

  return (
    <>
      <div className={'card' + (cardClasses ? ` ${cardClasses}` : '')}>
        <div className='card-block'>
          <div className='row'>
            <div className='col-2'>
              <img className='img-fluid' src={showData?.image || 'https://placehold.co/150' } />
            </div>
            <div className='col-10'>
              <h2 className='card-title h5'>{episodeData?.title}</h2>
              {episodeData && episodeData.description && (
                <p>{parse(episodeData?.description)}</p>
              )}
              {showData && episodeData && (
                <Link to={`/${showData?.slug}/${episodeData?.slug}/`}>
                  {episodeData?.title} episode information
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
