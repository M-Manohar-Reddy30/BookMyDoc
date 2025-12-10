import React, { useState } from "react";
import axios from "axios";

const AIDoctorSuggest = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post("http://127.0.0.1:8000/recommend-doctor", { symptoms });
      if (data.success) {
        setResult(data);
      } else {
        setResult({ explanation: "Please describe your symptoms." });
      }
    } catch (err) {
      console.error(err);
      setResult({ explanation: "Error connecting to AI service." });
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">🧠 AI Doctor Recommendation</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms (e.g., I have fever and sore throat)"
          rows={4}
          className="border rounded p-3"
          required
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Get Doctor Suggestion"}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50 max-w-xl">
          <p className="text-lg font-semibold text-green-700">{result.speciality}</p>
          <p className="text-gray-700 mt-2">{result.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default AIDoctorSuggest;
