import { useEffect, useState } from "react";
import PodcastShow from "../models/PodcastShow";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router";

interface ShowCardParams {
  slug: string
}

export default function ShowCard(params: ShowCardParams) {
  const slug = params.slug;
  const [showData, setShowData] = useState<PodcastShow>();

  useEffect(() => {
    const show = getDoc(doc(db, `shows/${slug}`));
    show.then(doc => {
      setShowData(doc.data() as PodcastShow);
    }).catch(err => {
      console.error(err);
    });
  }, [slug]);

  return (
    <>
      <div className="card">
        <img className="card-img-top" src={showData?.image} />
        <div className="card-block">
          <h3 className="card-title">{showData?.name}</h3>
          <p>{showData?.description}</p>
          <Link to={`/${showData?.slug}`} className="btn btn-primary">
            Episodes
          </Link>
        </div>
      </div>
    </>
  );
}
