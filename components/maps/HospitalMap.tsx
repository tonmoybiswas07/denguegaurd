"use client";

import { useEffect, useRef } from "react";
import type { Map, Marker } from "leaflet";
import type { HospitalItem } from "@/lib/data/mockData";

interface HospitalMapProps {
  hospitals: HospitalItem[];
  selectedHospital?: HospitalItem | null;
  showPhone: boolean;
}

export default function HospitalMap({
  hospitals,
  selectedHospital,
  showPhone,
}: HospitalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    let isMounted = true;

    // Dynamically load Leaflet on the client side only
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Prevent re-initialization if already initialized
      if (!mapInstanceRef.current) {
        // Default center: Bangladesh (Dhaka)
        const initialCenter: [number, number] = [23.8103, 90.4125];
        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: 7,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current = [];

      // Create Custom SVG Marker Icon
      const createCustomIcon = (isSelected: boolean, beds: number) => {
        const bgColor = isSelected ? "#0f2744" : beds > 20 ? "#0d9488" : "#e11d48";
        const html = `
          <div style="
            background-color: ${bgColor};
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">
            +
          </div>
        `;
        return L.divIcon({
          html,
          className: "custom-hospital-pin",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });
      };

      if (selectedHospital && Number.isFinite(selectedHospital.lat) && Number.isFinite(selectedHospital.lng)) {
        map.setView([selectedHospital.lat, selectedHospital.lng], 13, { animate: false });
      }

      // Add markers for hospitals
      hospitals.forEach((hospital) => {
        if (!Number.isFinite(hospital.lat) || !Number.isFinite(hospital.lng)) return;
        const isSelected = selectedHospital?.id === hospital.id;
        const icon = createCustomIcon(isSelected, hospital.availableDengueBeds);

        const marker = L.marker([hospital.lat, hospital.lng], { icon }).addTo(map);

        const popup = document.createElement("div");
        popup.className = "space-y-1 text-sm";
        const name = document.createElement("strong");
        name.textContent = hospital.name;
        const area = document.createElement("div");
        area.textContent = `${hospital.area}, ${hospital.district}`;
        const beds = document.createElement("div");
        beds.textContent = `Listed beds: ${hospital.availableDengueBeds} dengue · ${hospital.icuAvailable} ICU`;
        popup.append(name, area, beds);
        if (showPhone && hospital.emergencyPhone) {
          const phone = document.createElement("a");
          phone.href = `tel:${hospital.emergencyPhone}`;
          phone.textContent = "Call hospital";
          popup.append(phone);
        }

        marker.bindPopup(popup);
        if (isSelected) marker.openPopup();
        markersRef.current.push(marker);
      });

      if (!selectedHospital && markersRef.current.length) {
        map.fitBounds(L.latLngBounds(markersRef.current.map((marker) => marker.getLatLng())), {
          maxZoom: 12,
          padding: [24, 24],
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [hospitals, selectedHospital, showPhone]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200/80 shadow-xs text-xs space-y-1">
        <div className="font-semibold text-slate-800">Map Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-teal-600"></span>
          <span>&gt; 20 Dengue Beds</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-600"></span>
          <span>20 or fewer dengue beds</span>
        </div>
      </div>
    </div>
  );
}

