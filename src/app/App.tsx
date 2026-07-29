import { useState, useEffect, useRef, useCallback, CSSProperties, ReactNode, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { useLang, Lang } from "./LangContext";
import {
  Menu, X, Phone, MapPin, MessageCircle, ChevronLeft, ChevronRight,
  Brain, Bone, Dumbbell, Heart, Baby, PersonStanding,
  Activity, Zap, Footprints, Map, Shield, CheckCircle2,
  AlignLeft, ArrowRight, Star, ArrowUpRight, Instagram, Facebook,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import imgGarvit from "@/imports/Garvit_Vijay.jpeg";
import imgVinay from "@/imports/image-2.png";
import imgGarima from "@/imports/image-1.png";
import logoSrc from "@/imports/thumbnail.png";
import imgPostSurgery from "@/imports/post-surgery-rehabilitation.png";

// ─── Types & Constants ────────────────────────────────────────────────────────
type Page = "home" | "about" | "services" | "team" | "contact"; // kept for nav label mapping

const WHATSAPP = "https://wa.me/919649579679";
const CALL1 = "tel:+919649579679";
const CALL2 = "tel:+919649579679";
const MAPS = "https://maps.google.com/?q=Plot+D-23+Shreenath+Puram+Stadium+Kota+Rajasthan";
const INSTAGRAM = "https://www.instagram.com/santosh_healix?igsh=bTRya29hZDBwdXNi";
const FACEBOOK = "https://www.facebook.com/profile.php?id=61551608922026";

// ─── Design tokens (used inline for dynamic values) ───────────────────────────
const C = {
  hero: "#0F2550",
  blue: "#1A3D7C",
  green: "#1A3D7C",
  aqua: "#E4B832",
  gold: "#C98B0A",
  white: "#FDFCF9",
  mint: "#F5F0E8",
  text: "#0F1B2D",
  sub: "#5A6272",
  border: "#E2DAD0",
  wa: "#148B57",
};

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(18px)",
      transition: `opacity 0.55s ease-out ${delay}ms, transform 0.55s ease-out ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function InstagramLiveFeed({ lang }: { lang: Lang }) {
  useEffect(() => {
    const processEmbed = () => (window as any).instgrm?.Embeds?.process();
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.instagram.com/embed.js"]');

    if (existing) {
      processEmbed();
      existing.addEventListener("load", processEmbed, { once: true });
      return () => existing.removeEventListener("load", processEmbed);
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = processEmbed;
    document.body.appendChild(script);
    return () => { script.onload = null; };
  }, []);

  return (
    <div style={{ width: "100%", height: "clamp(320px, 42svh, 420px)", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink="https://www.instagram.com/santosh_healix/"
        data-instgrm-version="14"
        style={{ background: "#fff", border: 0, borderRadius: 24, boxShadow: "0 18px 52px rgba(15,37,80,0.14)", margin: "0 auto", maxWidth: 720, minWidth: 326, padding: 0, width: "calc(100% - 2px)" }}>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={`flex min-h-[320px] items-center justify-center gap-2 text-base font-bold ${sans(lang)}`} style={{ color: "#C13584" }}>
          <Instagram className="w-5 h-5" />
          {lang === "en" ? "Loading @santosh_healix…" : "@santosh_healix लोड हो रहा है…"}
        </a>
      </blockquote>
    </div>
  );
}
function FacebookLiveFeed({ lang }: { lang: Lang }) {
  const pluginUrl = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK)}&tabs=timeline&width=500&height=420&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;
  return (
    <div style={{ width: "100%", height: "clamp(320px, 42svh, 420px)", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <iframe
        title="Santosh Healix Facebook feed"
        src={pluginUrl}
        width="500"
        height="420"
        style={{ border: "none", overflow: "hidden", width: "100%", height: "clamp(320px, 42svh, 420px)", maxWidth: 500, borderRadius: 18, background: "#fff" }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
      </iframe>
      <noscript>
        <a href={FACEBOOK} target="_blank" rel="noopener noreferrer">{lang === "en" ? "View Santosh Healix on Facebook" : "फेसबुक पर संतोष हीलिक्स देखें"}</a>
      </noscript>
    </div>
  );
}
// ─── Content ─────────────────────────────────────────────────────────────────
const t = {
  en: {
    clinicName: "Santosh Healix",
    tagline: "Your Recovery, Our Mission",
    nav: { home: "Home", about: "About", services: "Services", team: "Team", contact: "Contact" },
    whatsapp: "WhatsApp Us", callNow: "Call Now", getDirections: "Get Directions",
    callClinic: "Call Clinic", discussNeeds: "Discuss Your Needs",
    viewAll: "View All Services", meetTeam: "Meet Our Team",
    hero: {
      pill: "SHREENATH PURAM · KOTA",
      line1: "Restore", line2: "Movement.", line3: "Rebuild Confidence.", line4: "Return to Life.",
      body: "Personalized, evidence-informed rehabilitation to help you restore function, rebuild confidence, and return to everyday life.",
      cta1: "WhatsApp Dr. Garvit", cta2: "Explore Services",
      trust: ["Personalized Care", "Evidence-Informed Approach", "Guided Rehabilitation"],
      floatCard: "Neuro & Rehabilitation Care",
    },
    trustStrip: ["Evidence-Informed Treatment", "Personalized Care", "Patient Education", "Compassionate Team"],
    servicesLabel: "What We Treat", servicesHead: "Our Services",
    servicesNote: "Every rehabilitation plan begins with an individual clinical assessment.",
    journeyLabel: "How It Works", journeyHead: "Your Recovery Journey",
    journeySteps: [
      { n: "01", title: "Clinical Assessment", body: "A thorough one-on-one evaluation of your condition, medical history, and functional goals." },
      { n: "02", title: "Personalized Plan", body: "A structured rehabilitation programme designed around your specific needs and recovery timeline." },
      { n: "03", title: "Guided Rehabilitation", body: "Hands-on therapy sessions with ongoing guidance to build strength, mobility, and confidence." },
      { n: "04", title: "Progress Review", body: "Regular reassessment to track your recovery and adjust the plan as you improve." },
      { n: "05", title: "Home Exercise Support", body: "Simple exercises and practical advice to help you continue making progress between clinic sessions." },
      { n: "06", title: "Long-Term Prevention", body: "Movement strategies and education to maintain results, reduce recurrence risk, and support confident activity." },
    ],
    teamLabel: "Your Clinicians", teamHead: "Our Specialist Team",
    locationLabel: "Location", locationHead: "Find Us in Kota",
    address: "Plot No. D-23, In Front of Shreenath Puram Stadium,\nNear Varshney Children Hospital,\nKota, Rajasthan, India",
    ctaHead: "Take the Next Step\nin Your Recovery",
    ctaBody: "Reach out to schedule an individual clinical assessment.",
    callBtn: "Call +91 96495 79679",
    aboutHead: "About Santosh Healix",
    aboutSub: "A dedicated physiotherapy and rehabilitation centre committed to evidence-informed, patient-centred care in Kota.",
    missionHead: "Our Mission",
    missionBody: "At Santosh Healix, our mission is to provide accessible, evidence-informed rehabilitation that empowers every patient to restore function, regain independence, and live with confidence.",
    philHead: "Patient-First Philosophy",
    philBody: "We believe effective rehabilitation begins with truly listening to each patient. Every treatment plan is built around the individual — their goals, their lifestyle, and their pace of recovery.",
    valuesHead: "Our Values",
    values: [
      { title: "Evidence-Informed Care", body: "Clinical decisions grounded in current research and best practice." },
      { title: "Personalized Rehabilitation", body: "Individual assessment and a tailored treatment plan for every patient." },
      { title: "Safe & Effective Treatment", body: "Your safety is our priority at every stage of recovery." },
      { title: "Patient Education", body: "We explain what is happening and what to expect at every step." },
      { title: "Compassionate Support", body: "A supportive, respectful environment for every patient and family." },
      { title: "Collaborative Care", body: "We work with orthopaedic specialists for coordinated rehabilitation." },
    ],
    approachHead: "Our Approach",
    approachBody: "We combine hands-on physiotherapy with therapeutic exercise and patient education. Each session builds on the last, progressively restoring function and reducing pain.",
    svcPageHead: "Our Services",
    svcPageSub: "A comprehensive range of physiotherapy and rehabilitation services tailored to each patient's individual needs.",
    allServices: [
      { icon: "brain", name: "Neuro Rehabilitation", body: "Rehabilitation for conditions affecting the brain and nervous system.", goals: "Restore movement control, improve balance, reduce spasticity, regain independence." },
      { icon: "bone", name: "Orthopedic Rehabilitation", body: "Physiotherapy for musculoskeletal injuries and conditions.", goals: "Reduce pain, restore joint mobility, rebuild strength." },
      { icon: "dumbbell", name: "Sports Injury Rehabilitation", body: "Structured rehabilitation for athletes recovering from sports-related injuries.", goals: "Return to sport safely, restore performance, prevent re-injury." },
      { icon: "heart", name: "Geriatric Rehabilitation", body: "Physiotherapy to maintain mobility, strength, and independence in older adults.", goals: "Improve balance, reduce fall risk, maintain daily function." },
      { icon: "person", name: "Women's Health Physiotherapy", body: "Specialist physiotherapy addressing conditions specific to women.", goals: "Manage musculoskeletal discomfort, restore function." },
      { icon: "baby", name: "Pediatric & CP Rehabilitation", body: "Physiotherapy for children with developmental or neurological conditions.", goals: "Support motor development and daily participation." },
      { icon: "activity", name: "Stroke Rehabilitation", body: "Focused rehabilitation addressing motor, balance, and functional impairments after stroke.", goals: "Maximize movement recovery, promote independence." },
      { icon: "align", name: "Spine & Back Pain", body: "Evidence-based physiotherapy for acute and chronic spine conditions.", goals: "Reduce pain, restore spinal mobility, prevent recurrence." },
      { icon: "zap", name: "Post-Fracture & Post-Surgery Rehab.", body: "Rehabilitation following bone fractures or orthopaedic/neurological surgery.", goals: "Recover range of motion, rebuild strength, promote safe healing." },
      { icon: "footprints", name: "Balance & Gait Training", body: "Targeted training to improve walking patterns and reduce fall risk.", goals: "Improve stability, restore confident mobility." },
    ],
    teamPageHead: "Our Specialist Team",
    teamPageSub: "Meet the clinicians who guide your rehabilitation at Santosh Healix.",
    teamPhysio: "Physiotherapy Team",
    teamOrtho: "Associated Specialist",
    teamOrthoNote: "Dr. Vinay Gwalani is an associated orthopaedic specialist. Orthopaedic consultation is a separate clinical service from physiotherapy and rehabilitation.",
    doctors: [
      { name: "Dr. Garvit Vijay", suffix: "(PT)", role: "Head of Physiotherapy", quals: "MPT (Neuro) · M.I.A.P.", affil: "Head of Physiotherapy Dept., Ethos Hospital, Kota", contact: "+91 96495 79679", bio: "Dr. Garvit Vijay leads physiotherapy and rehabilitation at Santosh Healix, with specialist expertise in neurological rehabilitation.", isPrimary: true },
      { name: "Dr. Garima Sambhwani", suffix: "(PT)", role: "Consultant Physiotherapist", quals: "Physiotherapist", affil: "Consultant Physiotherapist, Ethos Hospital, Kota", contact: "+91 96495 79679", bio: "Dr. Garima Sambhwani is a consultant physiotherapist providing specialist rehabilitation care at Santosh Healix.", isPrimary: false },
    ],
    ortho: { name: "Dr. Vinay Gwalani", role: "Associated Orthopaedic Specialist", quals: "MBBS · D-Ortho · DNB (Orthopaedics)", bio: "Dr. Vinay Gwalani is an associated orthopaedic specialist supporting the clinical team with orthopaedic assessment and consultation." },
    contactHead: "Contact Us",
    contactSub: "Reach our team by phone or WhatsApp to discuss your rehabilitation needs.",
    emergency: "For medical emergencies, please contact local emergency services. WhatsApp enquiries are not monitored as an emergency service.",
  },
  hi: {
    clinicName: "संतोष हीलिक्स",
    tagline: "आपकी रिकवरी, हमारा मिशन",
    nav: { home: "होम", about: "हमारे बारे में", services: "सेवाएँ", team: "हमारी टीम", contact: "संपर्क करें" },
    whatsapp: "व्हाट्सऐप करें", callNow: "अभी कॉल करें", getDirections: "रास्ता देखें",
    callClinic: "क्लिनिक को कॉल करें", discussNeeds: "अपनी जरूरत बताएँ",
    viewAll: "सभी सेवाएँ देखें", meetTeam: "हमारी टीम से मिलें",
    hero: {
      pill: "श्रीनाथ पुरम · कोटा",
      line1: "गतिशीलता", line2: "बहाल करें।", line3: "आत्मविश्वास पुनः पाएँ।", line4: "जीवन में वापस आएँ।",
      body: "व्यक्तिगत, प्रमाण-आधारित पुनर्वास जो आपको कार्यक्षमता बहाल करने, आत्मविश्वास पुनः प्राप्त करने और रोजमर्रा की जिंदगी में वापस आने में मदद करता है।",
      cta1: "डॉ. गर्वित को व्हाट्सऐप करें", cta2: "सेवाएँ देखें",
      trust: ["व्यक्तिगत देखभाल", "प्रमाण-आधारित दृष्टिकोण", "निर्देशित पुनर्वास"],
      floatCard: "न्यूरो और पुनर्वास देखभाल",
    },
    trustStrip: ["प्रमाण-आधारित उपचार", "व्यक्तिगत देखभाल", "रोगी शिक्षा", "दयालु टीम"],
    servicesLabel: "हम क्या उपचार करते हैं", servicesHead: "हमारी सेवाएँ",
    servicesNote: "हर पुनर्वास योजना व्यक्तिगत नैदानिक मूल्यांकन से शुरू होती है।",
    journeyLabel: "यह कैसे काम करता है", journeyHead: "आपकी रिकवरी की यात्रा",
    journeySteps: [
      { n: "01", title: "नैदानिक मूल्यांकन", body: "आपकी स्थिति, चिकित्सा इतिहास और लक्ष्यों का विस्तृत मूल्यांकन।" },
      { n: "02", title: "व्यक्तिगत योजना", body: "आपकी विशेष जरूरतों के अनुसार तैयार पुनर्वास कार्यक्रम।" },
      { n: "03", title: "निर्देशित पुनर्वास", body: "ताकत, गतिशीलता और आत्मविश्वास बढ़ाने वाले थेरेपी सत्र।" },
      { n: "04", title: "प्रगति समीक्षा", body: "नियमित जाँच और आवश्यक सुधार।" },
      { n: "05", title: "घर पर व्यायाम सहायता", body: "क्लिनिक सत्रों के बीच प्रगति जारी रखने के लिए सरल व्यायाम और व्यावहारिक मार्गदर्शन।" },
      { n: "06", title: "दीर्घकालिक रोकथाम", body: "परिणाम बनाए रखने, दोबारा समस्या का जोखिम कम करने और आत्मविश्वासपूर्ण गतिविधि के लिए मार्गदर्शन।" },
    ],
    teamLabel: "आपके चिकित्सक", teamHead: "हमारी विशेषज्ञ टीम",
    locationLabel: "स्थान", locationHead: "हमें खोजें",
    address: "प्लॉट नं. D-23, श्रीनाथ पुरम स्टेडियम के सामने,\nवार्ष्णेय चिल्ड्रन हॉस्पिटल के पास,\nकोटा, राजस्थान, भारत",
    ctaHead: "अपनी रिकवरी की ओर\nअगला कदम बढ़ाएँ",
    ctaBody: "हमारी टीम के साथ व्यक्तिगत नैदानिक मूल्यांकन के लिए संपर्क करें।",
    callBtn: "कॉल करें +91 96495 79679",
    aboutHead: "संतोष हीलिक्स के बारे में",
    aboutSub: "कोटा में प्रमाण-आधारित, रोगी-केंद्रित देखभाल के लिए समर्पित केंद्र।",
    missionHead: "हमारा मिशन",
    missionBody: "संतोष हीलिक्स में हमारा मिशन है सुलभ, प्रमाण-आधारित पुनर्वास प्रदान करना जो हर मरीज को कार्यक्षमता बहाल करने और आत्मविश्वास से जीने में सक्षम बनाए।",
    philHead: "रोगी-प्रथम दर्शन",
    philBody: "हम मानते हैं कि प्रभावी पुनर्वास की शुरुआत हर मरीज की बात सुनने से होती है। हर उपचार योजना व्यक्ति के इर्द-गिर्द बनाई जाती है।",
    valuesHead: "हमारे मूल्य",
    values: [
      { title: "प्रमाण-आधारित देखभाल", body: "वर्तमान शोध और सर्वोत्तम अभ्यास पर आधारित नैदानिक निर्णय।" },
      { title: "व्यक्तिगत पुनर्वास", body: "हर मरीज के लिए व्यक्तिगत मूल्यांकन और उपचार योजना।" },
      { title: "सुरक्षित उपचार", body: "हर सत्र में आपकी सुरक्षा हमारी प्राथमिकता है।" },
      { title: "रोगी शिक्षा", body: "हम हर कदम पर स्पष्टता से बताते हैं।" },
      { title: "दयालु सहयोग", body: "हर मरीज और परिवार के लिए सहायक, सम्मानजनक वातावरण।" },
      { title: "सहयोगी देखभाल", body: "समन्वित पुनर्वास के लिए विशेषज्ञों के साथ मिलकर काम।" },
    ],
    approachHead: "हमारा दृष्टिकोण",
    approachBody: "हम व्यावहारिक फिजियोथेरेपी तकनीकों को चिकित्सीय व्यायाम और रोगी शिक्षा के साथ जोड़ते हैं।",
    svcPageHead: "हमारी सेवाएँ",
    svcPageSub: "हर मरीज की व्यक्तिगत जरूरतों के अनुसार फिजियोथेरेपी और पुनर्वास सेवाओं की व्यापक श्रृंखला।",
    allServices: [
      { icon: "brain", name: "न्यूरो पुनर्वास", body: "मस्तिष्क और तंत्रिका तंत्र की स्थितियों के लिए पुनर्वास।", goals: "गति नियंत्रण बहाल करें, संतुलन सुधारें।" },
      { icon: "bone", name: "आर्थोपेडिक पुनर्वास", body: "हड्डियों और जोड़ों की चोटों के लिए फिजियोथेरेपी।", goals: "दर्द कम करें, गतिशीलता बहाल करें।" },
      { icon: "dumbbell", name: "खेल चोट पुनर्वास", body: "एथलीटों के लिए संरचित पुनर्वास।", goals: "सुरक्षित रूप से खेल में वापसी।" },
      { icon: "heart", name: "वृद्धावस्था पुनर्वास", body: "वृद्ध वयस्कों के लिए फिजियोथेरेपी।", goals: "संतुलन सुधारें, गिरने का जोखिम कम करें।" },
      { icon: "person", name: "महिला स्वास्थ्य फिजियोथेरेपी", body: "महिलाओं के लिए विशेष फिजियोथेरेपी।", goals: "कार्यक्षमता बहाल करें।" },
      { icon: "baby", name: "बाल एवं CP पुनर्वास", body: "विकासात्मक स्थितियों वाले बच्चों के लिए फिजियोथेरेपी।", goals: "मोटर विकास में सहायता।" },
      { icon: "activity", name: "स्ट्रोक पुनर्वास", body: "स्ट्रोक से उबरने वाले मरीजों के लिए पुनर्वास।", goals: "गति की अधिकतम रिकवरी।" },
      { icon: "align", name: "रीढ़ और पीठ दर्द", body: "रीढ़ की स्थितियों के लिए फिजियोथेरेपी।", goals: "दर्द कम करें, मुद्रा सुधारें।" },
      { icon: "zap", name: "पोस्ट-फ्रैक्चर और पोस्ट-सर्जरी पुनर्वास", body: "फ्रैक्चर या सर्जरी के बाद पुनर्वास।", goals: "गति की सीमा पुनः प्राप्त करें, सुरक्षित उपचार को बढ़ावा दें।" },
      { icon: "footprints", name: "संतुलन और चाल प्रशिक्षण", body: "चलने के पैटर्न में सुधार के लिए प्रशिक्षण।", goals: "स्थिरता सुधारें।" },
    ],
    teamPageHead: "हमारी विशेषज्ञ टीम",
    teamPageSub: "संतोष हीलिक्स में आपके पुनर्वास का मार्गदर्शन करने वाले विशेषज्ञों से मिलें।",
    teamPhysio: "फिजियोथेरेपी टीम",
    teamOrtho: "संबद्ध विशेषज्ञ",
    teamOrthoNote: "डॉ. विनय गोवलानी एक संबद्ध आर्थोपेडिक विशेषज्ञ हैं। आर्थोपेडिक परामर्श फिजियोथेरेपी से अलग सेवा है।",
    doctors: [
      { name: "डॉ. गर्वित विजय", suffix: "(PT)", role: "फिजियोथेरेपी प्रमुख", quals: "MPT (Neuro) · M.I.A.P.", affil: "फिजियोथेरेपी विभाग प्रमुख, एथॉस हॉस्पिटल, कोटा", contact: "+91 96495 79679", bio: "डॉ. गर्वित विजय संतोष हीलिक्स में फिजियोथेरेपी सेवाओं का नेतृत्व करते हैं, न्यूरोलॉजिकल पुनर्वास में विशेष विशेषज्ञता के साथ।", isPrimary: true },
      { name: "डॉ. गरिमा संभवानी", suffix: "(PT)", role: "परामर्श फिजियोथेरेपिस्ट", quals: "फिजियोथेरेपिस्ट", affil: "परामर्श फिजियोथेरेपिस्ट, एथॉस हॉस्पिटल, कोटा", contact: "+91 96495 79679", bio: "डॉ. गरिमा संभवानी संतोष हीलिक्स में विशेषज्ञ पुनर्वास देखभाल प्रदान करती हैं।", isPrimary: false },
    ],
    ortho: { name: "डॉ. विनय गोवलानी", role: "संबद्ध आर्थोपेडिक विशेषज्ञ", quals: "MBBS · D-Ortho · DNB (Orthopaedics)", bio: "डॉ. विनय गोवलानी नैदानिक टीम का समर्थन करने वाले संबद्ध आर्थोपेडिक विशेषज्ञ हैं।" },
    contactHead: "संपर्क करें",
    contactSub: "अपनी पुनर्वास जरूरतों पर चर्चा करने के लिए हमसे संपर्क करें।",
    emergency: "चिकित्सा आपातकाल के लिए कृपया स्थानीय आपातकालीन सेवाओं से संपर्क करें। व्हाट्सऐप पूछताछ आपातकालीन सेवा नहीं है।",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const serif = (lang: Lang) =>
  lang === "hi" ? "font-['Noto_Serif_Devanagari',serif]" : "font-['Fraunces',serif]";
export const sans = (lang: Lang) =>
  lang === "hi" ? "font-['Noto_Sans_Devanagari',sans-serif]" : "font-['Outfit',sans-serif]";

const SvcIcon = ({ icon, cls = "w-5 h-5" }: { icon: string; cls?: string }) => {
  switch (icon) {
    case "brain": return <Brain className={cls} />;
    case "bone": return <Bone className={cls} />;
    case "dumbbell": return <Dumbbell className={cls} />;
    case "heart": return <Heart className={cls} />;
    case "person": return <PersonStanding className={cls} />;
    case "baby": return <Baby className={cls} />;
    case "activity": return <Activity className={cls} />;
    case "align": return <AlignLeft className={cls} />;
    case "zap": return <Zap className={cls} />;
    case "footprints": return <Footprints className={cls} />;
    default: return <Activity className={cls} />;
  }
};

function Eyebrow({ children, light = false, lang }: { children: string; light?: boolean; lang: Lang }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.18em] mb-4 ${sans(lang)}`}
      style={{ color: light ? C.aqua : C.gold }}>
      {children}
    </p>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function PageHero({ lang, label, title, subtitle, image }: {
  lang: Lang;
  label: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <section style={{ background: C.hero, paddingTop: 100, position: "relative", overflow: "hidden" }}>
      <img src={image} alt="" aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.14 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,37,80,0.28) 0%, rgba(15,37,80,0.08) 62%, rgba(15,37,80,0.2) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 py-16 lg:py-20 relative">
        <Eyebrow light lang={lang}>{label}</Eyebrow>
        <h1 className={`${serif(lang)} text-white max-w-2xl`} style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, lineHeight: 1.08, marginBottom: 20 }}>
          {title}
        </h1>
        <p className={`text-white/65 text-lg max-w-xl leading-relaxed ${sans(lang)}`}>{subtitle}</p>
      </div>
      <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
        <path d="M0 40L1440 40L1440 20C1200 40 900 0 600 14C300 28 120 8 0 20Z" fill={C.white} />
      </svg>
    </section>
  );
}
export function Header({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const c = t[lang];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (path: string) => { navigate(path); setOpen(false); };

  const navItems = [
    { path: "/",         label: c.nav.home },
    { path: "/about",    label: c.nav.about },
    { path: "/services", label: c.nav.services },
    { path: "/team",     label: c.nav.team },
    { path: "/contact",  label: c.nav.contact },
  ];

  const isActive = (path: string) => path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: "#fff",
      boxShadow: scrolled ? "0 1px 16px 0 rgba(16,42,54,0.09)" : "0 1px 0 0 #DCE7E3",
      transition: "box-shadow 250ms ease, height 200ms ease",
    }}>
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? 80 : 100, transition: "height 200ms ease" }}>
          {/* Logo */}
          <button onClick={() => go("/")} className="flex items-center gap-2 shrink-0">
            <img src={logoSrc} alt="Santosh Healix logo" style={{ height: 82, width: "auto", display: "block" }} />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <button key={item.path} onClick={() => go(item.path)}
                className={`relative px-5 py-2.5 text-base rounded-full font-medium transition-all duration-200 ${sans(lang)}`}
                style={{
                  color: isActive(item.path) ? C.hero : C.sub,
                  background: isActive(item.path) ? C.mint : "transparent",
                  fontWeight: isActive(item.path) ? 600 : 500,
                }}>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${sans(lang)}`}
              style={{ border: `1.5px solid ${C.border}`, color: C.sub }}
              onMouseOver={e => (e.currentTarget.style.borderColor = C.green)}
              onMouseOut={e => (e.currentTarget.style.borderColor = C.border)}>
              {lang === "en" ? "हिन्दी" : "English"}
            </button>
            <a href={CALL1} className={`flex items-center gap-2.5 px-5 py-2.5 text-base font-semibold rounded-xl transition-all ${sans(lang)}`}
              style={{ border: `1.5px solid ${C.border}`, color: C.text }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.hero; e.currentTarget.style.color = C.hero; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
              <Phone className="w-4 h-4" /> +91 96495 79679
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-2.5 px-6 py-3 text-base font-bold rounded-xl text-white transition-all ${sans(lang)}`}
              style={{ background: C.wa, boxShadow: "0 2px 8px 0 rgba(20,139,87,0.18)" }}
              onMouseOver={e => { e.currentTarget.style.background = "#116340"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = C.wa; e.currentTarget.style.transform = "translateY(0)"; }}>
              <MessageCircle className="w-4.5 h-4.5" /> {c.whatsapp}
            </a>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${sans(lang)}`}
              style={{ border: `1.5px solid ${C.border}`, color: C.sub }}>
              {lang === "en" ? "हिन्दी" : "EN"}
            </button>
            <button onClick={() => setOpen(!open)} className="p-2 rounded-lg" style={{ color: C.text }}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div style={{
        overflow: "hidden", maxHeight: open ? 400 : 0,
        transition: "max-height 280ms cubic-bezier(0.4,0,0.2,1)",
        background: "#fff", borderTop: `1px solid ${C.border}`,
      }}>
        <nav className="px-4 py-3 space-y-1">
          {navItems.map((item, i) => (
            <button key={item.path} onClick={() => go(item.path)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${sans(lang)}`}
              style={{
                opacity: open ? 1 : 0, transform: open ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 240ms ease ${60 + i * 50}ms, transform 240ms ease ${60 + i * 50}ms`,
                background: isActive(item.path) ? C.mint : "transparent",
                color: isActive(item.path) ? C.hero : C.text,
                fontWeight: isActive(item.path) ? 600 : 500,
              }}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ─── Mobile bottom bar ────────────────────────────────────────────────────────
export function MobileBar({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(false);
  const c = t[lang];
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ background: "#fff", borderTop: `1.5px solid ${C.border}`, padding: "8px 12px", display: "flex", gap: 8,
        transform: show ? "translateY(0)" : "translateY(100%)", transition: "transform 300ms ease" }}>
      <a href={CALL1} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold ${sans(lang)}`}
        style={{ background: C.hero }}>
        <Phone className="w-4 h-4" />{c.callNow}
      </a>
      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold ${sans(lang)}`}
        style={{ background: C.wa }}>
        <MessageCircle className="w-4 h-4" />{c.whatsapp}
      </a>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function Footer({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const navigate = useNavigate();
  const c = t[lang];
  const go = (path: string) => navigate(path);
  return (
    <footer style={{ background: "#080F1E", color: "#fff" }}>
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ background: "#fff", borderRadius: 16, padding: "8px 12px", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
                <img src={logoSrc} alt="Santosh Healix logo" style={{ height: 72, width: "auto", display: "block" }} />
              </div>
            </div>
            <p className={`text-white/50 text-sm leading-relaxed mb-5 ${sans(lang)}`}>{c.tagline}</p>
            <button onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg text-white/50 hover:text-white transition-colors ${sans(lang)}`}
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
              {lang === "en" ? "हिन्दी में देखें" : "View in English"}
            </button>
          </div>
          <div>
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 mb-5 ${sans(lang)}`}>
              {lang === "en" ? "Navigation" : "नेविगेशन"}
            </h3>
            <ul className="space-y-3">
              {([["home","/"],["about","/about"],["services","/services"],["team","/team"],["contact","/contact"]] as [Page,string][]).map(([p, path]) => (
                <li key={p}><button onClick={() => go(path)} className={`text-sm text-white/50 hover:text-white transition-colors ${sans(lang)}`}>{c.nav[p]}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 mb-5 ${sans(lang)}`}>
              {lang === "en" ? "Services" : "सेवाएँ"}
            </h3>
            <ul className="space-y-3">
              {(lang === "en"
                ? ["Neuro Rehabilitation", "Orthopaedic Rehab", "Sports Injury", "Geriatric Care", "Women's Health", "Paediatric & CP"]
                : ["न्यूरो पुनर्वास", "आर्थोपेडिक पुनर्वास", "खेल चोट", "वृद्धावस्था", "महिला स्वास्थ्य", "बाल CP"]
              ).map((s) => (
                <li key={s}><button onClick={() => go("/services")} className={`text-sm text-white/50 hover:text-white transition-colors ${sans(lang)}`}>{s}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 mb-5 ${sans(lang)}`}>
              {lang === "en" ? "Contact" : "संपर्क"}
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.aqua }} />
                <p className={`text-sm text-white/50 leading-relaxed ${sans(lang)}`}>
                  {lang === "en" ? "Plot D-23, Shreenath Puram, Kota, Rajasthan" : "प्लॉट D-23, श्रीनाथ पुरम, कोटा"}
                </p>
              </div>
              <a href={CALL1} className={`flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors ${sans(lang)}`}>
                <Phone className="w-4 h-4" style={{ color: C.aqua }} /> +91 96495 79679
              </a>
              <a href={CALL2} className={`flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors ${sans(lang)}`}>
                <Phone className="w-4 h-4" style={{ color: C.aqua }} /> +91 96495 79679
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <p className={`text-xs text-white/25 ${sans(lang)}`}>© 2025 Santosh Healix Physiotherapy & Rehabilitation Center.</p>
            <p className={`text-xs text-white/20 max-w-md leading-relaxed ${sans(lang)}`}>
              {lang === "en"
                ? "This website provides general information only and is not a substitute for professional medical advice."
                : "यह वेबसाइट केवल सामान्य जानकारी प्रदान करती है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Service background images (matched by index to allServices) ──────────────
const SVC_IMGS = [
  "https://images.unsplash.com/photo-1711409645921-ef3db0501f96?w=800&h=600&fit=crop&auto=format", // Neuro
  "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?w=800&h=600&fit=crop&auto=format", // Orthopedic
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&auto=format", // Sports
  "https://images.unsplash.com/photo-1658314755811-73c806249f31?w=800&h=600&fit=crop&auto=format", // Geriatric
  "https://images.unsplash.com/photo-1706353399656-210cca727a33?w=800&h=600&fit=crop&auto=format", // Women's Health
  "https://images.unsplash.com/photo-1708687045030-26702e62fc65?w=800&h=600&fit=crop&auto=format", // Pediatric
  "https://images.unsplash.com/photo-1644648479153-2a3dbee76212?w=800&h=600&fit=crop&auto=format", // Stroke
  "https://images.unsplash.com/photo-1539815208687-a0f05e15d601?w=800&h=600&fit=crop&auto=format", // Spine
  imgPostSurgery, // Post-Surgery
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format", // Balance & Gait
];

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HERO_DOCTORS = [
  { img: imgGarvit, name: "Dr. Garvit Vijay", role: "Head of Physiotherapy" },
  { img: imgGarima, name: "Dr. Garima Sambhwani", role: "Consultant Physiotherapist" },
  { img: imgVinay,  name: "Dr. Vinay Gwalani",   role: "Associated Orthopaedic Specialist" },
];

const HOME_VIEWPORT_SECTION: CSSProperties = {
  minHeight: "calc(100svh - 80px)",
  display: "grid",
  alignItems: "center",
  overflow: "hidden",
};

/* ─── 3-Card Focus Carousel ─── */
function ServiceCarousel({ lang, c }: { lang: Lang; c: typeof t["en"] }) {
  const navigate = useNavigate();
  const go = (path: string) => navigate(path);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const busy = useRef(false);
  const total = c.allServices.length;

  // card slot offset: distance between centers of adjacent cards (px)
  const SLOT = 430;
  // card DOM width (all cards same width, scale changes visual size)
  const CARD_W = 430;
  // active card scale
  const SCALE_ACTIVE = 1;
  const SCALE_SIDE = 0.74;

  const goTo = useCallback((next: number) => {
    if (busy.current) return;
    busy.current = true;
    setActiveIdx((next + total) % total);
    setTimeout(() => { busy.current = false; }, 540);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => goTo(activeIdx + 1), 3800);
    return () => clearInterval(timer);
  }, [activeIdx, paused, goTo]);

  // normalised distance of card i from active (-5..+5 range, wrap-aware)
  const dist = (i: number) => {
    let d = ((i - activeIdx) % total + total) % total;
    if (d > total / 2) d -= total;
    return d;
  };

  const svc = c.allServices[activeIdx];

  return (
    <section
      style={{ minHeight: "calc(100svh - 80px)", background: "linear-gradient(160deg, #09172F 0%, #0A1B3F 55%, #050B1C 100%)", paddingTop: "clamp(32px, 5vh, 52px)", paddingBottom: "clamp(32px, 5vh, 52px)", overflow: "hidden", position: "relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      {/* Smooth visual transition from the hero ribbon into Services */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 130, background: `linear-gradient(180deg, ${C.hero} 0%, rgba(15,37,80,0.58) 34%, rgba(9,23,47,0) 100%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, ${C.aqua}70, ${C.gold}80, transparent)`, boxShadow: `0 0 18px ${C.aqua}35`, pointerEvents: "none" }} />

      {/* Ambient glows */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.aqua}10 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -60, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.gold}16 0%, transparent 65%)`, pointerEvents: "none" }} />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 relative z-10">

        {/* Header */}
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(20px, 3vh, 32px)" }}>
            <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${sans(lang)}`}
              style={{ background: `${C.aqua}22`, color: C.aqua, border: `1px solid ${C.aqua}44` }}>
              {c.servicesLabel}
            </span>
            <h2 className={serif(lang)} style={{ fontSize: "clamp(38px, 4.2vw, 58px)", color: "#fff", fontWeight: 600, lineHeight: 1.1, marginTop: 14 }}>
              {c.servicesHead}
            </h2>
          </div>
        </Reveal>

        {/* ── Stage ── */}
        <div style={{ position: "relative", height: "clamp(500px, 56svh, 520px)", overflow: "visible" }}>
          {c.allServices.map((sv, i) => {
            const d = dist(i);
            const isActive = d === 0;
            const isVisible = Math.abs(d) <= 1;

            const tx = d * SLOT; // horizontal offset from center
            const scale = isActive ? SCALE_ACTIVE : SCALE_SIDE;
            const opacity = isActive ? 1 : isVisible ? 0.72 : 0;
            const zIndex = isActive ? 20 : isVisible ? 10 : 0;

            return (
              <div
                key={i}
                onClick={() => !isActive && goTo(i)}
                style={{
                  position: "absolute",
                  width: `min(${CARD_W}px, calc(100vw - 40px))`,
                  top: 0,
                  bottom: 0,
                  left: "50%",
                  transform: `translateX(calc(-50% + ${tx}px)) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: "transform 520ms cubic-bezier(0.34,1.06,0.64,1), opacity 520ms ease, box-shadow 520ms ease",
                  opacity,
                  zIndex,
                  cursor: isActive ? "default" : "pointer",
                  pointerEvents: isVisible ? "auto" : "none",
                }}>

                {isActive ? (
                  /* ── Active card: image top + white content ── */
                  <div style={{
                    width: "100%", height: "100%",
                    background: "#fff",
                    borderRadius: 28,
                    boxShadow: `0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.06)`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    animation: "svcFloat 3.8s ease-in-out infinite",
                  }}>
                    {/* Image banner — top 42% of card */}
                    <div style={{ position: "relative", height: "42%", flexShrink: 0, overflow: "hidden" }}>
                      <img src={SVC_IMGS[i]} alt={sv.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {/* Dark-to-transparent overlay so bottom of image fades into white card */}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,37,80,0.15) 0%, rgba(255,255,255,0) 70%)" }} />
                      {/* Watermark number */}
                      <div style={{ position: "absolute", top: 10, right: 14, fontFamily: "Fraunces, serif", fontSize: 62, fontWeight: 700, color: "rgba(255,255,255,0.25)", lineHeight: 1, userSelect: "none" }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      {/* Icon badge floats out of bottom edge */}
                      <div style={{ position: "absolute", bottom: -23, left: 26, width: 50, height: 50, borderRadius: 14, background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${C.border}`, zIndex: 2 }}>
                        <SvcIcon icon={sv.icon} cls="w-5 h-5 text-[#1A3D7C]" />
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "28px 26px 22px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                      <h3 title={sv.name} className={`font-bold ${sans(lang)}`} style={{ fontSize: "clamp(17px, 1.6vw, 21px)", color: C.text, lineHeight: 1.2, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{sv.name}</h3>
                      <p className={`${sans(lang)}`} style={{ color: C.sub, fontSize: 13, lineHeight: 1.5, marginBottom: 10, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{sv.body}</p>
                      <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${C.aqua}, ${C.gold})`, borderRadius: 1, marginBottom: 10 }} />
                      <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${sans(lang)}`} style={{ color: C.blue }}>
                        {lang === "en" ? "Treatment Goals" : "उपचार के लक्ष्य"}
                      </p>
                      <p className={`text-xs ${sans(lang)}`} style={{ color: C.sub, lineHeight: 1.45, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{sv.goals}</p>
                      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full self-start transition-all ${sans(lang)}`}
                        style={{ background: C.hero, color: "#fff", textDecoration: "none", boxShadow: `0 4px 14px rgba(15,37,80,0.3)`, flexShrink: 0 }}
                        onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
                        <MessageCircle className="w-3 h-3" />
                        {lang === "en" ? "Book Now" : "अभी बुक करें"}
                      </a>
                    </div>
                  </div>
                ) : (
                  /* ── Side card: image top + dark content ── */
                  <div style={{
                    width: "100%", height: "100%",
                    background: C.hero,
                    borderRadius: 28,
                    border: `1px solid rgba(255,255,255,0.1)`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    {/* Image banner — top 38% */}
                    <div style={{ position: "relative", height: "38%", flexShrink: 0, overflow: "hidden" }}>
                      <img src={SVC_IMGS[i]} alt={sv.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75) saturate(0.8)" }} />
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${C.hero} 100%)` }} />
                    </div>
                    {/* Content */}
                    <div style={{ padding: "18px 26px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.aqua}22`, border: `1px solid ${C.aqua}44`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <SvcIcon icon={sv.icon} cls="w-4.5 h-4.5 text-[#E4B832]" />
                      </div>
                      <h3 className={`font-bold text-white leading-snug mb-1.5 ${sans(lang)}`} style={{ fontSize: 16 }}>{sv.name}</h3>
                      <p className={`text-white/55 leading-relaxed ${sans(lang)}`} style={{ fontSize: 13 }}>{sv.body.slice(0, 70)}{sv.body.length > 70 ? "…" : ""}</p>
                      <div style={{ marginTop: "auto", paddingTop: 12, display: "flex", alignItems: "center", gap: 5, color: C.aqua }}>
                        <span className={`text-xs font-semibold ${sans(lang)}`}>{lang === "en" ? "Tap to view" : "देखें"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => goTo(activeIdx - 1)} aria-label="Previous service"
            style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", zIndex: 40, width: 58, height: 58, borderRadius: "50%", background: "rgba(5,12,30,0.22)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff", opacity: 0.48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 220ms ease, opacity 220ms ease, border-color 220ms ease, box-shadow 220ms ease", backdropFilter: "blur(8px)" }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(5,12,30,0.9)"; e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.42)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.34)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(5,12,30,0.22)"; e.currentTarget.style.opacity = "0.48"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.boxShadow = "none"; }}>
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button onClick={() => goTo(activeIdx + 1)} aria-label="Next service"
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", zIndex: 40, width: 58, height: 58, borderRadius: "50%", background: "rgba(5,12,30,0.22)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff", opacity: 0.48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 220ms ease, opacity 220ms ease, border-color 220ms ease, box-shadow 220ms ease", backdropFilter: "blur(8px)" }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(5,12,30,0.9)"; e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.42)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.34)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(5,12,30,0.22)"; e.currentTarget.style.opacity = "0.48"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.boxShadow = "none"; }}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* ── Controls ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 18 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {c.allServices.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Service ${i + 1}`}
                style={{
                  width: i === activeIdx ? 32 : 8, height: 8, borderRadius: 4, padding: 0, border: "none", cursor: "pointer",
                  background: i === activeIdx ? C.aqua : "rgba(255,255,255,0.22)",
                  transition: "all 340ms cubic-bezier(0.34,1.56,0.64,1)",
                }} />
            ))}
          </div>
        </div>
        {/* View all link */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={() => go("/services")}
            className={`inline-flex items-center gap-2 text-base font-semibold transition-all ${sans(lang)}`}
            style={{ color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer" }}
            onMouseOver={e => { e.currentTarget.style.color = "#fff"; }}
            onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}>
            {c.viewAll} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes svcFloat {
          0%, 100% { margin-top: 0px; }
          50%       { margin-top: -12px; }
        }
      `}</style>
    </section>
  );
}

export function HomePage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const c = t[lang];
  const [loaded, setLoaded] = useState(false);
  const [docIdx, setDocIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setDocIdx(i => (i + 1) % HERO_DOCTORS.length);
        setFading(false);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const go = (path: string) => navigate(path);
  const instagram = lang === "en" ? {
    label: "Our Social Media", head: "Follow Our Latest Updates",
    body: "Connect with Santosh Healix on Instagram and Facebook for physiotherapy guidance, movement education, clinic updates, and practical ideas for a more active life.",
    follow: "Follow @santosh_healix", view: "View on Instagram",
    posts: [
      { image: SVC_IMGS[7], tag: "Back Care", title: "Movement habits that can support a healthier spine", meta: "Educational post" },
      { image: imgGarvit, tag: "Meet the Team", title: "Clinical guidance from Dr. Garvit Vijay and our rehabilitation team", meta: "Clinic update" },
      { image: SVC_IMGS[9], tag: "Balance & Mobility", title: "Why strength, balance, and confidence matter for everyday movement", meta: "Recovery tips" }
    ]
  } : {
    label: "हमारा सोशल मीडिया", head: "हमारे नवीनतम अपडेट फॉलो करें",
    body: "फिजियोथेरेपी मार्गदर्शन, मूवमेंट शिक्षा, क्लिनिक अपडेट और सक्रिय जीवन के उपयोगी सुझावों के लिए इंस्टाग्राम और फेसबुक पर संतोष हीलिक्स से जुड़ें।",
    follow: "@santosh_healix को फॉलो करें", view: "इंस्टाग्राम पर देखें",
    posts: [
      { image: SVC_IMGS[7], tag: "कमर की देखभाल", title: "स्वस्थ रीढ़ के लिए उपयोगी मूवमेंट आदतें", meta: "शैक्षिक पोस्ट" },
      { image: imgGarvit, tag: "हमारी टीम", title: "डॉ. गर्वित विजय और पुनर्वास टीम से क्लिनिकल मार्गदर्शन", meta: "क्लिनिक अपडेट" },
      { image: SVC_IMGS[9], tag: "संतुलन और गतिशीलता", title: "रोज़मर्रा की गतिविधि में ताकत, संतुलन और आत्मविश्वास", meta: "रिकवरी सुझाव" }
    ]
  };

  const fadeUp = (delay: number): CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
  });

  return (
    <main>
      {/* ── Hero ── */}
      <section style={{ background: C.hero, height: "calc(100svh - 66px)", minHeight: 640, display: "flex", alignItems: "center", paddingTop: 100, position: "relative", overflow: "hidden" }}>
        {/* Background image */}
        <img src="https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1800&q=80"
          alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.18 }} />
        {/* Subtle grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px" }} />
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 w-full py-2 lg:py-3" style={{ position: "relative", zIndex: 1 }}>
          <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-8 xl:gap-12 items-center">
            {/* Left */}
            <div>
              <div style={fadeUp(80)}>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 ${sans(lang)}`}
                  style={{ border: `1px solid rgba(66,199,178,0.4)`, color: C.aqua, background: "rgba(66,199,178,0.08)" }}>
                  <MapPin className="w-3 h-3" /> {c.hero.pill}
                </span>
              </div>

              {lang === "en" ? (
                <h1 className="font-['Fraunces',serif] text-white leading-[1.04] mb-4">
                  <span style={{ ...fadeUp(160), display: "block", fontSize: "clamp(40px, 4.6vw, 64px)" }}>
                    Restore{" "}
                    <em style={{ color: C.aqua, fontStyle: "italic" }}>Movement.</em>
                  </span>
                  <span style={{ ...fadeUp(240), display: "block", fontSize: "clamp(40px, 4.6vw, 64px)" }}>
                    Rebuild Confidence.
                  </span>
                  <span style={{ ...fadeUp(320), display: "block", fontSize: "clamp(40px, 4.6vw, 64px)", color: "rgba(255,255,255,0.55)" }}>
                    Return to Life.
                  </span>
                </h1>
              ) : (
                <h1 className={`text-white leading-[1.2] mb-8 font-['Noto_Serif_Devanagari',serif]`}
                  style={{ ...fadeUp(160), fontSize: "clamp(38px, 5vw, 64px)" }}>
                  <span style={{ color: C.aqua }}>{c.hero.line1}</span> {c.hero.line2}<br />
                  {c.hero.line3}<br />
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>{c.hero.line4}</span>
                </h1>
              )}

              <p className={`text-white/60 text-base lg:text-lg leading-relaxed mb-5 max-w-xl ${sans(lang)}`} style={fadeUp(400)}>
                {c.hero.body}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-5" style={fadeUp(480)}>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2.5 px-8 py-4 text-white font-semibold rounded-2xl transition-all min-h-[52px] ${sans(lang)}`}
                  style={{ background: C.wa, boxShadow: "0 4px 20px rgba(20,139,87,0.35)" }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(20,139,87,0.4)"; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(20,139,87,0.35)"; }}>
                  <MessageCircle className="w-5 h-5" />{c.hero.cta1}
                </a>
                <button onClick={() => go("/services")}
                  className={`flex items-center justify-center gap-2.5 px-8 py-4 font-semibold rounded-2xl transition-all min-h-[52px] ${sans(lang)}`}
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.05)" }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = ""; }}>
                  {c.hero.cta2} <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2" style={fadeUp(560)}>
                {c.hero.trust.map((item) => (
                  <div key={item} className={`flex items-center gap-2 text-sm text-white/50 ${sans(lang)}`}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.aqua }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — cycling doctor photo */}
            <div className="relative hidden lg:flex justify-end" style={fadeUp(200)}>
              <div style={{ width: "100%", maxWidth: 350, position: "relative" }}>
                <div style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "4/5", boxShadow: "0 26px 64px rgba(0,0,0,0.36)", position: "relative" }}>
                  {HERO_DOCTORS.map((doc, i) => (
                    <ImageWithFallback key={doc.name} src={doc.img}
                      alt={`${doc.name} — ${doc.role}, Santosh Healix`}
                      className="w-full h-full object-cover object-top"
                      style={{
                        position: i === 0 ? "relative" : "absolute",
                        inset: 0,
                        opacity: i === docIdx ? (fading ? 0 : 1) : 0,
                        transition: "opacity 500ms ease-in-out",
                        width: "100%", height: "100%",
                      }} />
                  ))}
                </div>

                {/* Doctor info card below photo */}
                <div style={{
                  marginTop: 12,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 16,
                  padding: "12px 16px",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  opacity: fading ? 0 : 1,
                  transform: fading ? "translateY(6px)" : "translateY(0)",
                  transition: "opacity 400ms ease, transform 400ms ease",
                }}>
                  <div>
                    <p className={`font-bold text-white text-sm leading-tight ${sans(lang)}`}>
                      {HERO_DOCTORS[docIdx].name}
                    </p>
                    <p className={`text-xs mt-0.5 ${sans(lang)}`} style={{ color: C.aqua }}>
                      {HERO_DOCTORS[docIdx].role}
                    </p>
                  </div>
                  {/* Mini dot nav */}
                  <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                    {HERO_DOCTORS.map((_, i) => (
                      <button key={i} onClick={() => { setFading(true); setTimeout(() => { setDocIdx(i); setFading(false); }, 400); }}
                        style={{
                          width: i === docIdx ? 16 : 5, height: 5, borderRadius: 3,
                          background: i === docIdx ? C.aqua : "rgba(255,255,255,0.3)",
                          border: "none", cursor: "pointer", padding: 0,
                          transition: "all 300ms ease",
                        }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
            <path d="M0 56L1440 56L1440 28C1200 56 900 0 600 18C300 36 120 10 0 28Z" fill={C.hero} />
          </svg>
        </div>
      </section>

      {/* ── Trust ribbon ── */}
      <div style={{ background: C.hero, padding: "0", overflow: "hidden", position: "relative", marginTop: 0, height: 66 }}>
        {/* Subtle shimmer line top */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.aqua}55, ${C.gold}55, transparent)` }} />
        <div style={{ padding: "18px 0", display: "flex", alignItems: "center", gap: 0 }}>
          {/* Marquee — duplicate items for seamless loop */}
          <div style={{ display: "flex", gap: 0, animation: "trustScroll 22s linear infinite", whiteSpace: "nowrap", willChange: "transform" }}>
            {[...c.trustStrip, ...c.trustStrip, ...c.trustStrip].map((item, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, paddingInline: 36, borderRight: `1px solid rgba(255,255,255,0.1)`, flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.aqua}22`, border: `1px solid ${C.aqua}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: C.aqua }} />
                </div>
                <span className={`text-sm font-semibold ${sans(lang)}`} style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.01em" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}44, ${C.aqua}44, transparent)` }} />
        <style>{`
          @keyframes trustScroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>

      {/* ── Featured Services 3D Carousel ── */}      <ServiceCarousel lang={lang} c={c} />

      {/* ── Recovery Journey ── */}
      <section style={{ ...HOME_VIEWPORT_SECTION, background: C.mint, paddingTop: "clamp(32px, 5vh, 48px)", paddingBottom: "clamp(36px, 6vh, 56px)" }}>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          <Reveal className="text-center mb-8">
            <Eyebrow lang={lang}>{c.journeyLabel}</Eyebrow>
            <h2 className={`${serif(lang)}`} style={{ fontSize: "clamp(32px, 4vw, 48px)", color: C.text, fontWeight: 600, lineHeight: 1.1 }}>
              {c.journeyHead}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {c.journeySteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 70}>
                <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(18px, 2vw, 24px)", border: `1px solid ${C.border}`, height: "100%", position: "relative" }}>
                  <div style={{ fontSize: 34, fontWeight: 700, color: C.mint, lineHeight: 1, marginBottom: 14, fontFamily: "Fraunces, serif", userSelect: "none" }}>{step.n}</div>
                  <h3 className={`font-semibold mb-2 ${sans(lang)}`} style={{ color: C.text }}>{step.title}</h3>
                  <p className={`text-sm leading-relaxed ${sans(lang)}`} style={{ color: C.sub }}>{step.body}</p>
                  <div style={{ position: "absolute", top: 20, right: 18, width: 28, height: 28, borderRadius: "50%", background: C.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{i + 1}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Team ── */}
      <section style={{ ...HOME_VIEWPORT_SECTION, background: "linear-gradient(145deg, #fff 0%, #F8F1F6 52%, #F5EFE5 100%)", paddingTop: "clamp(28px, 4vh, 44px)", paddingBottom: "clamp(28px, 4vh, 44px)", position: "relative" }}>
        <div style={{ position: "absolute", top: -180, right: -100, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(214,41,118,0.11), transparent 68%)", pointerEvents: "none" }} />
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 relative">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
              <div className="max-w-3xl">
                <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 ${sans(lang)}`} style={{ color: "#C13584" }}><Instagram className="w-4 h-4" /> {instagram.label}</span>
                <h2 className={`${serif(lang)} mb-4`} style={{ fontSize: "clamp(34px, 4vw, 54px)", color: C.text, fontWeight: 600, lineHeight: 1.08 }}>{instagram.head}</h2>
                <p className={`text-base lg:text-lg leading-relaxed max-w-2xl ${sans(lang)}`} style={{ color: C.sub }}>{instagram.body}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 self-start lg:self-auto">
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold ${sans(lang)}`} style={{ background: "linear-gradient(120deg, #833AB4, #C13584 48%, #E1306C 72%, #F77737)" }}>
                  <Instagram className="w-5 h-5" /> Instagram
                </a>
                <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold ${sans(lang)}`} style={{ background: "#1877F2" }}>
                  <Facebook className="w-5 h-5" /> Facebook
                </a>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
            <Reveal>
              <div style={{ background: "rgba(255,255,255,0.78)", border: "1px solid rgba(193,53,132,0.14)", borderRadius: 30, padding: "18px", backdropFilter: "blur(12px)", minWidth: 0 }}>
                <div className="flex items-center justify-between gap-4 px-2 pb-4">
                  <div className="flex items-center gap-3">
                    <span style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(120deg, #833AB4, #E1306C, #F77737)", display: "flex", alignItems: "center", justifyContent: "center" }}><Instagram className="w-5 h-5 text-white" /></span>
                    <div><h3 className={`font-bold ${sans(lang)}`} style={{ color: C.text }}>Instagram</h3><p className={`text-xs ${sans(lang)}`} style={{ color: C.sub }}>@santosh_healix</p></div>
                  </div>
                  <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Open Instagram"><ArrowUpRight className="w-5 h-5" style={{ color: "#C13584" }} /></a>
                </div>
                <InstagramLiveFeed lang={lang} />
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ background: "rgba(255,255,255,0.78)", border: "1px solid rgba(24,119,242,0.14)", borderRadius: 30, padding: "18px", backdropFilter: "blur(12px)", minWidth: 0 }}>
                <div className="flex items-center justify-between gap-4 px-2 pb-4">
                  <div className="flex items-center gap-3">
                    <span style={{ width: 42, height: 42, borderRadius: 13, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center" }}><Facebook className="w-5 h-5 text-white" /></span>
                    <div><h3 className={`font-bold ${sans(lang)}`} style={{ color: C.text }}>Facebook</h3><p className={`text-xs ${sans(lang)}`} style={{ color: C.sub }}>Santosh Healix</p></div>
                  </div>
                  <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Open Facebook"><ArrowUpRight className="w-5 h-5" style={{ color: "#1877F2" }} /></a>
                </div>
                <FacebookLiveFeed lang={lang} />
              </div>
            </Reveal>
          </div>        </div>
      </section>

      {/* ── Our Team ── */}
      <section style={{ ...HOME_VIEWPORT_SECTION, background: C.white, paddingTop: "clamp(32px, 5vh, 48px)", paddingBottom: "clamp(36px, 6vh, 56px)" }}>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          <Reveal className="mb-6">
            <Eyebrow lang={lang}>{c.teamLabel}</Eyebrow>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <h2 className={`${serif(lang)}`} style={{ fontSize: "clamp(32px, 4vw, 48px)", color: C.text, fontWeight: 600, lineHeight: 1.1 }}>
                {c.teamHead}
              </h2>
              <button onClick={() => go("/team")} className={`flex items-center gap-2 text-sm font-semibold ${sans(lang)}`} style={{ color: C.gold }}>
                {c.meetTeam} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { doc: c.doctors[0], img: imgGarvit, phone: CALL1, phoneLabel: "+91 96495 79679", showWa: true },
              { doc: c.doctors[1], img: imgGarima, phone: CALL2, phoneLabel: "+91 96495 79679", showWa: false },
              { doc: c.ortho as any, img: imgVinay, phone: null, phoneLabel: null, showWa: false, isOrtho: true },
            ].map(({ doc, img, phone, phoneLabel, showWa, isOrtho }, i) => (
              <Reveal key={doc.name} delay={i * 70}>
                <div style={{ background: "#fff", borderRadius: 22, border: `1px solid ${C.border}`, overflow: "hidden", height: "100%", transition: "all 220ms ease", display: "flex", flexDirection: "column" }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,37,80,0.1)"; e.currentTarget.style.borderColor = C.hero; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = C.border; }}>
                  <div style={{ aspectRatio: "3/2", overflow: "hidden" }}>
                    <ImageWithFallback src={img} alt={`${doc.name} — ${doc.role}`}
                      className="w-full h-full object-cover object-top" style={{ transition: "transform 400ms ease" }}
                      onMouseOver={e => e.currentTarget.style.transform = "scale(1.04)"}
                      onMouseOut={e => e.currentTarget.style.transform = ""} />
                  </div>
                  <div style={{ padding: "22px 22px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                    {isOrtho && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3 self-start ${sans(lang)}`}
                        style={{ background: "#FEF3C7", color: "#92400E" }}>
                        {lang === "en" ? "Associated Specialist" : "संबद्ध विशेषज्ञ"}
                      </span>
                    )}
                    <h3 className={`font-semibold text-base mb-0.5 ${sans(lang)}`} style={{ color: C.text }}>
                      {doc.name} <span style={{ color: C.sub, fontWeight: 400 }}>{(doc as any).suffix ?? ""}</span>
                    </h3>
                    <p className={`text-sm font-medium mb-1 ${sans(lang)}`} style={{ color: C.gold }}>{doc.role}</p>
                    <p className={`text-xs mb-4 ${sans(lang)}`} style={{ color: C.sub }}>{doc.quals}</p>
                    <div className="flex flex-col gap-2 mt-auto">
                      {showWa && (
                        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all ${sans(lang)}`}
                          style={{ background: C.wa }}
                          onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
                          onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </a>
                      )}
                      {phone && (
                        <a href={phone}
                          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${sans(lang)}`}
                          style={{ border: `1.5px solid ${C.border}`, color: C.text }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = C.hero; e.currentTarget.style.color = C.hero; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
                          <Phone className="w-4 h-4" /> {phoneLabel}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section style={{ ...HOME_VIEWPORT_SECTION, background: C.mint, paddingTop: "clamp(32px, 5vh, 48px)", paddingBottom: "clamp(36px, 6vh, 56px)" }}>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <Reveal>
              <Eyebrow lang={lang}>{c.locationLabel}</Eyebrow>
              <h2 className={`${serif(lang)} mb-8`} style={{ fontSize: "clamp(32px, 4vw, 48px)", color: C.text, fontWeight: 600, lineHeight: 1.1 }}>
                {c.locationHead}
              </h2>
              <div style={{ display: "flex", gap: 16, padding: "20px", background: "#fff", borderRadius: 18, border: `1px solid ${C.border}`, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin className="w-5 h-5" style={{ color: C.green }} />
                </div>
                <p className={`text-sm leading-relaxed ${sans(lang)}`} style={{ color: C.sub, whiteSpace: "pre-line" }}>{c.address}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { href: MAPS, ext: true, label: c.getDirections, icon: <Map className="w-4 h-4" />, style: { background: C.hero, color: "#fff" } },
                  { href: CALL1, ext: false, label: c.callClinic, icon: <Phone className="w-4 h-4" />, style: { border: `1.5px solid ${C.border}`, color: C.text, background: "#fff" } },
                  { href: WHATSAPP, ext: true, label: c.whatsapp, icon: <MessageCircle className="w-4 h-4" />, style: { border: `1.5px solid ${C.wa}`, color: C.wa, background: "#fff" } },
                ].map(({ href, ext, label, icon, style: s }) => (
                  <a key={href} href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all min-h-[48px] ${sans(lang)}`}
                    style={s}
                    onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={e => e.currentTarget.style.transform = ""}>
                    {icon}{label}
                  </a>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div style={{ borderRadius: 24, overflow: "hidden", position: "relative", boxShadow: "0 16px 56px rgba(15,37,80,0.14)", border: `1px solid ${C.border}` }}>
                <iframe
                  title="Santosh Healix location map"
                  src="https://maps.google.com/maps?q=Shreenath+Puram+Stadium+Kota+Rajasthan&output=embed&z=16"
                  style={{ width: "100%", height: 420, border: 0, display: "block" }}
                  loading="lazy"
                  allowFullScreen
                />
                {/* Overlay CTA strip */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: `linear-gradient(to top, ${C.hero}EE 0%, ${C.hero}99 60%, transparent 100%)`, padding: "32px 24px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-bold text-white text-sm leading-none mb-0.5 ${sans(lang)}`}>{lang === "en" ? "Santosh Healix" : "संतोष हीलिक्स"}</p>
                      <p className={`text-white/60 text-xs ${sans(lang)}`}>{lang === "en" ? "Shreenath Puram, Kota" : "श्रीनाथ पुरम, कोटा"}</p>
                    </div>
                  </div>
                  <a href={MAPS} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all ${sans(lang)}`}
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}
                    onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}>
                    <Map className="w-4 h-4" /> {c.getDirections}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-6">
            <div style={{ background: C.hero, borderRadius: 24, padding: "clamp(20px, 3vh, 28px) clamp(22px, 3vw, 36px)", position: "relative", overflow: "hidden", boxShadow: "0 18px 48px rgba(15,37,80,0.2)" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                  <h2 className={`${serif(lang)} text-white mb-2`} style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 600, lineHeight: 1.08, whiteSpace: "pre-line" }}>
                    {c.ctaHead}
                  </h2>
                  <p className={`text-white/60 text-sm lg:text-base ${sans(lang)}`}>{c.ctaBody}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm bg-white transition-all ${sans(lang)}`}
                    style={{ color: C.hero, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
                    onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseOut={e => { e.currentTarget.style.transform = ""; }}>
                    <MessageCircle className="w-4 h-4" style={{ color: C.wa }} />
                    {lang === "en" ? "WhatsApp Now" : c.whatsapp}
                  </a>
                  <a href={CALL1}
                    className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all ${sans(lang)}`}
                    style={{ border: "1.5px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.07)" }}
                    onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = ""; }}>
                    <Phone className="w-4 h-4" />{c.callBtn}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
export function AboutPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const go = (path: string) => navigate(path);
  const c = t[lang];
  return (
    <main>
      <PageHero
        lang={lang}
        label={c.nav.about}
        title={c.aboutHead}
        subtitle={c.aboutSub}
        image="https://images.unsplash.com/photo-1706353399656-210cca727a33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1800&q=80"
      />

      <section style={{ background: C.white, paddingTop: 48, paddingBottom: 56 }}>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <Reveal>
              <Eyebrow lang={lang}>{lang === "en" ? "Mission" : "मिशन"}</Eyebrow>
              <h2 className={`${serif(lang)} mb-5`} style={{ fontSize: "clamp(28px, 3.5vw, 40px)", color: C.text, fontWeight: 600, lineHeight: 1.12 }}>{c.missionHead}</h2>
              <p className={`text-lg leading-relaxed mb-8 ${sans(lang)}`} style={{ color: C.sub }}>{c.missionBody}</p>
              <div style={{ padding: "24px 28px", background: C.hero, borderRadius: 20 }}>
                <p className={`text-white/80 text-lg leading-relaxed font-['Fraunces',serif] italic`}>
                  "{c.tagline} — from the first assessment to your last session."
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <Eyebrow lang={lang}>{lang === "en" ? "Philosophy" : "दर्शन"}</Eyebrow>
              <h2 className={`${serif(lang)} mb-5`} style={{ fontSize: "clamp(28px, 3.5vw, 40px)", color: C.text, fontWeight: 600, lineHeight: 1.12 }}>{c.philHead}</h2>
              <p className={`text-lg leading-relaxed mb-8 ${sans(lang)}`} style={{ color: C.sub }}>{c.philBody}</p>
              <div style={{ borderRadius: 20, overflow: "hidden", aspectRatio: "16/9" }}>
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=400&fit=crop&auto=format"
                  alt="Physiotherapist in a rehabilitation session" className="w-full h-full object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ background: C.mint, paddingTop: 48, paddingBottom: 56 }}>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          <Reveal className="text-center mb-8">
            <Eyebrow lang={lang}>{lang === "en" ? "What We Stand For" : "हमारे मूल्य"}</Eyebrow>
            <h2 className={`${serif(lang)}`} style={{ fontSize: "clamp(32px, 4vw, 48px)", color: C.text, fontWeight: 600, lineHeight: 1.1 }}>{c.valuesHead}</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.values.map((v, i) => (
              <Reveal key={i} delay={i * 55}>
                <div style={{ background: "#fff", borderRadius: 20, padding: "28px", border: `1px solid ${C.border}`, height: "100%", transition: "all 220ms ease" }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(16,42,54,0.08)"; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  <CheckCircle2 className="w-6 h-6 mb-4" style={{ color: C.green }} />
                  <h3 className={`font-semibold mb-2 ${sans(lang)}`} style={{ color: C.text }}>{v.title}</h3>
                  <p className={`text-sm leading-relaxed ${sans(lang)}`} style={{ color: C.sub }}>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.hero, paddingTop: 52, paddingBottom: 52 }}>
        <Reveal>
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className={`${serif(lang)} text-white mb-8`} style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1 }}>
              {lang === "en" ? "Ready to Begin Your Recovery?" : c.ctaHead}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold ${sans(lang)}`}
                style={{ background: C.wa }}>
                <MessageCircle className="w-5 h-5" /> {c.whatsapp}
              </a>
              <a href={CALL1}
                className={`flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold ${sans(lang)}`}
                style={{ border: "1.5px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.07)" }}>
                <Phone className="w-5 h-5" /> {c.callNow}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

// ─── SERVICES PAGE ────────────────────────────────────────────────────────────
export function ServicesPage() {
  const { lang } = useLang();
  const c = t[lang];
  const theory = lang === "en" ? {
    label: "Rehabilitation Knowledge",
    head: "How Physiotherapy Supports Recovery",
    intro: "Physiotherapy is more than a collection of exercises. It is a structured clinical process that combines assessment, movement analysis, therapeutic exercise, hands-on care, education, and regular review. The aim is not only to reduce symptoms, but also to improve the body’s capacity to perform meaningful daily activities safely and confidently.",
    topics: [
      {
        icon: "activity",
        title: "Clinical Assessment & Reasoning",
        body: "Treatment begins by understanding the person, not simply naming the painful body part. A physiotherapy assessment may examine movement, strength, balance, sensation, coordination, joint mobility, activity tolerance, medical history, and personal goals. These findings help the clinician identify contributing factors, establish a baseline, and select safe priorities for rehabilitation."
      },
      {
        icon: "dumbbell",
        title: "Progressive Loading & Adaptation",
        body: "Muscles, tendons, bones, joints, and the cardiovascular system adapt when they receive an appropriate and gradually increased challenge. Rehabilitation uses carefully selected dosage—such as repetitions, resistance, duration, speed, and rest—to rebuild capacity. Progression should be demanding enough to encourage adaptation while remaining appropriate for healing and symptom response."
      },
      {
        icon: "brain",
        title: "Neuroplasticity & Motor Learning",
        body: "The nervous system can reorganize through repeated, meaningful practice. This principle, called neuroplasticity, is especially important after stroke, neurological illness, or prolonged inactivity. Task-specific repetition, feedback, attention, and increasing difficulty can help the brain and body develop more efficient movement strategies and improve functional independence."
      },
      {
        icon: "footprints",
        title: "Education & Self-Management",
        body: "Understanding a condition can reduce uncertainty and help patients participate actively in recovery. Education may cover pacing, posture, safe movement, home exercise, flare-up planning, sleep, activity modification, and prevention strategies. The long-term goal is to give each person the knowledge and confidence to manage health beyond the clinic."
      }
    ],
    phasesHead: "A typical rehabilitation pathway",
    phases: [
      { n: "01", title: "Assess & Understand", body: "Clarify symptoms, functional limitations, risks, goals, and measurable starting points." },
      { n: "02", title: "Restore & Rebuild", body: "Use guided movement, exercise, practice, and education to improve capacity progressively." },
      { n: "03", title: "Return & Maintain", body: "Prepare for daily life, work, sport, or independent activity with a sustainable plan." }
    ],
    note: "Recovery is individual. The most appropriate treatment, exercise dosage, and timeline depend on diagnosis, health status, healing stage, functional needs, and response to rehabilitation. A clinical assessment is therefore essential before beginning a personalized programme."
  } : {
    label: "पुनर्वास की जानकारी",
    head: "फिजियोथेरेपी रिकवरी में कैसे सहायता करती है",
    intro: "फिजियोथेरेपी केवल व्यायामों का समूह नहीं है। यह एक व्यवस्थित क्लिनिकल प्रक्रिया है जिसमें मूल्यांकन, मूवमेंट विश्लेषण, चिकित्सीय व्यायाम, हाथों से दी जाने वाली देखभाल, रोगी शिक्षा और नियमित प्रगति समीक्षा शामिल होती है। इसका उद्देश्य केवल लक्षण कम करना नहीं, बल्कि रोज़मर्रा के कार्य सुरक्षित और आत्मविश्वास के साथ करने की क्षमता बढ़ाना भी है।",
    topics: [
      {
        icon: "activity",
        title: "क्लिनिकल मूल्यांकन और निर्णय",
        body: "उपचार की शुरुआत केवल दर्द वाले हिस्से से नहीं, बल्कि पूरे व्यक्ति को समझने से होती है। मूल्यांकन में मूवमेंट, ताकत, संतुलन, संवेदना, समन्वय, जोड़ की गतिशीलता, गतिविधि सहनशीलता, मेडिकल इतिहास और व्यक्तिगत लक्ष्यों की जाँच हो सकती है। इससे सुरक्षित प्राथमिकताएँ और प्रगति मापने का आधार तय होता है।"
      },
      {
        icon: "dumbbell",
        title: "क्रमिक भार और शरीर का अनुकूलन",
        body: "मांसपेशियाँ, टेंडन, हड्डियाँ, जोड़ और हृदय-श्वसन तंत्र उचित तथा धीरे-धीरे बढ़ाई गई चुनौती के अनुसार अनुकूलित होते हैं। पुनर्वास में दोहराव, प्रतिरोध, अवधि, गति और आराम की मात्रा सोच-समझकर तय की जाती है, ताकि शरीर की क्षमता बढ़े और उपचार की अवस्था के अनुसार सुरक्षा बनी रहे।"
      },
      {
        icon: "brain",
        title: "न्यूरोप्लास्टिसिटी और मोटर लर्निंग",
        body: "अर्थपूर्ण और बार-बार किए गए अभ्यास से तंत्रिका तंत्र स्वयं को पुनर्गठित कर सकता है। इसे न्यूरोप्लास्टिसिटी कहा जाता है और यह स्ट्रोक, न्यूरोलॉजिकल बीमारी या लंबे समय की निष्क्रियता के बाद विशेष रूप से महत्वपूर्ण है। कार्य-विशिष्ट अभ्यास, फीडबैक और धीरे-धीरे बढ़ती कठिनाई बेहतर मूवमेंट रणनीति विकसित करने में मदद कर सकती है।"
      },
      {
        icon: "footprints",
        title: "शिक्षा और स्व-प्रबंधन",
        body: "स्थिति को समझने से अनिश्चितता कम होती है और रोगी अपनी रिकवरी में सक्रिय भाग ले सकता है। शिक्षा में गतिविधि की गति तय करना, सुरक्षित मूवमेंट, घरेलू व्यायाम, दर्द बढ़ने पर योजना, नींद, गतिविधि में बदलाव और बचाव की रणनीतियाँ शामिल हो सकती हैं। उद्देश्य क्लिनिक के बाहर भी स्वास्थ्य संभालने का आत्मविश्वास देना है।"
      }
    ],
    phasesHead: "पुनर्वास की सामान्य प्रक्रिया",
    phases: [
      { n: "01", title: "मूल्यांकन और समझ", body: "लक्षण, कार्यात्मक कठिनाइयाँ, जोखिम, लक्ष्य और शुरुआती माप स्पष्ट किए जाते हैं।" },
      { n: "02", title: "क्षमता बहाल और विकसित करना", body: "निर्देशित मूवमेंट, व्यायाम, अभ्यास और शिक्षा से क्षमता क्रमिक रूप से बढ़ाई जाती है।" },
      { n: "03", title: "वापसी और रखरखाव", body: "दैनिक जीवन, काम, खेल या स्वतंत्र गतिविधि के लिए टिकाऊ योजना तैयार की जाती है।" }
    ],
    note: "हर व्यक्ति की रिकवरी अलग होती है। सही उपचार, व्यायाम की मात्रा और समय-सीमा निदान, स्वास्थ्य स्थिति, उपचार की अवस्था, कार्यात्मक आवश्यकताओं और प्रतिक्रिया पर निर्भर करती है। इसलिए व्यक्तिगत कार्यक्रम शुरू करने से पहले क्लिनिकल मूल्यांकन आवश्यक है।"
  };
  return (
    <main>
      <PageHero
        lang={lang}
        label={c.nav.services}
        title={c.svcPageHead}
        subtitle={c.svcPageSub}
        image="https://images.unsplash.com/photo-1645005513713-9e2b92a687d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1800&q=80"
      />

      <div style={{ background: C.gold, padding: "12px 0" }}>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8 flex items-center justify-center gap-3">
          <Star className="w-4 h-4 shrink-0" style={{ color: C.hero }} />
          <p className={`text-sm font-semibold ${sans(lang)}`} style={{ color: C.hero }}>{c.servicesNote}</p>
        </div>
      </div>


      <section style={{ background: C.white, paddingTop: 52, paddingBottom: 56 }}>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.allServices.map((svc, i) => (
              <Reveal key={svc.name} delay={(i % 3) * 60}>
                <div style={{ background: "#fff", borderRadius: 22, border: `1px solid ${C.border}`, overflow: "hidden", transition: "all 280ms ease", height: "100%", display: "flex", flexDirection: "column" }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(16,42,54,0.12)"; e.currentTarget.style.borderColor = C.aqua; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = C.border; }}>

                  {/* Image banner */}
                  <div style={{ position: "relative", height: 160, overflow: "hidden", flexShrink: 0 }}>
                    <img
                      src={SVC_IMGS[i]}
                      alt={svc.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms ease" }}
                      onMouseOver={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                      onMouseOut={e => { (e.currentTarget as HTMLImageElement).style.transform = ""; }}
                    />
                    {/* Gradient fade into white card body */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,37,80,0.18) 0%, rgba(15,37,80,0.42) 60%, rgba(255,255,255,0) 100%)" }} />
                    {/* Icon badge over image */}
                    <div style={{ position: "absolute", bottom: -20, left: 20, width: 44, height: 44, borderRadius: 14, background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.14)", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${C.border}` }}>
                      <SvcIcon icon={svc.icon} cls="w-5 h-5 text-[#1A3D7C]" />
                    </div>
                    {/* Colour accent pill */}
                    <div style={{ position: "absolute", top: 12, right: 12, width: 28, height: 4, borderRadius: 2, background: i % 3 === 0 ? C.hero : i % 3 === 1 ? C.aqua : C.gold }} />
                  </div>

                  {/* Content */}
                  <div style={{ padding: "32px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 className={`font-bold mb-2 ${sans(lang)}`} style={{ color: C.text, fontSize: 16 }}>{svc.name}</h3>
                    <p className={`text-sm leading-relaxed mb-4 ${sans(lang)}`} style={{ color: C.sub, flex: 1 }}>{svc.body}</p>
                    <div style={{ background: C.mint, borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${sans(lang)}`} style={{ color: C.blue }}>
                        {lang === "en" ? "Rehabilitation goals" : "पुनर्वास लक्ष्य"}
                      </p>
                      <p className={`text-xs leading-relaxed ${sans(lang)}`} style={{ color: C.sub }}>{svc.goals}</p>
                    </div>
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${sans(lang)}`} style={{ color: C.hero }}>
                      <MessageCircle className="w-4 h-4" /> {c.discussNeeds}
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.mint, paddingTop: 72, paddingBottom: 76 }}>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-10 lg:gap-16 items-start mb-12">
              <div>
                <Eyebrow lang={lang}>{theory.label}</Eyebrow>
                <h2 className={`${serif(lang)} mb-6`} style={{ fontSize: "clamp(34px, 4vw, 54px)", color: C.text, fontWeight: 600, lineHeight: 1.08 }}>
                  {theory.head}
                </h2>
              </div>
              <p className={`text-base lg:text-lg leading-[1.85] ${sans(lang)}`} style={{ color: C.sub }}>
                {theory.intro}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {theory.topics.map((topic, i) => (
              <Reveal key={topic.title} delay={(i % 2) * 70}>
                <article style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 24, padding: "30px", height: "100%", boxShadow: "0 10px 30px rgba(15,37,80,0.05)" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${C.aqua}1c`, border: `1px solid ${C.aqua}45`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <SvcIcon icon={topic.icon} cls="w-6 h-6 text-[#1A3D7C]" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${sans(lang)}`} style={{ color: C.text }}>{topic.title}</h3>
                  <p className={`text-sm lg:text-base leading-[1.8] ${sans(lang)}`} style={{ color: C.sub }}>{topic.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div style={{ background: C.hero, borderRadius: 28, padding: "34px", color: "#fff" }}>
              <h3 className={`${serif(lang)} text-center mb-8`} style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 600 }}>
                {theory.phasesHead}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {theory.phases.map((phase) => (
                  <div key={phase.n} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "24px" }}>
                    <span className={`${serif(lang)} text-3xl font-bold`} style={{ color: C.aqua }}>{phase.n}</span>
                    <h4 className={`text-lg font-bold mt-4 mb-2 ${sans(lang)}`}>{phase.title}</h4>
                    <p className={`text-sm leading-relaxed text-white/60 ${sans(lang)}`}>{phase.body}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 max-w-5xl mx-auto" style={{ background: "rgba(228,184,50,0.11)", border: `1px solid ${C.aqua}38`, borderRadius: 16, padding: "18px 20px" }}>
                <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: C.aqua }} />
                <p className={`text-sm leading-relaxed text-white/70 ${sans(lang)}`}>{theory.note}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section style={{ background: C.hero, paddingTop: 52, paddingBottom: 52 }}>
        <Reveal>
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className={`text-white/60 text-lg mb-8 ${sans(lang)}`}>
              {lang === "en" ? "Not sure which service is right for you? Contact us for guidance." : "सुनिश्चित नहीं? हमसे संपर्क करें।"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold ${sans(lang)}`}
                style={{ background: C.wa }}>
                <MessageCircle className="w-5 h-5" /> {c.whatsapp}
              </a>
              <a href={CALL1}
                className={`flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold ${sans(lang)}`}
                style={{ border: "1.5px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.07)" }}>
                <Phone className="w-5 h-5" /> {c.callNow}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

// ─── TEAM PAGE ────────────────────────────────────────────────────────────────
export function TeamPage() {
  const { lang } = useLang();
  const c = t[lang];
  return (
    <main>
      <PageHero
        lang={lang}
        label={c.nav.team}
        title={c.teamPageHead}
        subtitle={c.teamPageSub}
        image="https://images.unsplash.com/photo-1777269749032-d8d458ae594d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1800&q=80"
      />

      {/* All three doctors — equal grid */}
      <section style={{ background: C.white, paddingTop: 48, paddingBottom: 56 }}>
        <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          {/* Ortho disclaimer */}
          <Reveal className="mb-10">
            <div style={{ padding: "14px 18px", background: "#FEF9EC", border: "1px solid #F5D97A", borderRadius: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Shield className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#92400E" }} />
              <p className={`text-sm ${sans(lang)}`} style={{ color: "#78350F" }}>{c.teamOrthoNote}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { doc: c.doctors[0], img: imgGarvit, phone: CALL1, phoneLabel: c.doctors[0].contact, showWa: true },
              { doc: c.doctors[1], img: imgGarima, phone: CALL2, phoneLabel: c.doctors[1].contact, showWa: false },
              { doc: c.ortho as any, img: imgVinay, phone: null, phoneLabel: null, showWa: false, isOrtho: true },
            ].map(({ doc, img, phone, phoneLabel, showWa, isOrtho }, i) => (
              <Reveal key={doc.name} delay={i * 70}>
                <div style={{ background: "#fff", borderRadius: 22, border: `1px solid ${C.border}`, overflow: "hidden", height: "100%", transition: "all 220ms ease", display: "flex", flexDirection: "column" }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,37,80,0.1)"; e.currentTarget.style.borderColor = C.hero; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = C.border; }}>
                  <div style={{ aspectRatio: "3/2", overflow: "hidden" }}>
                    <ImageWithFallback src={img} alt={`${doc.name} — ${doc.role}`}
                      className="w-full h-full object-cover object-top" style={{ transition: "transform 400ms ease" }}
                      onMouseOver={e => e.currentTarget.style.transform = "scale(1.04)"}
                      onMouseOut={e => e.currentTarget.style.transform = ""} />
                  </div>
                  <div style={{ padding: "24px 24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                    {isOrtho && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3 self-start ${sans(lang)}`}
                        style={{ background: "#FEF3C7", color: "#92400E" }}>
                        {lang === "en" ? "Associated Specialist" : "संबद्ध विशेषज्ञ"}
                      </span>
                    )}
                    <h3 className={`${serif(lang)} mb-0.5`} style={{ fontSize: "clamp(18px, 2vw, 22px)", color: C.text, fontWeight: 600, lineHeight: 1.2 }}>
                      {doc.name} <span className={`text-sm font-normal ${sans(lang)}`} style={{ color: C.sub }}>{(doc as any).suffix ?? ""}</span>
                    </h3>
                    <p className={`text-sm font-semibold mb-1 ${sans(lang)}`} style={{ color: C.gold }}>{doc.role}</p>
                    <p className={`text-xs mb-1 ${sans(lang)}`} style={{ color: C.sub }}>{doc.quals}</p>
                    {(doc as any).affil && (
                      <p className={`text-xs mb-4 ${sans(lang)}`} style={{ color: C.sub }}>{(doc as any).affil}</p>
                    )}
                    <p className={`text-sm leading-relaxed mb-5 ${sans(lang)}`} style={{ color: C.sub }}>{doc.bio}</p>
                    <div className="flex flex-col gap-2 mt-auto">
                      {showWa && (
                        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all ${sans(lang)}`}
                          style={{ background: C.wa }}
                          onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseOut={e => { e.currentTarget.style.transform = ""; }}>
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </a>
                      )}
                      {phone && (
                        <a href={phone}
                          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${sans(lang)}`}
                          style={{ border: `1.5px solid ${C.border}`, color: C.text }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = C.hero; e.currentTarget.style.color = C.hero; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
                          <Phone className="w-4 h-4" /> {phoneLabel}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
export function ContactPage() {
  const { lang } = useLang();
  const c = t[lang];
  const formspreeEndpoint = (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined) || "https://formspree.io/f/mykrdger";
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const appointmentField: CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 16,
    border: "1px solid #D6E2E5",
    background: "#F1FAF8",
    color: C.text,
    outline: "none",
  };

  const handleAppointmentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormStatus("submitting");

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Appointment request could not be submitted.");
      form.reset();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };
  return (
    <main>
      <PageHero
        lang={lang}
        label={c.nav.contact}
        title={c.contactHead}
        subtitle={c.contactSub}
        image="https://images.unsplash.com/photo-1645005512827-48ff6f97848a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1800&q=80"
      />

      <div className="grid lg:grid-cols-2 items-stretch">
      <section className="lg:order-2" style={{ background: C.mint, padding: "36px 0 44px" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          <div className="grid grid-cols-1 gap-4 items-stretch">
            <Reveal>
              <aside style={{ height: "100%", minHeight: 360, padding: "clamp(24px, 3vw, 32px)", borderRadius: 24, background: C.hero, color: "#fff", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div aria-hidden="true" style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", right: -100, top: -95, border: "1px solid rgba(255,255,255,0.10)" }} />
                <div aria-hidden="true" style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", right: -70, top: -55, border: "1px solid rgba(228,184,50,0.28)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p className={sans(lang)} style={{ color: C.aqua, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", marginBottom: 14 }}>
                    BOOK AN APPOINTMENT
                  </p>
                  <h2 className={serif(lang)} style={{ fontSize: "clamp(30px, 3vw, 40px)", fontWeight: 600, lineHeight: 1.08, marginBottom: 12 }}>
                    Plan Your Visit
                  </h2>
                  <p className={sans(lang)} style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.65, marginBottom: 20 }}>
                    Share your preferred service, date, and time. Our clinic team will contact you to confirm the most suitable available appointment.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    {[
                      "Choose the rehabilitation service you need",
                      "Select a preferred date and time window",
                      "Receive confirmation directly from our clinic team",
                    ].map(item => (
                      <div key={item} className={sans(lang)} style={{ display: "flex", alignItems: "flex-start", gap: 12, color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.5 }}>
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: C.aqua }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ position: "relative", zIndex: 1, marginTop: "auto", paddingTop: 22 }}>
                  <p className={sans(lang)} style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginBottom: 12 }}>
                    Prefer to speak with us directly?
                  </p>
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                    <a href={CALL1} className={sans(lang)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", borderRadius: 12, background: "#fff", color: C.hero, fontSize: 14, fontWeight: 700 }}>
                      <Phone className="w-4 h-4" /> Call Clinic
                    </a>
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={sans(lang)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", borderRadius: 12, background: C.wa, color: "#fff", fontSize: 14, fontWeight: 700 }}>
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  </div>
                </div>
              </aside>
            </Reveal>

            <Reveal delay={80}>
            <form
              action={formspreeEndpoint}
              method="POST"
              onSubmit={handleAppointmentSubmit}
              style={{ height: "100%", background: C.white, padding: "clamp(20px, 3vw, 28px)", borderRadius: 24, border: "1px solid #DDE7E5", boxShadow: "0 18px 50px rgba(15,37,80,0.08)" }}
            >
              <input type="hidden" name="_subject" value="New appointment request — Santosh Healix" />
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />

              <h2 className={serif(lang)} style={{ fontSize: "clamp(28px, 3vw, 36px)", color: C.text, fontWeight: 600, lineHeight: 1.1, marginBottom: 8 }}>
                Request an Appointment
              </h2>
              <p className={sans(lang)} style={{ color: C.sub, marginBottom: 20 }}>
                Fill the form and our team will confirm your slot within a few hours.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3.5">
                <label className={sans(lang)} style={{ color: C.text, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                  FULL NAME *
                  <input required name="full_name" type="text" autoComplete="name" placeholder="Your full name" style={{ ...appointmentField, marginTop: 8 }} />
                </label>
                <label className={sans(lang)} style={{ color: C.text, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                  PHONE NUMBER *
                  <input required name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 XXXXX XXXXX" style={{ ...appointmentField, marginTop: 8 }} />
                </label>
                <label className={"sm:col-span-2 " + sans(lang)} style={{ color: C.text, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                  EMAIL ADDRESS
                  <input name="email" type="email" autoComplete="email" placeholder="your@email.com" style={{ ...appointmentField, marginTop: 8 }} />
                </label>
                <label className={"sm:col-span-2 " + sans(lang)} style={{ color: C.text, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                  SERVICE REQUIRED *
                  <select required name="service" defaultValue="" style={{ ...appointmentField, marginTop: 8 }}>
                    <option value="" disabled>Select a service...</option>
                    <option>Orthopaedic Physiotherapy</option>
                    <option>Neurological Rehabilitation</option>
                    <option>Sports Injury Rehabilitation</option>
                    <option>Post-Fracture & Post-Surgery Rehabilitation</option>
                    <option>Pediatric & CP Rehabilitation</option>
                    <option>Women's Health Physiotherapy</option>
                    <option>Stroke Rehabilitation</option>
                    <option>Balance & Gait Training</option>
                    <option>Pain Management</option>
                    <option>General Consultation</option>
                  </select>
                </label>
                <label className={"sm:col-span-2 " + sans(lang)} style={{ color: C.text, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                  PREFERRED DATE *
                  <input required name="preferred_date" type="date" min={new Date().toISOString().split("T")[0]} style={{ ...appointmentField, marginTop: 8 }} />
                </label>
                <label className={"sm:col-span-2 " + sans(lang)} style={{ color: C.text, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                  PREFERRED TIME SLOT *
                  <select required name="preferred_time" defaultValue="" style={{ ...appointmentField, marginTop: 8 }}>
                    <option value="" disabled>Select preferred time...</option>
                    <option>Morning — 9:00 AM to 12:00 PM</option>
                    <option>Afternoon — 12:00 PM to 4:00 PM</option>
                    <option>Evening — 4:00 PM to 8:00 PM</option>
                  </select>
                </label>
                <label className={"sm:col-span-2 " + sans(lang)} style={{ color: C.text, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                  MESSAGE / SYMPTOMS
                  <textarea name="message" rows={3} placeholder="Briefly describe your condition or symptoms..." style={{ ...appointmentField, marginTop: 8, resize: "vertical" }} />
                </label>
              </div>

              <div aria-live="polite">
                {formStatus === "success" && (
                  <p role="status" className={sans(lang)} style={{ marginTop: 18, color: "#148B57", fontSize: 13, fontWeight: 600 }}>
                    Your appointment request was sent successfully. Our clinic team will contact you to confirm the slot.
                  </p>
                )}
                {formStatus === "error" && (
                  <p role="alert" className={sans(lang)} style={{ marginTop: 18, color: "#B42318", fontSize: 13, fontWeight: 600 }}>
                    We could not send your request. Please try again or contact the clinic by phone.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className={sans(lang)}
                style={{ width: "100%", marginTop: 18, padding: "13px 20px", border: 0, borderRadius: 16, background: C.hero, color: "#fff", fontSize: 16, fontWeight: 700, cursor: formStatus === "submitting" ? "wait" : "pointer", opacity: formStatus === "submitting" ? 0.7 : 1 }}
              >
                {formStatus === "submitting" ? "Sending Request..." : "Submit Appointment Request"}
              </button>
            </form>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="lg:order-1" style={{ background: C.white, paddingTop: 48, paddingBottom: 60 }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
          {/* Emergency */}
          <Reveal>
            <div style={{ display: "flex", gap: 14, padding: "18px 20px", background: "#FFF5F5", border: `1.5px solid #FCA5A5`, borderRadius: 16, marginBottom: 32 }}>
              <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#B42318" }} />
              <p className={`text-sm font-medium ${sans(lang)}`} style={{ color: "#B42318" }}>{c.emergency}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-10">
            {/* Actions */}
            <div>
              <Reveal>
                <h2 className={`${serif(lang)} mb-8`} style={{ fontSize: "clamp(28px, 3vw, 36px)", color: C.text, fontWeight: 600, lineHeight: 1.1 }}>
                  {lang === "en" ? "Reach Us" : "हमसे संपर्क करें"}
                </h2>
              </Reveal>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { href: WHATSAPP, ext: true, bg: C.wa, icon: <MessageCircle className="w-6 h-6" />, label: c.whatsapp, sub: "+91 96495 79679" },
                  { href: CALL1, ext: false, bg: C.hero, icon: <Phone className="w-6 h-6" />, label: lang === "en" ? "Primary Contact" : "मुख्य संपर्क", sub: "+91 96495 79679" },
                  { href: MAPS, ext: true, bg: C.sub, icon: <Map className="w-6 h-6" />, label: c.getDirections, sub: lang === "en" ? "Open in Google Maps" : "Google Maps में खोलें" },
                ].map(({ href, ext, bg, icon, label, sub }, i) => (
                  <Reveal key={href} delay={i * 60}>
                    <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: bg, borderRadius: 18, color: "#fff", transition: "all 200ms ease", textDecoration: "none" }}
                      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)"; }}
                      onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className={`font-bold text-base ${sans(lang)}`}>{label}</p>
                        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{sub}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-50" />
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Address + Map */}
            <div>
              <Reveal>
                <h2 className={`${serif(lang)} mb-6`} style={{ fontSize: "clamp(28px, 3vw, 36px)", color: C.text, fontWeight: 600, lineHeight: 1.1 }}>
                  {lang === "en" ? "Our Address" : "हमारा पता"}
                </h2>
                <div style={{ display: "flex", gap: 14, padding: "20px", background: C.mint, borderRadius: 18, border: `1px solid ${C.border}`, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <MapPin className="w-5 h-5" style={{ color: C.green }} />
                  </div>
                  <div>
                    <p className={`font-semibold mb-1 ${sans(lang)}`} style={{ color: C.text }}>
                      {lang === "en" ? "Santosh Healix Physiotherapy & Rehabilitation Center" : "संतोष हीलिक्स फिजियोथेरेपी और पुनर्वास केंद्र"}
                    </p>
                    <p className={`text-sm leading-relaxed ${sans(lang)}`} style={{ color: C.sub, whiteSpace: "pre-line" }}>{c.address}</p>
                  </div>
                </div>
                <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", border: `1px solid ${C.border}` }}>
                  <iframe
                    title=""
                    aria-label="Santosh Healix contact map"
                    src="https://maps.google.com/maps?q=Shreenath+Puram+Stadium+Kota+Rajasthan&output=embed&z=16"
                    style={{ width: "100%", height: 300, border: 0, display: "block" }}
                    loading="lazy"
                    allowFullScreen
                  />
                  <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                    <a href={MAPS} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition-all ${sans(lang)}`}
                      style={{ background: C.hero, boxShadow: "0 4px 16px rgba(15,37,80,0.35)" }}
                      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseOut={e => { e.currentTarget.style.transform = ""; }}>
                      <Map className="w-4 h-4" /> {c.getDirections}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      </div>


    </main>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return <RouterProvider router={router} />;
}
