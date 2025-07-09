const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
const prisma = new PrismaClient()
const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// ================== MIDDLEWARE ==================
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied (admin only)' })
  }
  next()
}

// ================== AUTH ==================

// Register
app.post('/auth/register', async (req, res) => {
  const { email, password, role } = req.body
  try {
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashed, role }
    })
    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({ error: 'Invalid password' })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )
    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ================== VIDEO ==================

// GET /videos → hanya yang published
app.get('/videos', verifyToken, async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' }
    })
    res.json(videos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /videos/admin → semua video (admin only)
app.get('/videos/admin', verifyToken, isAdmin, async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(videos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /videos/admin → tambah video (admin only)
app.post('/videos/admin', verifyToken, isAdmin, async (req, res) => {
  const { title, description, category, video_url, status } = req.body
  try {
    const video = await prisma.video.create({
      data: {
        title,
        description,
        category,
        video_url,
        status,
        userId: req.user.id
      }
    })
    res.status(201).json(video)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /videos/admin/:id → publish video (admin only)
app.patch('/videos/admin/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params
  try {
    const updated = await prisma.video.update({
      where: { id: parseInt(id) },
      data: { status: 'published' }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ================== TEST ==================
app.get('/', (req, res) => {
  res.send('API Ready!')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
