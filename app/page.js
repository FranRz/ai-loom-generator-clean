'use client';
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [style, setStyle] = useState("optimized");
  const [output, setOutput] = useState("");

  const generate = async () => {
    try {
      if (!url) {
        setOutput("Please enter a URL");
        return;
      }

      setOutput("Generating...");

      const res1 = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data1 = await res1.json();

      const res2 = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          name,
          style,
          niche: data1.niche,
          location: data1.location
        })
      });

      const text = await res2.text();

      try {
        const data2 = JSON.parse(text);
        setOutput(data2.script || JSON.stringify(data2, null, 2));
      } catch {
        setOutput("RAW RESPONSE:\n" + text);
      }

    } catch (err) {
      setOutput("ERROR: " + err.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Loom Generator</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste company URL..."
        style={{ width: "300px", padding: "5px" }}
      />

      <br /><br />

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Lead name (optional)"
        style={{ width: "300px", padding: "5px" }}
      />

      <br /><br />

      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="safe">Safe</option>
        <option value="optimized">Optimized (recommended)</option>
        <option value="aggressive">Aggressive</option>
      </select>

      <br /><br />

      <button onClick={generate}>
        Generate
      </button>

      <button onClick={copyToClipboard} style={{ marginLeft: 10 }}>
        Copy
      </button>

      <br /><br />

      <pre style={{ whiteSpace: "pre-wrap" }}>
        {output}
      </pre>
    </div>
  );
}
