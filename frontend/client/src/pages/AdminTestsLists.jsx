import { useEffect, useState } from "react"
import { Card } from "../components/ui/Card.jsx"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = `${import.meta.env.VITE_API_URL}`

const AdminTestsList = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(`${BACKEND_URL}/results/admin/tests`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error("Unable to fetch admin tests")

        setTests(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Your Created Tests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map(test => (
          <Card
            key={test.testId}
            className="p-6 shadow-md border rounded-xl cursor-pointer hover:bg-gray-100 transition"
            onClick={() => navigate(`/admin/analytics/${test.testId}`)}
          >
            <h2 className="text-xl font-semibold">{test.testName}</h2>
            <p className="text-gray-700 mt-2">{test.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminTestsList
