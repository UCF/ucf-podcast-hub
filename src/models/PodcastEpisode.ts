interface PodcastEpisode {
  title: string,
  slug: string,
  audioUrl: string,
  pubDate: string,
  author: string,
  description: string,
  season: number,
  episode: number,
  episodeType: string,
  guid: string,
  link: string,
  transcript: string,
  keyMoments: string,
  tags: string[]
}

export default PodcastEpisode;