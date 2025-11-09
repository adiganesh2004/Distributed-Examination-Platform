import { useEffect, useState } from "react"
import { Card } from "../components/ui/Card.jsx"
import { BarChart3, AlertTriangle, Timer, Trophy } from "lucide-react"
import { useParams } from "react-router-dom"

const BACKEND_URL = `${import.meta.env.VITE_API_URL}`

const AdminAnalyticsDashboard = () => {
  const { testId } = useParams()

  const [hardest, setHardest] = useState([])
  const [longest, setLongest] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
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

    load()
  }, [testId])

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-4xl font-bold flex items-center gap-2 mb-8">
        <BarChart3 className="w-8 h-8 text-purple-600" />
        Test Analytics
      </h1>

      {loading && <p className="text-gray-700 text-lg">Loading analytics...</p>}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Hardest Questions */}
          <Card className="p-6 shadow-lg bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-500 w-6 h-6" />
              <h3 className="text-xl font-semibold text-gray-900">Hardest Questions</h3>
            </div>

            <ul className="space-y-3">
              {hardest.length === 0 && <p className="text-gray-500 text-sm">No data</p>}

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

          {/* Slowest Questions */}
          <Card className="p-6 shadow-lg bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Timer className="text-blue-500 w-6 h-6" />
              <h3 className="text-xl font-semibold text-gray-900">Slowest Questions</h3>
            </div>

            <ul className="space-y-3">
              {longest.length === 0 && <p className="text-gray-500 text-sm">No data</p>}

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
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-yellow-500 w-6 h-6" />
              <h3 className="text-xl font-semibold text-gray-900">Leaderboard</h3>
            </div>

            <ul className="space-y-3">
              {leaderboard.length === 0 && <p className="text-gray-500 text-sm">No data</p>}

              {leaderboard.map((c, idx) => (
                <li
                  key={idx}
                  className="border-b pb-2 flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-700">#{idx + 1}</span>
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