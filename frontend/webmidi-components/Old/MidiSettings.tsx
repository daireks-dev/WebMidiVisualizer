"use client";
import { useEffect, useState } from "react";

export default function MidiSettings() {
  const [userId, setUserId] = useState("");
  const [color, setColor] = useState("Brown");
  const [xZoom, setXZoom] = useState(1);
  const [yZoom, setYZoom] = useState(1);

  useEffect(() => {
    async function initUUID() {
      let storedId = localStorage.getItem("userId");
      //storedId = null

      // If no ID, create and POST it
      if (!storedId) {
        storedId = crypto.randomUUID();
        localStorage.setItem("userId", storedId);

        await fetch(`http://localhost:8080/api/v1/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: storedId, color: color, xZoom: xZoom, yZoom: yZoom }),
        });
      }

      console.log(storedId);
      setUserId(storedId);

      // Fetch settings for this user after ensuring ID exists
      const response = await fetch(`http://localhost:8080/api/v1/users/${storedId}`);
      if (response.ok) {
        const data = await response.json();
        setColor(data.color);
        setXZoom(data.xZoom);
        setYZoom(data.yZoom);
      }
    }

    initUUID();
  }, []);

  async function saveSettings() {
    if (!userId) return;

    const newSettings = { color, xZoom, yZoom };

    await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSettings),
    });

    alert("Settings saved!");
  }

  return (
    <div className="mt-8 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl text-gray-500 font-semibold mb-4">Settings</h2>

      <label className="block mb-2 text-gray-500">
        Color:
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-2 text-gray-500">
        xZoom:
        <input
          type="number"
          value={xZoom}
          onChange={(e) => setXZoom(Number(e.target.value))}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-2 text-gray-500">
        yZoom:
        <input
          type="number"
          value={yZoom}
          onChange={(e) => setYZoom(Number(e.target.value))}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={saveSettings}
      >
        Save
      </button>
    </div>
  );
}
