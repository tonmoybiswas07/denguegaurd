export const APP_NAME = "DengueGuard";
export const APP_TAGLINE = "Smart Dengue Prevention & Management System";
export const APP_DESCRIPTION =
  "A comprehensive healthcare intelligence platform providing real-time dengue surveillance, clinical symptom triage, hospital & blood donor matching, and patient health tracking.";

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const BANGLADESH_DISTRICTS = [
  "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh",
  "Bagerhat", "Bandarban", "Barguna", "Bhola", "Bogura", "Brahmanbaria", "Chandpur", "Chapai Nawabganj",
  "Chuadanga", "Cox's Bazar", "Cumilla", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur",
  "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachari",
  "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj",
  "Meherpur", "Moulvibazar", "Munshiganj", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
  "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari",
  "Rangamati", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Tangail", "Thakurgaon"
] as const;

export const EMERGENCY_HOTLINES = [
  { name: "National Emergency Service", number: "999", available: "24/7" },
  { name: "IEDCR Dengue Helpline", number: "10655", available: "24/7" },
  { name: "Directorate General of Health Services (DGHS)", number: "16263", available: "24/7" },
  { name: "National Blood Center (Red Crescent)", number: "+880 2-9330188", available: "9 AM - 8 PM" },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Awareness", href: "/awareness" },
  { label: "Symptom Checker", href: "/symptoms" },
  { label: "Prevention", href: "/prevention" },
  { label: "Hospital Finder", href: "/hospitals" },
  { label: "Blood Donors", href: "/blood-donors" },
  { label: "Statistics", href: "/statistics" },
] as const;

