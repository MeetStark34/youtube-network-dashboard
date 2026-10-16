export const channels = [
  { name: "BnfTV", handle: "@BnfTV", type: "main", parent: null },
  { name: "AnimeCloud", handle: "@Animecloud9", type: "sub", parent: "BnfTV" },

  { name: "PJ Explained", handle: "@PJExplained", type: "main", parent: null },
  { name: "thePJ", handle: "@thepjoffical", type: "sub", parent: "PJ Explained" },
  { name: "thePJ Gaming", handle: "@gamingthepj", type: "sub", parent: "PJ Explained" },

  { name: "ComicVerse", handle: "@comicverseog", type: "main", parent: null },
  { name: "MohitVerse", handle: "@Mohitverse", type: "sub", parent: "ComicVerse" },
  { name: "FlickVerse", handle: "@Flickverseyt", type: "sub", parent: "ComicVerse" },

  { name: "Men of Culture Podcast", handle: "@menofculturepodcast", type: "main", parent: null },
  { name: "Men of Culture Highlights", handle: "@menofculturehighlights", type: "sub", parent: "Men of Culture Podcast" },
  { name: "Men of Culture Ultra", handle: "@MenofCultureUltra", type: "sub", parent: "Men of Culture Podcast" },
];