"use client"

import { useState } from "react"
import withAuth from "../../../components/withAuth"

function Home() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [status, setStatus] = useState("draft")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:3000/videos/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          video_url: videoUrl,
          status,
        }),
      })

      if (!res.ok) {
        throw new Error("Gagal menambahkan video")
      }

      setMessage("✅ Video berhasil ditambahkan!")
      setTitle("")
      setDescription("")
      setCategory("")
      setVideoUrl("")
      setStatus("draft")
    } catch (err) {
      console.error(err)
      setMessage("❌ Gagal menambahkan video.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📹 Tambah Video Baru</h1>

      {message && <p className="mb-4 text-sm text-yellow-400">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block mb-1">Judul</label>
          <input
            type="text"
            className="input input-bordered w-full text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Deskripsi</label>
          <textarea
            className="textarea textarea-bordered w-full text-black"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Kategori</label>
          <input
            type="text"
            className="input input-bordered w-full text-black"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Video URL (embed YouTube)</label>
          <input
            type="text"
            className="input input-bordered w-full text-black"
            placeholder="https://www.youtube.com/embed/ID"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            className="select select-bordered w-full text-black"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          ➕ Tambahkan Video
        </button>
      </form>
    </div>
  )
}

export default withAuth(Home, ["admin"])
