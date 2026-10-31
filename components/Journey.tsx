"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { positionAt, type Stop } from "@/lib/routes";

type Leg = Stop & { at: number };

const CARRIER_ICON: Record<string, string> = { Kervan: "🐫", Ulak: "🐎", Yelkenli: "⛵" };

function progressAt(sentAt: number, arrivesAt: number, now: number) {
  return Math.min(1, Math.max(0, (now - sentAt) / (arrivesAt - sentAt)));
}

function remaining(ms: number): string {
  if (ms <= 0) return "Vardı";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d} gün ${h} saat`;
  if (h > 0) return `${h} saat ${m} dakika`;
  if (m > 0) return `${m} dakika ${s % 60} saniye`;
  return `${s} saniye`;
}

export default function Journey({
  stops,
  sentAt,
  arrivesAt,
  carrier,
  serverNow,
}: {
  stops: Leg[];
  sentAt: string;
  arrivesAt: string;
  carrier: string;
  serverNow: number;
}) {
  const start = new Date(sentAt).getTime();
  const end = new Date(arrivesAt).getTime();
  const [now, setNow] = useState(serverNow);
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const marker = useRef<Marker | null>(null);
  const p = progressAt(start, end, now);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !mapEl.current || map.current) return;
      const m = L.map(mapEl.current, { scrollWheelZoom: false, attributionControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 10,
        attribution: "© OpenStreetMap",
      }).addTo(m);
      const line = stops.map((s) => [s.lat, s.lng] as [number, number]);
      L.polyline(line, { color: "#7a2e1d", weight: 3, dashArray: "6 8", opacity: 0.8 }).addTo(m);
      for (const s of stops) {
        L.circleMarker([s.lat, s.lng], { radius: 5, color: "#7a2e1d", fillColor: "#f4ead5", fillOpacity: 1, weight: 2 })
          .bindTooltip(s.name)
          .addTo(m);
      }
      const here = positionAt(stops, progressAt(start, end, Date.now()));
      marker.current = L.marker([here.lat, here.lng], {
        icon: L.divIcon({
          className: "caravan-marker",
          html: CARRIER_ICON[carrier] ?? "✉️",
          iconSize: [32, 32],
          iconAnchor: [16, 24],
        }),
        zIndexOffset: 1000,
      }).addTo(m);
      m.fitBounds(L.latLngBounds(line), { padding: [30, 30] });
      map.current = m;
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, [stops, start, end, carrier]);

  useEffect(() => {
    const here = positionAt(stops, p);
    marker.current?.setLatLng([here.lat, here.lng]);
  }, [p, stops]);

  const passed = stops.filter((s) => s.at <= p);
  const last = passed[passed.length - 1];
  const next = stops.find((s) => s.at > p);

  return (
    <>
      <div className="status">
        <div className="eta">{p >= 1 ? "Mektup vardı" : remaining(end - now)}</div>
        <div className="muted">
          {p >= 1
            ? `Yolculuk tamamlandı: ${stops[stops.length - 1].name}.`
            : `${last.name} geçildi${next ? `, sıradaki durak ${next.name}` : ""}.`}
        </div>
        <div className="bar" aria-label="Yolculuk ilerlemesi">
          <div style={{ width: `${(p * 100).toFixed(2)}%` }} />
        </div>
      </div>
      <div ref={mapEl} className="map" />

      <h2>Mühürler</h2>
      <ul className="stamps">
        {stops.map((s) => {
          const done = s.at <= p;
          return (
            <li key={s.name} className={done ? "" : "pending"}>
              <div className="stamp">{done ? s.name : "?"}</div>
              <div>
                <h3>{s.name}</h3>
                <p>{done ? s.story : "Mektup buraya varınca bu durağın hikâyesi açılacak."}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
