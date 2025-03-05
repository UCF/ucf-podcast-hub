import { initializeApp } from "firebase-admin";
import { DocumentData, Firestore, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import slugify from "slugify";
import { Parser } from "xml2js";

export const podcastImport = async () => {
  const app = initializeApp();
  const db = getFirestore(app);

  const showsRef = db.collection('shows');
  const snapshot = await showsRef.get();

  snapshot.forEach(async doc => {
    await processShow(doc, db);
  });

  logger.log("All done importing episodes!");
};

const processShow = async (doc: DocumentData, db: Firestore) => {
  const showData = doc.data();
    const feedUrl = showData.feedUrl;
  
    const resp = await fetch(feedUrl);
    if (!resp.ok) return;
  
    const parser = new Parser();
    const data = await parser.parseStringPromise(await resp.text());
  
    const channel = data.rss.channel[0];
    const episodes = channel.item;
  
    if (!episodes) return;
  
    const epRefs = [];
  
    for (const episode of episodes) {
      const epRef = await addEpisode(episode, doc, db);
      logger.log("Added new episode!");
      epRefs.push(epRef);
    }
  
    showData.episodes = epRefs;
    await db.collection('shows').doc(showData.slug).set(showData);
};

const addEpisode = async (episode: any, doc: DocumentData, db: Firestore) => {
  const episodeType = episode['itunes:episodeType'] ?
    episode['itunes:episodeType'][0] :
    '';

  const author = episode['itunes:author'] ?
    episode['itunes:author'][0]:
    '';

  const obj = {
    title: episode.title[0],
    slug: slugify(episode.title[0], { lower: true, strict: true }),
    guid: episode.guid[0]._,
    description: episode.description[0],
    pubDate: Date.parse(episode.pubDate[0]),
    link: episode.link[0],
    audioUrl: episode.enclosure[0].$.url,
    episodeType: episodeType,
    season: episode['itunes:season'][0],
    episode: episode['itunes:episode'][0],
    author: author,
    transcript: null,
    keyMoments: null,
    tags: []
  };

  let epRef = await db.collection('episodes').doc(obj.slug);
  
  await db.collection('episodes').doc(obj.slug).set(obj);
  epRef = await db.collection('episodes').doc(obj.slug);

  return {
    slug: obj.slug,
    title: obj.title,
    ref: epRef
  };
}
