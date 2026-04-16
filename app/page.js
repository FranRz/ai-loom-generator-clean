'use client';
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState(null);

const generate = async () => {
  try {
    if (!url) return;

    const res1 = await fetch("/api/extract", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({url})
    });

    const data1 = await res1.json();

    const res2 = await fetch("/api/script", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({url, ...data1})
    });

    const data2 = await res2.json();

    console.log("RESPONSE:", data2);

    setOutput(data2.script || JSON.stringify(data2));
  } catch (err) {
    console.error("ERROR:", err);
    setOutput("Error: " + err.message);
  }
};

  return (
    <div style={{padding:20}}>
      <h1>AI Loom Generator</h1>

      <input 
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        placeholder="Paste company URL..."
      />

      <br/><br/>

      <button onClick={generate}>Generate</button>

      <br/><br/>

      {output && <pre>{output}</pre>}
    </div>
  );
}
