import bcrypt from "bcryptjs";
import { connectDB } from "./connect";
import {
  User,
  PatientProfile,
  DoctorProfile,
  Hospital,
  BloodDonor,
  HealthRecord,
  Appointment,
  AwarenessArticle,
  DengueReport,
} from "@/models";
import { MOCK_HOSPITALS, MOCK_DONORS } from "@/lib/data/mockData";

export async function seedDatabase() {
  await connectDB();

  // 1. Check if Admin already exists
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    return { success: true, message: "Database is already initialized." };
  }

  // 2. Hash default admin password from environment
  const salt = await bcrypt.genSalt(10);
  const adminName = process.env.ADMIN_DEFAULT_NAME || "System Administrator";
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@dengueguard.org";
  const rawAdminPass = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@DengueGuard2025!";
  const adminPassword = await bcrypt.hash(rawAdminPass, salt);
  const doctorPassword = await bcrypt.hash("Doctor@DengueGuard2025!", salt);
  const patientPassword = await bcrypt.hash("Patient@DengueGuard2025!", salt);

  // 3. Create Administrator
  const admin = await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: "admin",
    phone: "+8801700000000",
    isVerified: true,
  });

  // 4. Create Sample Doctor
  const doctorUser = await User.create({
    name: "Dr. Kazi Mahfuzur Rahman",
    email: "doctor@dengueguard.org",
    password: doctorPassword,
    role: "doctor",
    phone: "+8801711000002",
    isVerified: true,
  });

  await DoctorProfile.create({
    userId: doctorUser._id,
    bmdcRegistrationNumber: "A-54912",
    specialization: "Internal Medicine & Infectious Disease Specialist",
    hospitalAffiliation: "Dhaka Medical College & Hospital (DMCH)",
    yearsOfExperience: 14,
    verificationStatus: "approved",
    consultationFee: 800,
    availableDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    bio: "Senior Consultant in infectious tropical diseases with extensive clinical management experience during Bangladesh dengue epidemics.",
  });

  // 5. Create Sample Patient
  const patientUser = await User.create({
    name: "Ahmad Tariqul Islam",
    email: "patient@dengueguard.org",
    password: patientPassword,
    role: "patient",
    phone: "+8801711000003",
    isVerified: true,
  });

  await PatientProfile.create({
    userId: patientUser._id,
    dateOfBirth: new Date("1994-06-15"),
    gender: "Male",
    bloodGroup: "O+",
    address: "House 24, Road 8, Dhanmondi",
    district: "Dhaka",
    emergencyContactName: "Farzana Yasmin (Spouse)",
    emergencyContactPhone: "+8801819000004",
    medicalHistory: ["Mild Asthma", "No prior dengue history"],
    allergies: ["Penicillin"],
  });

  // 6. Create Initial Vitals / CBC Records for Sample Patient
  await HealthRecord.create([
    {
      patientId: patientUser._id,
      recordDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Day 1
      temperature: 103.5,
      plateletCount: 185000,
      hematocrit: 41,
      wbcCount: 4200,
      symptoms: ["High fever", "Severe headache", "Eye pain"],
      notes: "Baseline CBC. Started ORS oral rehydration.",
      enteredBy: patientUser._id,
    },
    {
      patientId: patientUser._id,
      recordDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Day 2
      temperature: 102.8,
      plateletCount: 140000,
      hematocrit: 43,
      wbcCount: 3600,
      symptoms: ["Fever", "Body aches", "Mild nausea"],
      notes: "Temperature reducing slightly, mild thrombocytopenia observed.",
      enteredBy: patientUser._id,
    },
    {
      patientId: patientUser._id,
      recordDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Day 3
      temperature: 100.2,
      plateletCount: 88000,
      hematocrit: 46,
      wbcCount: 3100,
      symptoms: ["Weakness", "Decreased appetite"],
      notes: "Critical phase entry. Platelets below 100k; hematocrit rising. Advised close clinical review.",
      enteredBy: patientUser._id,
    },
  ]);

  // 7. Create Appointment Link between Patient and Doctor
  await Appointment.create({
    patientId: patientUser._id,
    doctorId: doctorUser._id,
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    timeSlot: "04:30 PM",
    status: "confirmed",
    symptomsSummary: "Day 4 of dengue illness. Fever defervesced to 99°F, platelet count decreased to 88,000/μL. Needs clinical review for plasma leakage.",
    doctorNotes: "Monitor hematocrit every 12 hours. Continue oral fluid intake 2.5L/day. Report immediately if persistent vomiting or abdominal pain occurs.",
  });

  // 8. Seed Hospitals
  for (const h of MOCK_HOSPITALS) {
    await Hospital.create({
      name: h.name,
      district: h.district,
      area: h.area,
      address: h.address,
      type: h.type,
      phone: h.phone,
      emergencyPhone: h.emergencyPhone,
      totalBeds: h.totalBeds,
      availableDengueBeds: h.availableDengueBeds,
      icuTotal: h.icuTotal,
      icuAvailable: h.icuAvailable,
      hasDedicatedDengueUnit: h.hasDedicatedDengueUnit,
      isVerified: h.isVerified,
      location: {
        type: "Point",
        coordinates: [h.lng, h.lat],
      },
    });
  }

  // 9. Seed Blood Donors
  for (const d of MOCK_DONORS) {
    await BloodDonor.create({
      name: d.name,
      bloodGroup: d.bloodGroup as any,
      district: d.district,
      area: d.area,
      phone: "+8801700000000",
      isAvailable: d.isAvailable,
      isPlateletDonor: d.isPlateletDonor,
      lastDonationDate: new Date(d.lastDonationDate),
      totalDonations: d.totalDonations,
      verificationStatus: d.verificationStatus,
    });
  }

  // 10. Seed Awareness Article
  await AwarenessArticle.create({
    title: "Clinical Fluid Management Protocols During the Dengue Critical Phase",
    slug: "clinical-fluid-management-critical-phase",
    category: "Clinical",
    summary: "A practical guide for primary care physicians and patients regarding the 48-hour plasma leakage window.",
    content: "During the critical phase of dengue, the primary pathophysiological event is transient plasma leakage into serous cavities...",
    authorId: doctorUser._id,
    isPublished: true,
    publishedAt: new Date(),
  });

  return {
    success: true,
    message: "DengueGuard database successfully seeded with Admin, Doctor, Patient, Hospitals, and Donors.",
    credentials: {
      admin: { email: "admin@dengueguard.org", password: "Admin@DengueGuard2025!" },
      doctor: { email: "doctor@dengueguard.org", password: "Doctor@DengueGuard2025!" },
      patient: { email: "patient@dengueguard.org", password: "Patient@DengueGuard2025!" },
    },
  };
}
