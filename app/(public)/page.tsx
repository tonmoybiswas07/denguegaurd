import Link from "next/link";
import { Activity, ArrowRight, HeartHandshake, Hospital, MapPin, Search, Shield, BarChart3 } from "lucide-react";
import MedicalDisclaimer from "@/components/common/MedicalDisclaimer";

const services = [
  { href: "/symptoms", icon: Activity, title: "Check symptoms", description: "Review warning signs and use the symptom checker.", color: "bg-teal-50 text-teal-800" },
  { href: "/hospitals", icon: Hospital, title: "Find a hospital", description: "Explore facilities by district and check listed bed availability.", color: "bg-sky-50 text-sky-800" },
  { href: "/blood-donors", icon: HeartHandshake, title: "Blood & platelet donors", description: "Browse by blood group and district, or register to donate.", color: "bg-rose-50 text-rose-800" },
  { href: "/prevention", icon: Shield, title: "Prevent dengue", description: "Find practical ways to reduce mosquito breeding and bites.", color: "bg-amber-50 text-amber-900" },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-[radial-gradient(ellipse_at_top_right,#165953,#10273d_58%)] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-teal-200"><MapPin aria-hidden="true" size={17} /> Dengue care in Bangladesh</p>
            <h1 className="max-w-xl text-5xl font-bold leading-[1.06] tracking-tight sm:text-6xl">Know the signs.<br /><span className="text-teal-200">Find care faster.</span></h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-200 sm:text-lg">Check symptoms, find a hospital, and learn how to protect your household from dengue.</p>
            <Link href="/symptoms" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-teal-200 px-5 font-bold text-[#132622] hover:bg-teal-300">
              Check symptoms <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl sm:p-8">
            <Hospital aria-hidden="true" className="mb-4 size-11 rounded-xl bg-teal-50 p-2.5 text-teal-800" />
            <h2 className="text-2xl font-bold tracking-tight">Find a dengue care facility</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">Search by hospital, area, or district.</p>
            <form action="/hospitals" className="mt-6">
              <label htmlFor="hospital-search" className="block text-sm font-semibold">Location or hospital name</label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input id="hospital-search" name="q" placeholder="e.g. Dhaka" className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-300 px-3" />
                <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 font-semibold text-white hover:bg-teal-900">
                  <Search aria-hidden="true" size={17} /> Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section aria-labelledby="services" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h2 id="services" className="mb-6 text-3xl font-bold tracking-tight text-slate-900">How can we help?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ href, icon: Icon, title, description, color }) => (
            <Link key={href} href={href} className="group flex flex-col items-start rounded-2xl border bg-white p-5 hover:border-teal-600">
              <span className={`mb-4 rounded-xl p-3 ${color}`}><Icon aria-hidden="true" size={22} /></span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
              <ArrowRight aria-hidden="true" className="mt-4 size-5 text-teal-800 group-hover:translate-x-1 motion-reduce:transform-none" />
            </Link>
          ))}
        </div>
        <div className="my-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-teal-800">
          <Link href="/awareness" className="underline underline-offset-4">Learn about dengue</Link>
          <Link href="/statistics" className="inline-flex items-center gap-2 underline underline-offset-4"><BarChart3 aria-hidden="true" size={17} /> Explore sample statistics</Link>
        </div>
        <MedicalDisclaimer />
      </section>
    </div>
  );
}
