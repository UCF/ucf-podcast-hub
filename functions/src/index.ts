/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, onRequest } from "firebase-functions/v2/https";
// import { onSchedule } from "firebase-functions/v2/scheduler";

import { podcastImport } from "./podcastImport";
import { addNewShow } from "./addNewShow";
import { FirestoreEvent, onDocumentCreated, QueryDocumentSnapshot } from "firebase-functions/firestore";
import { getTranscript } from "./pullTranscript";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const addShow = onCall(async (request) => {

  if (!request.auth || !request.auth.token) {
    return;
  }

  const url = request.data.url;
  const slug = request.data.slug || null;

  await addNewShow(url, slug);
});

export const importPodcastEpisodes = onCall(async (request) => {
  await podcastImport();
});

export const getTranscriptOnCreate = onDocumentCreated(
  'episodes/{docId}',
  async (event: FirestoreEvent<QueryDocumentSnapshot | undefined, { docId: string}>) =>
{
  await getTranscript(event!.document);
});
