import { useState } from "react"
import { Card } from "../components/ui/Card.jsx"
import { BarChart3 } from "lucide-react"

const BACKEND_URL = `${import.meta.env.VITE_API_URL}`

const AdminAnalyticsDashboard = () => {
  const [testId, setTestId] = useState("")
  const [hardest, setHardest] = useState([])
  const [longest, setLongest] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadAnalytics = async () => {
    if (!testId.trim()) return

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")

      const headers = { Authorization: `Bearer ${token}` }

      const [hRes, lRes, lbRes] = await Promise.all([
        fetch(`${BACKEND_URL}/results/admin/${testId}/hardest`, { headers }),
        fetch(`${BACKEND_URL}/results/admin/${testId}/longest`, { headers }),
        fetch(`${BACKEND_URL}/results/${testId}/leaderboard`, { headers })
      ])

      if (!hRes.ok || !lRes.ok || !lbRes.ok)
        throw new Error("Failed to fetch analytics")

      setHardest(await hRes.json())
      setLongest(await lRes.json())
      setLeaderboard(await lbRes.json())

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <BarChart3 className="w-8 h-8 text-purple-600" />
        Admin Analytics Dashboard
      </h1>

      <Card className="p-6 shadow-md bg-white border border-gray-200 rounded-xl mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter Test ID..."
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-64"
          />
          <button
            onClick={loadAnalytics}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Load Insights
          </button>
        </div>
      </Card>

      {loading && (
        <p className="text-center mt-6 text-gray-700 text-lg">Loading analytics...</p>
      )}

      {error && (
        <p className="text-center mt-6 text-red-500 text-lg">{error}</p>
      )}

      {!loading && !error && hardest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Hardest Questions */}
          <Card className="p-6 shadow-lg bg-white border border-gray-200 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Hardest Questions</h3>
            <ul className="space-y-3">
              {hardest.map((q, idx) => (
                <li key={idx} className="border-b pb-2">
                  <p className="font-medium">{q.question}</p>
                  <p className="text-gray-600 text-sm">
                    Correctness rate: {(q.correctnessRate * 100).toFixed(1)}%
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          {/* Longest Time Questions */}
          <Card className="p-6 shadow-lg bg-white border border-gray-200 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Slowest Questions</h3>
            <ul className="space-y-3">
              {longest.map((q, idx) => (
                <li key={idx} className="border-b pb-2">
                  <p className="font-medium">{q.question}</p>
                  <p className="text-gray-600 text-sm">
                    Avg time: {q.avgTime.toFixed(2)} sec
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          {/* Leaderboard */}
          <Card className="p-6 shadow-lg bg-white border border-gray-200 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Leaderboard</h3>
            <ul className="space-y-3">
              {leaderboard.map((c, idx) => (
                <li key={idx} className="border-b pb-2 flex justify-between">
                  <span>{c.candidateName}</span>
                  <span className="font-semibold">{c.score}</span>
                </li>
              ))}
            </ul>
          </Card>

        </div>
      )}
    </div>
  )
}

export default AdminAnalyticsDashboard