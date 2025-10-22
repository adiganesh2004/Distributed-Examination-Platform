import { useState, useEffect } from "react"
import { Card } from "../components/ui/Card.jsx"
import { Plus, Trash, Send } from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_API_URL;

const CreateTest = () => {
  const [questions, setQuestions] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [testName, setTestName] = useState("")
  const [testDescription, setTestDescription] = useState("")
  const [duration, setDuration] = useState(30)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const res = await fetch(`${BACKEND_URL}/questions-with-answers`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        // setQuestions(res.data)
      } catch (err) {
        console.error("Failed to fetch questions:", err)
        
      } finally {
        setLoading(false)
      }
    }
    // fetchQuestions()
    setQuestions([
      { id: 1, question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answerIndex: 1 },
      { id: 2, question: "Capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answerIndex: 2 },
      { id: 3, question: "Which language is React written in?", options: ["Python", "JavaScript", "Java", "C++"], answerIndex: 1 },
      { id: 4, question: "What is the boiling point of water?", options: ["90°C", "100°C", "120°C", "80°C"], answerIndex: 1 },
      { id: 5, question: "Largest planet in the solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answerIndex: 2 }
    ])
  }, [])

  const addQuestion = () => setSelectedQuestions([...selectedQuestions, null])

  const updateQuestion = (index, questionId) => {
    const newSelected = [...selectedQuestions]
    newSelected[index] = questionId
    setSelectedQuestions(newSelected)
  }

  const removeQuestion = (index) => {
    const newSelected = [...selectedQuestions]
    newSelected.splice(index, 1)
    setSelectedQuestions(newSelected)
  }

  const handleSubmit = async () => {
    if (!testName || !duration || !startTime || !endTime || selectedQuestions.length === 0) {
      alert("Please fill all fields and add at least one question.")
      return
    }

    const payload = {
      name: testName,
      description: testDescription,
      duration,
      startTime,
      endTime,
      questionIds: selectedQuestions,
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`${BACKEND_URL}/maketest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to create test")

      alert("Test created successfully")
      setTestName("")
      setTestDescription("")
      setDuration(30)
      setStartTime("")
      setEndTime("")
      setSelectedQuestions([])
      setSearchQuery("")
    } catch (err) {
      console.error(err)
      alert(err.message || "Error creating test")
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestions = questions?.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Create Test</h2>

      <Card className="p-6 space-y-4 shadow-lg">
        {/* Test details */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Test Name</label>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              disabled={loading}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Questions</label>

          {selectedQuestions.map((qId, i) => {
            const key = qId ?? `new-${i}`
            const selectedQ = questions.find(q => q.id === qId)

            return (
              <div key={key} className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                {qId === null ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 mb-1"
                      disabled={loading}
                    />
                    <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                      {filteredQuestions.slice(0, 50).map((q) => {
                        const isSelected = selectedQuestions.includes(q.id)
                        return (
                          <div
                            key={q.id}
                            className={`p-2 cursor-pointer hover:bg-gray-200 ${
                              isSelected ? "bg-green-200 font-semibold" : ""
                            }`}
                            onClick={() => updateQuestion(i, q.id)}
                          >
                            {q.question}
                          </div>
                        )
                      })}
                      {filteredQuestions.length === 0 && (
                        <div className="p-2 text-gray-500">No questions found</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 p-4 bg-green-200 rounded-md space-y-2">
                    <div className="font-semibold">{selectedQ?.question}</div>
                    <div className="space-y-1">
                      {selectedQ?.options.map((opt, idx) => {
                        const correctIndex = selectedQ.answerIndex
                        return (
                          <div
                            key={idx}
                            className={`p-1 rounded-md ${
                              idx === correctIndex ? "bg-green-500 text-white font-bold" : "bg-white"
                            }`}
                          >
                            {opt}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <button
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => removeQuestion(i)}
                  disabled={loading}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            )
          })}

          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-2"
            onClick={addQuestion}
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Question
          </button>
        </div>

        <button
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Send className="w-5 h-5 mr-2" /> {loading ? "Creating..." : "Create Test"}
        </button>
      </Card>
    </div>
  )
}

export default CreateTest
