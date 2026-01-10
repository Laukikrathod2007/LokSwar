import { Scheme } from '@/types/eligibility';

export const schemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN",
    nameHindi: "प्रधानमंत्री किसान सम्मान निधि",
    category: "agriculture",
    description: "Income support of ₹6,000 per year to small and marginal farmer families with cultivable land.",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    benefits: [
      "₹6,000 per year in three equal installments",
      "Direct benefit transfer to bank account",
      "No middlemen involved"
    ],
    eligibilityCriteria: [
      {
        id: "pk-1",
        field: "hasLand",
        operator: "equals",
        value: true,
        description: "Must own cultivable land"
      },
      {
        id: "pk-2",
        field: "landHolding",
        operator: "lessThan",
        value: 2,
        description: "Land holding must be less than 2 hectares"
      }
    ],
    requiredDocuments: ["Aadhaar Card", "Land Records", "Bank Passbook"],
    iconName: "Wheat"
  },
  {
    id: "pmay",
    name: "PM Awas Yojana",
    nameHindi: "प्रधानमंत्री आवास योजना",
    category: "housing",
    description: "Affordable housing scheme providing financial assistance for construction or purchase of houses.",
    ministry: "Ministry of Housing and Urban Affairs",
    benefits: [
      "Subsidy of up to ₹2.67 lakh on home loans",
      "Interest subsidy on housing loans",
      "Support for new construction and renovation"
    ],
    eligibilityCriteria: [
      {
        id: "pmay-1",
        field: "annualIncome",
        operator: "lessThan",
        value: 1800000,
        description: "Annual family income should be less than ₹18 lakh"
      },
      {
        id: "pmay-2",
        field: "category",
        operator: "equals",
        value: "ews",
        description: "Should belong to EWS/LIG/MIG category"
      }
    ],
    requiredDocuments: ["Aadhaar Card", "Income Certificate", "Property Documents"],
    iconName: "Home"
  },
  {
    id: "pm-ujjwala",
    name: "PM Ujjwala Yojana",
    nameHindi: "प्रधानमंत्री उज्ज्वला योजना",
    category: "women_child",
    description: "Free LPG connections to women from BPL households to promote clean cooking fuel.",
    ministry: "Ministry of Petroleum and Natural Gas",
    benefits: [
      "Free LPG connection",
      "First refill and stove free",
      "₹200 subsidy per cylinder"
    ],
    eligibilityCriteria: [
      {
        id: "pmu-1",
        field: "gender",
        operator: "equals",
        value: "female",
        description: "Applicant must be female"
      },
      {
        id: "pmu-2",
        field: "hasBPLCard",
        operator: "equals",
        value: true,
        description: "Must have BPL card"
      }
    ],
    requiredDocuments: ["Aadhaar Card", "BPL Card", "Bank Passbook", "Passport Photo"],
    iconName: "Flame"
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat",
    nameHindi: "आयुष्मान भारत",
    category: "healthcare",
    description: "Health insurance of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
    ministry: "Ministry of Health and Family Welfare",
    benefits: [
      "₹5 lakh health coverage per year",
      "Cashless treatment at empaneled hospitals",
      "Coverage for pre and post hospitalization"
    ],
    eligibilityCriteria: [
      {
        id: "ab-1",
        field: "hasBPLCard",
        operator: "equals",
        value: true,
        description: "Must be from socio-economically vulnerable section"
      },
      {
        id: "ab-2",
        field: "annualIncome",
        operator: "lessThan",
        value: 500000,
        description: "Annual income should be less than ₹5 lakh"
      }
    ],
    requiredDocuments: ["Aadhaar Card", "Ration Card", "Income Certificate"],
    iconName: "HeartPulse"
  },
  {
    id: "pm-scholarship",
    name: "PM Scholarship Scheme",
    nameHindi: "प्रधानमंत्री छात्रवृत्ति योजना",
    category: "education",
    description: "Scholarship for wards of ex-servicemen and ex-coast guard personnel for professional courses.",
    ministry: "Ministry of Defence",
    benefits: [
      "₹3,000 per month for boys",
      "₹3,600 per month for girls",
      "Duration: 1-5 years based on course"
    ],
    eligibilityCriteria: [
      {
        id: "pms-1",
        field: "age",
        operator: "between",
        value: [18, 25] as [number, number],
        description: "Age should be between 18-25 years"
      },
      {
        id: "pms-2",
        field: "education",
        operator: "equals",
        value: "graduate",
        description: "Must have passed 12th or be pursuing graduation"
      }
    ],
    requiredDocuments: ["Aadhaar Card", "PPO/Discharge Certificate", "Educational Certificates"],
    iconName: "GraduationCap"
  },
  {
    id: "widow-pension",
    name: "Widow Pension Scheme",
    nameHindi: "विधवा पेंशन योजना",
    category: "pension",
    description: "Monthly pension support for widows to ensure financial security.",
    ministry: "Ministry of Women and Child Development",
    benefits: [
      "₹500-₹1,500 monthly pension (varies by state)",
      "Direct transfer to bank account",
      "Additional support for elderly widows"
    ],
    eligibilityCriteria: [
      {
        id: "wp-1",
        field: "isWidow",
        operator: "equals",
        value: true,
        description: "Applicant must be a widow"
      },
      {
        id: "wp-2",
        field: "annualIncome",
        operator: "lessThan",
        value: 200000,
        description: "Annual income should be less than ₹2 lakh"
      }
    ],
    requiredDocuments: ["Aadhaar Card", "Death Certificate of Husband", "Income Certificate"],
    iconName: "HandHeart"
  }
];

export const schemeCategories = {
  education: { label: "Education", icon: "GraduationCap", color: "hsl(221 83% 35%)" },
  healthcare: { label: "Healthcare", icon: "HeartPulse", color: "hsl(142 71% 35%)" },
  agriculture: { label: "Agriculture", icon: "Wheat", color: "hsl(28 89% 52%)" },
  housing: { label: "Housing", icon: "Home", color: "hsl(262 83% 58%)" },
  employment: { label: "Employment", icon: "Briefcase", color: "hsl(199 89% 48%)" },
  women_child: { label: "Women & Child", icon: "Users", color: "hsl(330 81% 60%)" },
  pension: { label: "Pension", icon: "Wallet", color: "hsl(38 92% 50%)" },
  financial: { label: "Financial Aid", icon: "IndianRupee", color: "hsl(142 76% 36%)" }
};
