import { useState } from "react"
import { Card } from "../components/ui/Card.jsx"
import { Upload, Send, RefreshCcw } from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_API_URL;

const AddQuestions = () => {
  const [csvFile, setCsvFile] = useState(null)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCSVUpload = async () => {
    if (!csvFile) return alert("Select a CSV first")
    
    setLoading(true)
    try {
        const token = localStorage.getItem("token")
        const formData = new FormData()
        formData.append("file", csvFile)
        const res = await fetch(`${BACKEND_URL}/csvquestions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        if (!res.ok) {
            const body = await res.json().catch(() => ({}))
            throw new Error(body.message || "Uploading failed")
        }
        
      alert(`CSV ${csvFile.name} uploaded successfully`)
    } catch (err) {
      console.error(err)
      alert("CSV upload failed")
    } finally {
      setLoading(false)
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async () => {
    if (!question || options.some((opt) => !opt) || answer === null) {
      alert("Please fill in all fields and select an answer.")
      return
    }

    setLoading(true)
    try {
      const newQuestion = {
        question,
        options,
        answerIndex: answer,
      }

      console.log("Uploading question:", newQuestion)
      const token = localStorage.getItem("token")
      const res = await fetch(`${BACKEND_URL}/addquestion`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newQuestion),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || "Adding failed")
      }

      alert("Question uploaded successfully")
      resetFields()
    } catch (err) {
      console.error(err)
      alert("Question upload failed")
    } finally {
      setLoading(false)
    }
  }

  const resetFields = () => {
    setCsvFile(null)
    setQuestion("")
    setOptions(["", "", "", ""])
    setAnswer(null)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Add Questions</h2>

      {/* CSV Upload Section */}
      <Card className="p-8 space-y-4 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Upload CSV File</h3>

        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
            className="border border-gray-300 rounded-md p-3 w-full md:w-auto"
            disabled={loading}
          />
          {csvFile && (
            <span className="text-sm text-gray-600">Selected: {csvFile.name}</span>
          )}
          <button
            className={`flex items-center px-5 py-3 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleCSVUpload}
            disabled={loading}
          >
            <Upload className="w-5 h-5 mr-2" />
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </Card>

      {/* Manual Question Entry */}
      <Card className="p-8 space-y-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Add Question Manually</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
            placeholder="Enter question text..."
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center space-x-3">
              <input
                type="radio"
                name="answer"
                checked={answer === i}
                onChange={() => setAnswer(i)}
                className="text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                className="flex-1 border border-gray-300 rounded-md p-3"
                placeholder={`Option ${i + 1}`}
                disabled={loading}
              />
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            <Send className="w-5 h-5 mr-2" />
            {loading ? "Submitting..." : "Submit Question"}
          </button>

          <button
            onClick={resetFields}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            disabled={loading}
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Reset
          </button>
        </div>
      </Card>
    </div>
  )
}

export default AddQuestions
