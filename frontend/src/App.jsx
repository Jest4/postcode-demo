import { useState } from 'react'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const endpoint = 'https://postcode.estany.ca/api/postcode'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postCode: inputValue }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error submitting data:', error)
      setResult({ error: 'Failed to submit data. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1>PostCode Checker Tool</h1>
      
      {/* Input Component */}
      <div className="input-container">
        <label htmlFor="dataInput">Enter your data:</label>
        <textarea 
          id="dataInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your input here..."
          rows={5}
        />
      </div>
      
      {/* Submit Button Component */}
      <div className="button-container">
        <button 
          onClick={handleSubmit}
          disabled={loading || !inputValue.trim()}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </div>
      
      {/* Result Component */}
      <div className="result-container">
        <h2>Results</h2>
        {loading ? (
          <p>Processing your request...</p>
        ) : result ? (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        ) : (
          <p>Submit data to see results.</p>
        )}
      </div>
    </div>
  )
}

export default App
