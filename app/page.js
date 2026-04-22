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

  // 🔥 NUEVO: Permission DM con dominio
  const generatePermissionDM = (name, niche, url) => {
    const domain = url
      .replace("https://", "")
      .replace("http://", "")
      .split("/")[0];

    return `Hey ${name},

I was looking into how companies like ${domain} are showing up in the ${niche} space on ChatGPT, and noticed some interesting patterns in what gets recommended.

Happy to send you a quick Loom showing what I found and how it might apply — just let me know 👍`;
  };

  const generate = async () => {
    if (!name || !url) {
      alert("Fill everything");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Step 1: Analyze
      const res1 = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data1 = await res1.json();
      const nicheSafe = data1?.niche || "your industry";

      // 🔹 Step 2: Generate scripts
      const res2 = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          url,
          niche: nicheSafe,
        }),
      });

      const data2 = await res2.json();

      setScriptA(data2?.scriptA || "");
      setScriptB(data2?.scriptB || "");
      setPrompts(data2?.prompts || null);

      // 🔥 Permission DM
      const permission = generatePermissionDM(name, nicheSafe, url);
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

      <p><strong>Recommended flow:</strong></p>
      <p>1. Send permission DM → 2. Wait reply → 3. Send Loom → 4. Follow up</p>

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

      {/* STEP 1 */}
      {permissionDM && (
        <>
          <h3>Step 1: Ask for Permission</h3>
          <pre>{permissionDM}</pre>
          <button onClick={() => copy(permissionDM)}>Copy DM</button>
          <br /><br />
        </>
      )}

      {/* STEP 2 */}
      {scriptA && (
        <>
          <h3>Step 2: Send Loom (Script A)</h3>
          <pre>{scriptA}</pre>
          <button onClick={() => copy(scriptA)}>Copy</button>
          <br /><br />
        </>
      )}

      {scriptB && (
        <>
          <h3>Alternative Script</h3>
          <pre>{scriptB}</pre>
          <button onClick={() => copy(scriptB)}>Copy</button>
          <br /><br />
        </>
      )}

      {/* STEP 3 */}
      {prompts && (
        <>
          <h3>Step 3: ChatGPT Prompts</h3>
          <pre>{JSON.stringify(prompts, null, 2)}</pre>
        </>
      )}
    </main>
  );
}
