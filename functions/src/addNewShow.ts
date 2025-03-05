import { getApp, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { logger } from "firebase-functions/v2";

import slugify from "slugify";
import { Parser } from "xml2js";

/**
 *
 * @param url The URL of the podcast to be added
 * @param slug The slug to use for the podcast, instead of auto generating one
 * @returns The information relating to the new record
 */
export const addNewShow = async (url: string, slug: string|null) => {

  const resp = await fetch(url);
  if (!resp.ok) logger.error('There was an error retrieving the podcast data.');

  const parser = new Parser();
  const data = await parser.parseStringPromise(await resp.text());

  const channel = data.rss.channel[0];

  const record = {
    name: channel.title[0],
    slug: slug || slugify(channel.title[0], { lower: true, strict: true }),
    feedUrl: url,
    description: channel.description[0],
    owner: channel['podcast:person'][0],
    image: channel['itunes:image'][0].$.href,
    episodes: []
  };

  let app;
    try {
      app = getApp();
    } catch {
      app = initializeApp();
    }
  const db = getFirestore(app);

  const res = await db.collection('shows').doc(record.slug).set(record);

  logger.info(`New show created ${record.name}`, { structuredData: true });
  return res;
};
