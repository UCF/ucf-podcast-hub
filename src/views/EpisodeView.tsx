import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import './EpisodeView.scss'

import { useParams } from 'react-router'
import PodcastEpisode from '../models/PodcastEpisode';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import showdown from 'showdown';

function EpisodeView() {
  const {episode} = useParams();
  const [episodeData, setEpisodeData] = useState<PodcastEpisode>();

  const converter = new showdown.Converter();

  useEffect(() => {
    const epRef = doc(db, 'episodes', episode!);
    getDoc(epRef).then((snap) => {
      if (!snap.exists) return;
      setEpisodeData(snap.data() as PodcastEpisode);
    });
  }, []);

  return (
    <div className='container pt-4'>
      <h1>{episodeData?.title}</h1>
      {episodeData && (
        <dl className='podcast-episode-fields'>
          <dt>Author</dt>
          <dd>{episodeData.author}</dd>
          <dt>GUID</dt>
          <dd>{episodeData.guid}</dd>
          <dt>Audio</dt>
          <dd><audio controls src={episodeData.audioUrl} /></dd>
          <dt>Season</dt>
          <dd>{episodeData.season}</dd>
          <dt>Episode No.</dt>
          <dd>{episodeData.episode}</dd>
          <dt>Episode Type</dt>
          <dd>{episodeData.episodeType}</dd>
          <dt>Description</dt>
          <dd>{parse(episodeData.description)}</dd>
          <dt>Key Moments</dt>
          <dd>{parse(converter.makeHtml(episodeData.keyMoments))}</dd>
          <dt>Publish Date</dt>
          <dd>{new Date(episodeData.pubDate).toLocaleDateString()}</dd>
          <dt>Tags</dt>
          <dd><ul className='list-unstyled'>
            {episodeData.tags.map(tag => (
              <li key={tag}>{tag}</li>
          ))}</ul></dd>
          <dt>Transcript</dt>
          <dd>{parse(episodeData.transcript)}</dd>
        </dl>
      )}
    </div>
  )
}

export default EpisodeView
