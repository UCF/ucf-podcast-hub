interface PodcastEpisodeReference {
  ref: string,
  slug: string,
  title: string
}

interface PodcastShow {
  name: string,
  description: string,
  feedUrl: string,
  owner: string,
  image: string,
  slug: string,
  episodes: PodcastEpisodeReference[]
}

export default  PodcastShow;
