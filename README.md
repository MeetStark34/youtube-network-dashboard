> 📺 One dashboard. Eleven channels. A clearer view of the whole YouTube network.
> 

**YouTube Network Dashboard** brings the latest uploads, channel totals, comparisons, and custom rankings for a network of YouTube channels into one place. It helps compare the main channels while keeping related subchannels visible.

🔗 **GitHub repository:** MeetStark34/youtube-network-dashboard

## ✨ What it does

- 📊 **Network overview:** View known subscribers, channel views, video counts, today's matching uploads, and latest-upload views.
- 🎬 **Latest uploads:** Browse recent uploads across the network, filter by channel, and open videos directly on YouTube.
- 🧭 **Channel families:** See each main channel together with its related subchannels.
- 🏆 **Custom rankings:** Compare main channels by Network Score, subscribers, latest-upload views, likes, comments, or engagement rate.
- 📈 **Analytics:** Compare main channels and inspect latest-upload metrics across the wider network.
- 🔎 **Videos vs Shorts:** Use the shared content-type filter across the dashboard, rankings, analytics, and uploads.
- ⚙️ **Settings:** Review the data endpoint, last update, ranking weights, main-channel order, and content-filter rules.
- 📱 **Responsive UI:** Designed for desktop and smaller screens.

## 🕸️ The channel network

The current configuration contains four main channels and seven subchannels.

- **BnfTV** - @BnfTV
    - AnimeCloud - @Animecloud9
- **PJ Explained** - @PJExplained
    - thePJ - @thepjoffical
    - thePJ Gaming - @gamingthepj
- **ComicVerse** - @comicverseog
    - MohitVerse - @Mohitverse
    - FlickVerse - @Flickverseyt
- **Men of Culture Podcast** - @menofculturepodcast
    - Men of Culture Highlights - @menofculturehighlights
    - Men of Culture Ultra - @MenofCultureUltra

Channel handles and parent-child relationships are configured in `lib/channels.ts`. If a channel changes handle or a new channel joins the network, update the configuration and verify the parent name.

## 🏆 How the Network Score works

The Network Score is a custom comparison metric for the **four main channels only**. It is not an official YouTube ranking.

Each metric is scaled from 0 to 100 relative to the strongest main channel for that metric. The weighted components are:

- 👥 Subscribers: **30%**
- 👀 Views on the latest matching upload: **30%**
- 👍 Likes on the latest matching upload: **15%**
- 💬 Comments on the latest matching upload: **0%** by default
- 💡 Engagement rate: **25%**

Engagement rate is **(likes + comments) ÷ views** for the latest upload matching the selected content type. The weights can be changed in `lib/ranking.ts`. A channel with hidden subscriber counts cannot contribute a subscriber value to the score.

## 🎞️ How Shorts and videos are classified

YouTube's Data API does not provide an authoritative Shorts flag in the public video resource, so the dashboard uses a conservative heuristic:

- A video longer than three minutes is classified as a regular video.
- An upload with an explicit Shorts hashtag in its title or a Shorts tag is classified as a Short if its duration is within the three-minute limit.
- An upload of three minutes or less without an explicit Shorts signal stays **unclassified**.
- **All** includes unclassified uploads. The Videos and Shorts filters exclude them so they are not confidently mislabelled.

This is an inference from available metadata, not a guarantee of YouTube's own classification.

## 📊 Data and limitations

The dashboard calls a server-side Next.js endpoint at `/api/youtube`, which uses the YouTube Data API v3.

For each configured channel, the endpoint retrieves channel metadata and statistics, then requests up to the **50 latest uploads returned** and their available video statistics.

- Data reflects the latest API response, not a permanent historical archive.
- The Growth over time section is a placeholder until historical subscriber and view snapshots are stored.
- Subscriber counts may be hidden. Where supported, missing metrics are shown as unavailable rather than reliable zeroes.
- YouTube API keys are subject to quotas and API availability.
- Today's uploads are based on the uploads returned by the API and use your local date.

## 🧰 Tech stack

- **Next.js 16** and **React 19** - application and routing
- **TypeScript** - typed application code
- **Tailwind CSS 4** - styling
- **YouTube Data API v3** - public channel and upload data
- **Vercel** - recommended deployment platform

## 🖥️ Run locally

### 1. Requirements

- Node.js LTS
- npm
- A Google Cloud project with the YouTube Data API v3 enabled and an API key

### 2. Clone the repository

```bash
git clone https://github.com/MeetStark34/youtube-network-dashboard.git
cd youtube-network-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the API key

Create a file named `.env.local` in the project root:

```
YOUTUBE_API_KEY=your_youtube_data_api_key
```

Create the API key in Google Cloud Console, enable **YouTube Data API v3** for the project, and configure the key according to Google's recommendations.

Keep the key server-side. Do not rename it to `NEXT_PUBLIC_YOUTUBE_API_KEY`, paste it into client-side code, or commit `.env.local` to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000.

### 6. Run checks

```bash
npm run lint
npm run build
```

The project currently defines `dev`, `build`, `start`, and `lint` scripts in `package.json`.

## ☁️ Deploy on Vercel

1. Open Vercel and import `MeetStark34/youtube-network-dashboard` from GitHub.
2. Keep the framework preset as **Next.js**.
3. In **Project Settings → Environment Variables**, add `YOUTUBE_API_KEY` using the value from Google Cloud Console.
4. Add the variable for the deployment environments you use, such as Production and Preview.
5. Deploy and open the generated URL.
6. Confirm that channel totals, thumbnails, uploads, rankings, and filters load correctly.

Vercel deployments connected to GitHub can automatically redeploy when new commits are pushed to the configured branch.

## 🗂️ Project structure

```
app/
  api/youtube/route.ts   # Server-side YouTube Data API endpoint
  analytics/             # Channel comparison metrics
  channels/              # Channel family and all-channel views
  ranking/               # Main-channel rankings
  uploads/                # Recent uploads and filters
  settings/               # Data and scoring settings
  page.tsx               # Network dashboard
components/               # Reusable UI and dashboard components
lib/
  channels.ts            # Configured channels and parent relationships
  api.ts                 # Response normalization and client data fetching
  network.ts             # Grouping, ordering, upload filters
  shorts.ts              # Shorts/video classification logic
  ranking.ts             # Ranking categories and score weights
  metrics.ts             # Overview metrics
  format.ts              # Number, date, and engagement formatting
```

## 🔧 Customization

**Add or edit a channel**

Update `lib/channels.ts` with its name, YouTube handle, type (`main` or `sub`), and parent. Keep the parent name aligned with the corresponding main channel.

**Change main-channel order**

Update `MAIN_CHANNEL_ORDER` in `lib/network.ts`.

**Adjust Network Score**

Edit `NETWORK_SCORE_WEIGHTS` in `lib/ranking.ts`. The comments and Settings page explain how the weights work.

**Improve Shorts detection**

Review `lib/shorts.ts`. Keep uncertain short-form uploads unclassified unless the available metadata supports a more confident decision.

## 🧯 Troubleshooting

- **The dashboard shows a 500 error:** Check that `YOUTUBE_API_KEY` is set in `.env.local` or the deployment's environment variables, then restart or redeploy.
- **YouTube data cannot be loaded:** Confirm that YouTube Data API v3 is enabled, the key is valid, and the project has quota remaining.
- **A channel is missing:** Check its handle and configuration in `lib/channels.ts`. Confirm that the handle still resolves on YouTube.
- **A Short appears under All but not under Shorts:** It may not have an explicit Shorts hashtag or tag, so the classifier deliberately leaves it unclassified.

Avoid publishing API keys, private logs, or other credentials when requesting help.

## 🗺️ Roadmap ideas

- 🗃️ Store channel snapshots for historical subscriber and view trends
- 📉 Add growth charts once historical data is available
- 🧪 Add automated tests for ranking and Shorts classification
- 🧩 Make channel configuration easier to maintain as the network expands

These are possible future improvements, not claims that they are already implemented.

## ⚠️ Disclaimer

This is an independent dashboard built around public channel and video data available through the YouTube Data API. Metrics can be delayed, hidden, incomplete, or unavailable due to API limitations and quota. The Network Score is a custom heuristic for comparison, not an official YouTube metric.

---

**Built to make the network easier to understand, one channel at a time.** 🎬
