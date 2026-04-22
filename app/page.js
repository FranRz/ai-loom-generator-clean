"use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [scriptA, setScriptA] = useState("");
  const [scriptB, setScriptB] = useState("");
  const [prompts, setPrompts] = useState(null);
  const [permissionDM, setPermissionDM] = useState("");

  // 🔥 Generador de Permission DM (seguro)
  const generatePermissionDM = (name, niche) => {
    return `Hey ${name},

I was looking into how companies in the ${niche} space are showing up on ChatGPT, and noticed some interesting patterns in what gets recommended.

Happy to send you a quick Loom showing what I found and how it might apply to your space — just let me know 👍`;
  };

  const generate = async () => {
    if (!name || !url) {
      alert("Fill everything");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Step 1: Analyze website
      const res1 = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res1.ok) throw new Error("Analyze failed");

      const data1 = await res1.json();
      console.log("data1:", data1);

      const nicheSafe = data1?.niche || "your industry";

      // 🔹 Step 2: Generate Loom scripts
      const res2 = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          url,
          niche: nicheSafe,
        }),
      });

      if (!res2.ok) throw new Error("Generate failed");

      const data2 = await res2.json();
      console.log("data2:", data2);

      setScriptA(data2?.scriptA || "");
      setScriptB(data2?.scriptB || "");
      setPrompts(data2?.prompts || null);

      // 🔥 NUEVO: Permission DM
      const permission = generatePermissionDM(name, nicheSafe);
      setPermissionDM(permission);

    } catch (err) {
      console.error(err);
      alert("Error generating");
    }

    setLoading(false);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>AI Loom Generator</h1>

      <input
        placeholder="Prospect Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <br /><br />

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      <br /><br />

      {/* 🔥 Step 1: Permission Message */}
      {permissionDM && (
        <>
          <h3>Step 1: Permission Message</h3>
          <pre>{permissionDM}</pre>
          <button onClick={() => copy(permissionDM)}>Copy DM</button>
          <br /><br />
        </>
      )}

      {/* Step 2: Loom Scripts */}
      {scriptA && (
        <>
          <h3>Script A</h3>
          <pre>{scriptA}</pre>
          <button onClick={() => copy(scriptA)}>Copy</button>
          <br /><br />
        </>
      )}

      {scriptB && (
        <>
          <h3>Script B</h3>
          <pre>{scriptB}</pre>
          <button onClick={() => copy(scriptB)}>Copy</button>
          <br /><br />
        </>
      )}

      {/* Step 3: Prompts */}
      {prompts && (
        <>
          <h3>Prompts</h3>
          <pre>{JSON.stringify(prompts, null, 2)}</pre>
        </>
      )}
    </main>
  );
}
