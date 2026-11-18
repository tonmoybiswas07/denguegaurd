"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Hospital as HospitalIcon,
  Search,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Building2,
  Bed,
  HeartPulse,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BANGLADESH_DISTRICTS } from "@/lib/constants";
import type { HospitalItem } from "@/lib/data/mockData";
import { useDirectory } from "@/lib/data/useDirectory";
import DirectoryStatus from "@/components/common/DirectoryStatus";

// Dynamically import Leaflet Hospital Map with SSR disabled
const HospitalMap = dynamic(() => import("@/components/maps/HospitalMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading Interactive Hospital Map...</span>
      </div>
    </div>
  ),
});

export default function HospitalsPage() {
  return (
    <Suspense fallback={<p role="status" className="mx-auto max-w-7xl p-8">Loading hospital search…</p>}>
      <HospitalDirectory />
    </Suspense>
  );
}

function HospitalDirectory() {
  const initialSearch = useSearchParams().get("q") ?? "";
  return <HospitalResults key={initialSearch} initialSearch={initialSearch} />;
}

function HospitalResults({ initialSearch }: { initialSearch: string }) {
  const directory = useDirectory<HospitalItem>("/api/hospitals");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [onlyAvailableBeds, setOnlyAvailableBeds] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<HospitalItem | null>(null);

  const query = searchTerm.trim().toLowerCase();
  const filteredHospitals = directory.items.filter((h) => {
    const matchesSearch =
      [h.name, h.area, h.district, h.address].some((value) => value.toLowerCase().includes(query));

    const matchesDistrict =
      selectedDistrict === "All" || h.district.toLowerCase() === selectedDistrict.toLowerCase();

    const matchesType = filterType === "All" || h.type === filterType;

    const matchesBed = !onlyAvailableBeds || h.availableDengueBeds > 0;

    return matchesSearch && matchesDistrict && matchesType && matchesBed;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <HospitalIcon className="w-3.5 h-3.5 text-teal-600" />
          <span>Hospital directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f2744] tracking-tight">
          Find dengue care near you
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Search hospitals by location and compare listed dengue and ICU beds. Call the facility to confirm availability before travelling.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Text Search */}
          <div className="md:col-span-5 relative">
            <Search aria-hidden="true" className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            <input
              type="search"
              aria-label="Search hospitals"
              placeholder="Search by hospital, area, or district"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* District Select */}
          <div className="md:col-span-4">
            <select
              aria-label="District"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
            >
              <option value="All">All Districts</option>
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Hospital Type */}
          <div className="md:col-span-3">
            <select
              aria-label="Hospital type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
            >
              <option value="All">All Hospital Types</option>
              <option value="Government">Government Hospitals</option>
              <option value="Private">Private Hospitals</option>
              <option value="Specialized">Specialized Hospitals</option>
            </select>
          </div>
        </div>

        {/* Filter Badges / Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={onlyAvailableBeds}
              onChange={(e) => setOnlyAvailableBeds(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>Only facilities listing available dengue beds</span>
          </label>

          <span className="text-slate-500">
            {directory.source && <>Showing <strong>{filteredHospitals.length}</strong> {directory.source === "demo" ? "sample" : "verified"} facilities</>}
          </span>
        </div>
      </div>

      <DirectoryStatus {...directory} />

      {filteredHospitals.length > 0 && <section id="hospital-map" tabIndex={-1} className="scroll-mt-24 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0f2744] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            <span>Geographic Facility Distribution</span>
          </h3>
          <span className="text-xs text-slate-500">Select a pin to view facility details</span>
        </div>
        <HospitalMap
          hospitals={filteredHospitals}
          selectedHospital={filteredHospitals.find((hospital) => hospital.id === selectedHospital?.id) ?? null}
          showPhone={directory.source === "registry"}
        />
      </section>}

      {/* Hospital Cards Grid */}
      {!directory.loading && !directory.error && <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#0f2744]">
          Hospital Directory Listings
        </h3>

        {filteredHospitals.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-700">No matching facilities found</h4>
            <p className="text-xs text-slate-500">
              Try adjusting your district filter or search query.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedDistrict("All");
              setFilterType("All");
              setOnlyAvailableBeds(false);
            }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => {
              const isSelected = selectedHospital?.id === hospital.id;
              return (
                <Card
                  key={hospital.id}
                  className={`p-5 flex flex-col justify-between transition-all ${
                    isSelected
                      ? "ring-2 ring-teal-600 shadow-md border-transparent"
                      : "hover:border-teal-300"
                  }`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant={hospital.type === "Government" ? "navy" : "secondary"}>
                        {hospital.type}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        {directory.source === "registry" && hospital.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            Verified
                          </span>
                        )}
                        {hospital.hasDedicatedDengueUnit && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Dengue Ward
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#0f2744] text-base leading-tight">
                        {hospital.name}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{hospital.address}</span>
                      </p>
                    </div>

                    {/* Bed & ICU Counts */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Dengue Beds:</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Bed className="w-3.5 h-3.5 text-teal-600" />
                          <strong className="text-sm font-bold text-teal-700">
                            {hospital.availableDengueBeds} Available
                          </strong>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">ICU Beds:</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                          <strong className="text-sm font-bold text-slate-800">
                            {hospital.icuAvailable} / {hospital.icuTotal}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
                    <Button variant="outline" size="sm" aria-pressed={isSelected} onClick={() => {
                      setSelectedHospital(hospital);
                      document.getElementById("hospital-map")?.focus();
                    }}>Show on map</Button>
                    {directory.source === "registry" && <a
                      href={`tel:${hospital.emergencyPhone}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg bg-[#0f2744] hover:bg-[#16365c] text-white transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                      <span>Call hospital</span>
                    </a>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>}
    </div>
  );
}

