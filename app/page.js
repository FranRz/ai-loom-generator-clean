'use client';
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("optimized");

  const [scriptA, setScriptA] = useState("");
  const [scriptB, setScriptB] = useState("");
  const [guide, setGuide] = useState("");
  const [prompts, setPrompts] = useState(null);

  const generate = async () => {
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
        style: mode,
        niche: data1.niche,
        location: data1.location
      })
    });

    const data2 = await res2.json();

    if (mode === "ab") {
      setScriptA(data2.scriptA);
      setScriptB(data2.scriptB);
    } else {
      setScriptA(data2.script);
      setScriptB("");
    }

    setGuide(data2.loomGuide);
    setPrompts(data2.prompts);
  };

  const copy = (text) => navigator.clipboard.writeText(text);

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Loom Generator</h1>

      <input placeholder="Website" value={url} onChange={e=>setUrl(e.target.value)} />
      <br/><br/>

      <input placeholder="Lead name" value={name} onChange={e=>setName(e.target.value)} />
      <br/><br/>

      <select value={mode} onChange={e=>setMode(e.target.value)}>
        <option value="safe">Safe</option>
        <option value="optimized">Optimized</option>
        <option value="aggressive">Aggressive</option>
        <option value="ab">A/B Test</option>
      </select>

      <br/><br/>

      <button onClick={generate}>Generate</button>

      <br/><br/>

      <h3>Script A</h3>
      <pre>{scriptA}</pre>
      <button onClick={()=>copy(scriptA)}>Copy A</button>

      {scriptB && (
        <>
          <h3>Script B</h3>
          <pre>{scriptB}</pre>
          <button onClick={()=>copy(scriptB)}>Copy B</button>
        </>
      )}

      <h3>Loom Guide</h3>
      <pre>{guide}</pre>

      {prompts && (
        <>
          <h3>Prompts</h3>
          <p>{prompts.search}</p>
          <button onClick={()=>copy(prompts.search)}>Copy</button>

          <p>{prompts.inclusion}</p>
          <button onClick={()=>copy(prompts.inclusion)}>Copy</button>
        </>
      )}
    </div>
  );
}
