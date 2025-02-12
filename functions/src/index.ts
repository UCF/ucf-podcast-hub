/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import { initializeApp } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

import { Parser } from "xml2js";
import slugify from "slugify";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const addShow = onRequest(async (request, response) => {
    // Because we don't have a good authorization process
    // right now, always return immediately until we can solve
    // that problem.
    if (true) {
        return;
    }

    const url = request.body.url;
    const slug = request.body.slug || null;

    const resp = await fetch(url);
    if (!resp.ok) response.send({
        'error': 'There was an error retrieving the podcast feed'
    });

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

    const app = initializeApp();
    const db = getFirestore(app);

    const res = await db.collection('shows').doc(record.slug).set(record);

    logger.info(`New show created ${record.name}`, {structuredData: true});
    response.status(200).send({
        'success': res
    });
    return;
});
