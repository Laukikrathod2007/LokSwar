# **LokSwar – AI Assistant for Indian Farmers**

**Tagline:** *“Understand government schemes in your own language”*  

---

## **Table of Contents**

1. [Project Overview](#project-overview)  
2. [Problem Statement](#problem-statement)  
3. [Solution Overview](#solution-overview)  
4. [Features](#features)  
5. [Technology Stack](#technology-stack)  
6. [GenAI Integration](#genai-integration)  
7. [User Flow & Screenshots](#user-flow--screenshots)  
8. [Setup & Deployment](#setup--deployment)  
9. [Future Improvements](#future-improvements)  
10. [Team](#team)  
11. [Links](#links)  
12. [Disclaimer](#disclaimer)  

---

## **Project Overview**

**LokSwar** is a **production-ready web application** designed to help Indian farmers understand and access government welfare schemes. It combines **rule-based eligibility checks** with **GenAI-powered explanations**, multilingual support, and voice interaction, providing an official, trustworthy experience for rural users.  

---

## **Problem Statement**

Millions of Indian farmers cannot easily understand or access government schemes due to:  

- Complex eligibility rules  
- Language barriers  
- Scattered and confusing portals  
- Low digital literacy, especially in rural areas  

Existing solutions are often English-centric and text-heavy, making adoption difficult.  

---

## **Solution Overview**

**LokSwar** provides:  

- A **step-by-step eligibility workflow**  
- **Voice-first interaction** with regional language support  
- **Personalized AI explanations** using GPT-4o  
- **Optional document upload** for AI simplification  
- **Professional, official-style UI** suitable for rural users  

**Core principle:** Eligibility decisions are deterministic, but GenAI is mandatory for explanation, accessibility, and voice interaction.  

---

## **Features**

- **Landing / Onboarding Page**  
  - Logo, tagline, Start with Voice / Type instead  
  - Smooth animations and mobile-first layout  

- **Language Selection**  
  - English, Hindi, Telugu, Tamil  
  - Persisted across sessions  

- **Farmer Profile Form**  
  - Name, Age, State, District, Landholding, Category  
  - Validation + step progress  

- **Scheme Selection & Eligibility Workflow**  
  - Multi-step evaluation: Scheme selected → Profile validation → Rule evaluation → AI explanation → Final result  
  - Professional card design with expandable explanations  

- **GenAI Integration**  
  - GPT-4o for personalized, multilingual explanations  
  - Whisper for regional language voice input  

- **Optional Document Upload**  
  - Upload PDFs/images → AI simplifies and explains  

- **Responsive & Accessible UI**  
  - Mobile-friendly, touch-enabled, readable typography  

- **Data Persistence**  
  - Stores language selection and profile locally  

---

## **Technology Stack**

- **Frontend:** React + Next.js + Tailwind CSS + shadcn/ui  
- **AI Integration:** OpenAI GPT-4o, Whisper  
- **Storage:** Browser local/session storage  
- **Deployment:** Vercel  

---

## **GenAI Integration**

- **Mandatory Core Layer:**  
  - Generates personalized, multilingual explanations  
  - Converts voice input to text and intent  
  - Simplifies uploaded documents  

- **Rule Engine + AI:**  
  - Deterministic eligibility check  
  - AI explanation only activates after rules are evaluated  

- **Visibility:**  
  - Users see messages like *“Generating explanation based on government rules…”*  
  - If GenAI fails, final result cannot proceed  

---

## **User Flow & Screenshots**

1. Landing / Onboarding → Select Language  
2. Profile Form → Fill Farmer Details  
3. Scheme Selection → Begin Eligibility Assessment  
4. Rule Evaluation → Progress indicators  
5. AI Explanation → Personalized multilingual output  
6. Final Result → Eligibility status + next steps  

*Include screenshots or GIFs here for each step.*  

---

## **Setup & Deployment**

### **Requirements**

- Node.js ≥ 18  
- NPM or Yarn  
- OpenAI API Key  

### **Local Setup**

```bash
git clone https://github.com/your-team/lokswar.git
cd lokswar
npm install
cp .env.example .env
# Add your OpenAI API Key:
# OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
npm run dev
