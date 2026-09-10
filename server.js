// server.js
// Entry point for cPanel's "Setup Node.js App" (Phusion Passenger).
// Passenger runs this file directly and expects the app to listen on
// the port it provides via process.env.PORT -- unlike Render, which
// just runs `npm start` (next start) directly.
//
// Set this as the "Application startup file" in cPanel's Node.js App UI.

const { createServer } = require('http')
const next = require('next')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Zara Kitchen ready on port ${port} (${dev ? 'development' : 'production'})`)
  })
}).catch((err) => {
  console.error('Error starting Next.js app:', err)
  process.exit(1)
})
