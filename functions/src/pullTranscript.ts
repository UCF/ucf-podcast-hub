import { getFirestore } from "firebase-admin/firestore";
import { getApp, initializeApp } from "firebase-admin/app";

import mammoth = require("mammoth");

import { logger } from "firebase-functions/v2";

export const getTranscript = async (docId: string) => {
  let app;
  try {
    app = getApp();
  } catch {
    app = initializeApp();
  }
  const db = getFirestore(app);

  const doc = await db.doc(docId).get();
  const episodeData = doc.data()!;

  // Ok, let's see if we can find a transcript
  const transcriptUrlRe = /https:\/\/.*\.docx/;
  const url = transcriptUrlRe.exec(episodeData.description)?.[0];
  logger.info(url);
  if (!url) {
    logger.info(`Transcript could not be found for episode: ${episodeData.title}`);
    return;
  }

  const response = await fetch(url);
  if (!response.ok) {
    logger.info(`Error retrieving the transcript for episode: ${episodeData.title}`);
  }

  const buffer = await response.arrayBuffer();
  const transcript = await mammoth.convertToHtml({
    buffer: Buffer.from(buffer)
  });

  if (!transcript.value) {
    logger.info(`Error processing transcript for episode: ${episodeData.title}`);
  }

  episodeData.transcript = transcript.value;

  await db.collection('episodes').doc(episodeData.slug).set(episodeData);
  logger.info(`Wrote transcript of episode: ${episodeData.title}`);
};
