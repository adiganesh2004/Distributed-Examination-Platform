import { useEffect, useState } from "react"
import { Card } from "../components/ui/Card.jsx"
import { Trash2, RefreshCcw } from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_API_URL

const DeleteQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchQuestions = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${BACKEND_URL}/questions/admin/getall`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || "Failed to fetch questions")
      }

      const data = await res.json()
      setQuestions(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${BACKEND_URL}/questions/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || "Failed to delete question")
      }

      alert("Question deleted successfully.")
      setQuestions((prev) => prev.filter((q) => q.id !== id))
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10">
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        Delete Questions
      </h2>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchQuestions}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          <RefreshCcw className="w-5 h-5" />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error / Empty states */}
      {error && (
        <p className="text-red-600 text-center font-medium">{error}</p>
      )}

      {!loading && questions.length === 0 && !error && (
        <p className="text-gray-600 text-center">No questions available.</p>
      )}

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((q) => (
          <Card
            key={q.id}
            className="p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {q.question}
              </h3>
              <ul className="list-disc list-inside text-gray-700 mb-3">
                {q.options?.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-600">
                <strong>Answer:</strong>{" "}
                {q.options?.[q.answerIndex] ?? "N/A"}
              </p>
            </div>

            <button
              onClick={() => handleDelete(q.id)}
              className="flex items-center justify-center gap-2 mt-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DeleteQuestions
