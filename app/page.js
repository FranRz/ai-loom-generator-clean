'use client';
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");

  const generate = async () => {
    try {
      if (!url) {
        setOutput("Please enter a URL");
        return;
      }

      // Step 1: get niche + location
      const res1 = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data1 = await res1.json();

      // Step 2: generate script
      const res2 = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          niche: data1.niche,
          location: data1.location
        })
      });

      // 👇 usamos text para evitar crash
      const text = await res2.text();

      try {
        const data2 = JSON.parse(text);

        if (data2.error) {
          setOutput("ERROR:\n" + JSON.stringify(data2, null, 2));
        } else {
          setOutput(data2.script);
        }

      } catch {
        setOutput("RAW RESPONSE:\n" + text);
      }

    } catch (err) {
      setOutput("ERROR: " + err.message);
    }
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

      <button onClick={generate}>
        Generate
      </button>

      <br /><br />

      <pre style={{ whiteSpace: "pre-wrap" }}>
        {output}
      </pre>
    </div>
  );
}
