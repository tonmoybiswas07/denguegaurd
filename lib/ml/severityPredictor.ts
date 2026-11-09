/**
 * DengueGuard Clinical Severity & Plasma Leakage Prediction Model
 * 
 * Based on:
 * - WHO 2009 Revised Dengue Clinical Classification
 * - DGHS (Directorate General of Health Services Bangladesh) National Dengue Clinical Guidelines
 * 
 * Computes:
 * - Severity Risk Index (0 - 100)
 * - Plasma Leakage & Dengue Hemorrhagic Fever (DHF) Probability
 * - Current Illness Phase (Febrile vs Critical Leakage vs Recovery)
 * - Safe clinical next-step triage recommendations
 */

export interface ClinicalPredictorInput {
  dayOfIllness: number; // 1 to 14
  plateletCount: number; // e.g. 85000 (cells/μL)
  hematocrit?: number; // e.g. 45 (%)
  baselineHematocrit?: number; // e.g. 38 (%)
  temperature?: number; // in Fahrenheit, e.g. 101.5
  warningSigns: string[]; // ['abd_pain', 'vomiting', 'mucosal_bleeding', 'lethargy', 'fluid_accumulation']
  age?: number;
  hasComorbidities?: boolean; // diabetes, hypertension, pregnancy
}

export interface ClinicalPredictorOutput {
  riskScore: number; // 0 to 100
  riskLevel: "LOW" | "MODERATE" | "HIGH_CRITICAL";
  riskLabel: string;
  plasmaLeakageProbability: number; // 0 to 100%
  illnessPhase: "FEBRILE_PHASE" | "CRITICAL_LEAKAGE_PHASE" | "CONVALESCENT_PHASE";
  phaseDescription: string;
  warningFlagsCount: number;
  urgency: "HOME_CARE_AND_HYDRATION" | "CLINICAL_REVIEW_REQUIRED" | "IMMEDIATE_EMERGENCY_HOSPITALIZATION";
  recommendations: string[];
  keyClinicalInsights: string[];
}

export function predictDengueSeverity(input: ClinicalPredictorInput): ClinicalPredictorOutput {
  const {
    dayOfIllness,
    plateletCount,
    hematocrit,
    baselineHematocrit = 38,
    temperature = 100,
    warningSigns = [],
    age = 28,
    hasComorbidities = false,
  } = input;

  let score = 15; // baseline baseline febrile risk
  const insights: string[] = [];
  const recommendations: string[] = [];

  // 1. Illness Phase Determination (Critical phase is typically Days 3 to 6 as fever drops)
  let illnessPhase: ClinicalPredictorOutput["illnessPhase"] = "FEBRILE_PHASE";
  let phaseDescription = "Days 1 to 3: Characterized by viremia and high fever.";

  if (dayOfIllness >= 3 && dayOfIllness <= 6) {
    illnessPhase = "CRITICAL_LEAKAGE_PHASE";
    phaseDescription = "Days 3 to 6: Critical defervescence window when plasma leakage risk is highest.";
    score += 20; // Critical window penalty
    insights.push("Patient is currently inside the high-risk critical defervescence window (Days 3-6).");
  } else if (dayOfIllness >= 7) {
    illnessPhase = "CONVALESCENT_PHASE";
    phaseDescription = "Days 7+: Fluid reabsorption phase with gradual platelet normalization.";
    insights.push("Patient is in the recovery/convalescent stage.");
  }

  // 2. Platelet Count Evaluation (WHO Standard)
  if (plateletCount < 20000) {
    score += 40;
    insights.push("Extremely critical thrombocytopenia (<20,000/μL): High risk of spontaneous internal hemorrhage.");
  } else if (plateletCount < 50000) {
    score += 30;
    insights.push("Severe thrombocytopenia (<50,000/μL): Urgent hospital monitoring mandatory.");
  } else if (plateletCount < 100000) {
    score += 18;
    insights.push("Moderate thrombocytopenia (<100,000/μL): Daily CBC monitoring required.");
  } else if (plateletCount < 150000) {
    score += 8;
    insights.push("Mild platelet decrease. Monitor serial CBC over the next 48 hours.");
  }

  // 3. Hematocrit / Hemoconcentration (Indicator of Plasma Leakage)
  let leakageProb = 10;
  if (hematocrit) {
    const hctRise = ((hematocrit - baselineHematocrit) / baselineHematocrit) * 100;
    if (hctRise >= 20 || hematocrit >= 46) {
      score += 25;
      leakageProb += 60;
      insights.push(`Elevated hematocrit (${hematocrit}%): Indicates active intravascular plasma leakage.`);
    } else if (hctRise >= 10 || hematocrit >= 42) {
      score += 12;
      leakageProb += 30;
      insights.push(`Moderate hemoconcentration (${hematocrit}%): Early sign of fluid loss.`);
    }
  }

  // 4. Warning Signs Count (Each warning sign is a strong predictor of Severe Dengue)
  const warningCount = warningSigns.length;
  if (warningCount >= 3) {
    score += 30;
    leakageProb += 25;
    insights.push(`Multiple clinical warning signs (${warningCount}) present: Severe Dengue syndrome likely.`);
  } else if (warningCount >= 1) {
    score += 15 * warningCount;
    leakageProb += 15 * warningCount;
    insights.push(`${warningCount} warning sign(s) detected: Patient requires immediate medical evaluation.`);
  }

  // 5. Vulnerability Factors
  if (age < 5 || age > 60) {
    score += 8;
    insights.push("Age-related physiological vulnerability factor.");
  }
  if (hasComorbidities) {
    score += 10;
    insights.push("Pre-existing comorbidity elevates risk of complications.");
  }

  // Bound score 0 to 100
  score = Math.min(100, Math.max(5, Math.round(score)));
  leakageProb = Math.min(98, Math.max(5, Math.round(leakageProb)));

  // Stratify Risk Level
  let riskLevel: ClinicalPredictorOutput["riskLevel"] = "LOW";
  let riskLabel = "Low Risk (Grade I Febrile Dengue)";
  let urgency: ClinicalPredictorOutput["urgency"] = "HOME_CARE_AND_HYDRATION";

  if (score >= 65 || plateletCount < 50000 || warningCount >= 2) {
    riskLevel = "HIGH_CRITICAL";
    riskLabel = "High / Critical Risk (Severe Dengue / DHF)";
    urgency = "IMMEDIATE_EMERGENCY_HOSPITALIZATION";
    recommendations.push("Seek immediate admission to a hospital with dedicated dengue ICU beds.");
    recommendations.push("Initiate IV fluid resuscitation under qualified physician supervision.");
    recommendations.push("Prepare potential blood/platelet apheresis donors (DengueGuard Blood Registry).");
    recommendations.push("DO NOT take NSAIDs (Aspirin, Ibuprofen, Diclofenac).");
  } else if (score >= 38 || plateletCount < 100000 || warningCount === 1) {
    riskLevel = "MODERATE";
    riskLabel = "Moderate Risk (Dengue with Warning Signs)";
    urgency = "CLINICAL_REVIEW_REQUIRED";
    recommendations.push("Schedule a consultation with a registered doctor within 12 hours.");
    recommendations.push("Perform serial Complete Blood Count (CBC) every 24 hours.");
    recommendations.push("Maintain aggressive oral hydration with ORS and natural fruit juices.");
    recommendations.push("Monitor for mucosal bleeding, extreme drowsiness, or continuous vomiting.");
  } else {
    riskLevel = "LOW";
    riskLabel = "Low Risk (Dengue without Warning Signs)";
    urgency = "HOME_CARE_AND_HYDRATION";
    recommendations.push("Rest at home with continuous oral rehydration (2.5L+ fluids/day).");
    recommendations.push("Use Paracetamol only for fever above 101°F (respecting maximum daily dose).");
    recommendations.push("Repeat CBC test on illness Day 3 and Day 5 to monitor platelet velocity.");
  }

  return {
    riskScore: score,
    riskLevel,
    riskLabel,
    plasmaLeakageProbability: leakageProb,
    illnessPhase,
    phaseDescription,
    warningFlagsCount: warningCount,
    urgency,
    recommendations,
    keyClinicalInsights: insights,
  };
}

