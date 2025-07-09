"use client"

import { useEffect, useState } from "react"
import withAuth from "../components/withAuth"

type Video = {
  id: number
  title: string
  description: string
  video_url: string
  status: string
}

function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:3000/videos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        const converted = data.map((video: Video) => ({
          ...video,
          video_url: convertToEmbedUrl(video.video_url),
        }))

        setVideos(converted)
      } catch (err) {
        console.error("Gagal fetch video:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const convertToEmbedUrl = (url: string) => {
    return url.includes("watch?v=")
      ? url.replace("watch?v=", "embed/")
      : url
  }

  return (
    <div  className="min-h-screen bg-black text-white">

      {/* Video Section */}
      <div className="p-5 space-y-6 max-w-full mx-auto">
        <h2 className="text-2xl font-bold">Film Tersedia</h2>

        {loading ? (
          <p>Loading video...</p>
        ) : videos.length === 0 ? (
          <p>Tidak ada video tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-zinc-800 p-4 rounded space-y-2 shadow-md"
              >
                <h3 className="text-xl font-semibold">{video.title}</h3>
                <p className="text-sm">{video.description}</p>
                <div className="aspect-video">
                  <iframe
                    src={video.video_url}
                    allowFullScreen
                    className="w-full h-full rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(Home, ["user"])
