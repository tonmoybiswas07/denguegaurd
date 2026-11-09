"use client";

import React, { useEffect, useRef } from "react";
import type { HospitalItem } from "@/lib/data/mockData";

interface HospitalMapProps {
  hospitals: HospitalItem[];
  selectedHospital?: HospitalItem | null;
  onSelectHospital?: (hospital: HospitalItem) => void;
}

export default function HospitalMap({
  hospitals,
  selectedHospital,
  onSelectHospital,
}: HospitalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

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

      // Add markers for hospitals
      hospitals.forEach((hospital) => {
        const isSelected = selectedHospital?.id === hospital.id;
        const icon = createCustomIcon(isSelected, hospital.availableDengueBeds);

        const marker = L.marker([hospital.lat, hospital.lng], { icon }).addTo(map);

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; min-width: 180px; padding: 4px;">
            <div style="font-weight: 700; color: #0f2744; font-size: 13px; margin-bottom: 2px;">
              ${hospital.name}
            </div>
            <div style="color: #64748b; margin-bottom: 6px;">
              ${hospital.area}, ${hospital.district}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Dengue Beds:</span>
              <strong style="color: ${hospital.availableDengueBeds > 0 ? "#0d9488" : "#dc2626"};">
                ${hospital.availableDengueBeds} Available
              </strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>ICU Beds:</span>
              <strong>${hospital.icuAvailable} of ${hospital.icuTotal}</strong>
            </div>
            <a href="tel:${hospital.emergencyPhone}" style="
              display: inline-block;
              width: 100%;
              text-align: center;
              background-color: #0f2744;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              text-decoration: none;
              font-weight: 600;
              margin-top: 4px;
            ">
              Emergency: ${hospital.emergencyPhone}
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on("click", () => {
          if (onSelectHospital) {
            onSelectHospital(hospital);
          }
        });

        markersRef.current.push(marker);
      });

      // Fly to selected hospital if chosen
      if (selectedHospital) {
        map.flyTo([selectedHospital.lat, selectedHospital.lng], 13, {
          duration: 1.2,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [hospitals, selectedHospital, onSelectHospital]);

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
          <span>Critical / Low Beds</span>
        </div>
      </div>
    </div>
  );
}

