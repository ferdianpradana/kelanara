"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import withAuth from "../../components/withAuth"
import Link from "next/link";


type Video = {
  id: number;
  title: string;
  category: string;
  description: string;
  video_url: string;
  status: string;
  createdAt: string;
};

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data video dari backend
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/videos/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      const converted = data.map((video: Video) => ({
        ...video,
        video_url: convertToEmbedUrl(video.video_url),
      }));

      setVideos(converted);
    } catch (err) {
      console.error("Gagal fetch video:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi ubah status jadi published
  const publishVideo = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/videos/admin/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh daftar video
      fetchVideos();
    } catch (err) {
      console.error("Gagal publish video:", err);
    }
  };

  // Konversi watch?v= ke embed/
  const convertToEmbedUrl = (url: string) => {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  if (loading) return <p className="text-white p-4">Loading video...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <div className="flex justify-around">
        <h1 className="text-3xl font-bold text-center">
          Kelanara: Film Horor Online
        </h1>
        <Link href="/admin/home/add">
        <button className="btn btn-success flex items-center gap-2">
          <Plus size={20} />
          Tambah Video
        </button>
        </Link> 
      </div>

      {videos.length === 0 ? (
        <p className="text-center text-gray-400">Belum ada video.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-zinc-800 p-4 rounded space-y-3 shadow-md"
            >
              <div className="aspect-video">
                <iframe
                  src={video.video_url}
                  allowFullScreen
                  className="w-full h-full rounded"
                />
              </div>
              <h2 className="text-xl font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-400 italic">{video.category}</p>
              <p className="text-sm">{video.description}</p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`badge ${
                    video.status === "published"
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {video.status}
                </span>
              </p>

              {video.status === "draft" && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => publishVideo(video.id)}
                >
                  Publish Video
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default withAuth(Home, ["admin"])

