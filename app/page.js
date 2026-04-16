'use client';
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [output, setOutput] = useState("");
  const [guide, setGuide] = useState("");
  const [prompts, setPrompts] = useState(null);

  const generate = async () => {
    setOutput("Generating...");
    setGuide("");

    const res1 = await fetch("/api/extract", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({url})
    });

    const data1 = await res1.json();

    const res2 = await fetch("/api/script", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        url,
        name,
        niche: data1.niche,
        location: data1.location
      })
    });

    const data2 = await res2.json();

    setOutput(data2.script);
    setGuide(data2.loomGuide);
    setPrompts(data2.prompts);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Loom Generator</h1>

      <input
        placeholder="Website URL"
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Lead Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <br/><br/>

      <button onClick={generate}>Generate</button>

      <br/><br/>

      <h3>🎬 Script</h3>
      <pre>{output}</pre>
      <button onClick={()=>copy(output)}>Copy Script</button>

      <br/><br/>

      <h3>🎥 Loom Guide</h3>
      <pre>{guide}</pre>

      <br/><br/>

      {prompts && (
        <>
          <h3>🔍 Prompts</h3>

          <p><strong>Search:</strong> {prompts.search}</p>
          <button onClick={()=>copy(prompts.search)}>Copy</button>

          <p><strong>Inclusion:</strong> {prompts.inclusion}</p>
          <button onClick={()=>copy(prompts.inclusion)}>Copy</button>
        </>
      )}
    </div>
  );
}
