/**
 * ==============================================================================
 * DRAINAGEFIX — APPLICATION JAVASCRIPT (script.js)
 * Clean, modular Vanilla JavaScript for civic drainage assistance.
 * Designed for offline-first, client-side execution with localStorage persistence.
 * ==============================================================================
 */

// Wrap in an IIFE (Immediately Invoked Function Expression) to protect global scope
(function () {
  "use strict";

  /* ============================================================================
     1. MASTER CONSTANTS & LOCAL DATA
     ============================================================================ */

  // All 28 States and 8 Union Territories of India (36 Total)
  const INDIAN_STATES_AND_UTS = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    // 8 Union Territories:
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ].sort();

  // 8 Specified Drainage Service Categories
  const SERVICE_CATEGORIES = [
    "Drain cleaning",
    "Sewer line repair",
    "Drainage pipe installation",
    "Waterlogging removal",
    "Stormwater drain maintenance",
    "Drain inspection",
    "Pumping and water removal",
    "Emergency drainage services"
  ];

  // Rule-Based Mapping: Problem Type -> Recommended Services & Technical Guidance
  const PROBLEM_MATCHING_RULES = {
    "Overflowing drainage after rain": {
      category: "Stormwater drain maintenance",
      secondary: "Pumping and water removal",
      explanation: "Heavy rainwater runoff is exceeding local drain capacity or intake chutes are choked with silt and debris. High-capacity dewatering pumps and roadside culvert desilting are needed immediately.",
      equipment: ["Tractor-Mounted Sludge Pumps", "Culvert Scraper Bars", "Silt Interceptors"],
      urgency: "High"
    },
    "Blocked drainage pipe": {
      category: "Drain cleaning",
      secondary: "Drain inspection",
      explanation: "Compound outlet or household connection pipe is clogged by grease, roots, or solidified sediments. Hydro-jetting and motorized rotary snake cables can clear the line safely without tearing down walls.",
      equipment: ["200-Bar High Pressure Jetting Unit", "Rotary Snake Cable", "Inspection Endoscope"],
      urgency: "Medium"
    },
    "Road waterlogging": {
      category: "Waterlogging removal",
      secondary: "Pumping and water removal",
      explanation: "Water has accumulated along street curbs, junctions, and building entrances. Mobile high-discharge dewatering pumps are required to evacuate water into the nearest open canal or retention sump.",
      equipment: ["Portable Submersible Dewatering Sets", "Flexible Layflat Discharge Hoses", "Road Safety Cones"],
      urgency: "High"
    },
    "Sewage water coming outside": {
      category: "Sewer line repair",
      secondary: "Drain inspection",
      explanation: "Biohazardous blackwater backup indicates a mainline municipal blockage or collapsed underground sewer pipe. Requires robotic CCTV pipeline inspection and super-sucker vacuum cleaning.",
      equipment: ["CCTV Pipe Inspection Robot", "Vacuum Super-Sucker Truck", "Gas Detectors"],
      urgency: "Emergency"
    },
    "Stagnant water near houses": {
      category: "Waterlogging removal",
      secondary: "Drain cleaning",
      explanation: "Puddled stagnant water creates severe breeding grounds for dengue and malaria vectors within 48 hours. Requires silt trenching, mobile pumping, and anti-larval surface treatment.",
      equipment: ["Mini Trench Desilters", "Mud Suction Pumps", "Silt Traps"],
      urgency: "Medium"
    },
    "Damaged drainage cover": {
      category: "Drainage pipe installation",
      secondary: "Stormwater drain maintenance",
      explanation: "Broken or missing manhole slabs create life-threatening sinkholes for pedestrians and vehicles under submerged water. Urgent barricading and installation of heavy-duty SFRC / ductile iron covers is essential.",
      equipment: ["Precast Reinforced Concrete Slabs", "Ductile Iron Grates", "Hazard Barricades"],
      urgency: "Emergency"
    },
    "Damaged underground drainage": {
      category: "Sewer line repair",
      secondary: "Drainage pipe installation",
      explanation: "Fractured underground pipes erode foundation soil, leading to sinkholes and building dampness. Requires modern trenchless CIPP (Cured-in-Place Pipe) relining or targeted excavation replacement.",
      equipment: ["Trenchless Pipe Relining Machine", "Ground Penetrating Sonar", "Excavation Shoring"],
      urgency: "High"
    },
    "Other drainage problems": {
      category: "Emergency drainage services",
      secondary: "Drain inspection",
      explanation: "Unusual or complex drainage failures require an on-site diagnostic survey by a certified civic drainage contractor to identify root causes and formulate a drainage remediation plan.",
      equipment: ["Multi-Gas Leak Analyzers", "Hydrostatic Pressure Gauges", "Digital Borehole Cameras"],
      urgency: "Medium"
    }
  };

  // Sample Demonstration Drainage Companies (Fictional, Illustrative across Indian cities)
  const SAMPLE_COMPANIES = [
    {
      id: "comp-1",
      name: "JalShield Dewatering & Drain Tech",
      speciality: "High-Volume Flood Pumping & Silt Extraction",
      state: "Karnataka",
      city: "Bengaluru",
      categories: ["Waterlogging removal", "Pumping and water removal", "Stormwater drain maintenance"],
      services: ["Basement dewatering", "Submersible pumping", "Storm drain desilting", "Road sump evacuation"],
      priceRange: "₹2,500 – ₹5,500",
      minPrice: 2500,
      maxPrice: 5500,
      sampleRating: "4.8 / 5.0 (Sample)",
      reviewCount: "42 demo reviews",
      availability: "24/7 On-Call (Demo)",
      phone: "+91 98765 01001 (Demo Only)",
      email: "dispatch@demo-jalshield.in",
      address: "Plot 18, Indiranagar 100ft Road, Bengaluru, Karnataka",
      equipment: ["30 HP Submersible Dewatering Pumps", "High Pressure Water Jetter", "Lay-flat Discharge Hose Lines"],
      description: "Equipped with high-flow pumps capable of evacuating flooded basement parking lots and residential streets in low-lying monsoon zones.",
      verificationTips: [
        "Request pump discharge capacity specifications (LPM) prior to booking",
        "Verify electricity source safety before running submersible pumps",
        "Confirm destination discharge point does not flood neighbor compounds"
      ]
    },
    {
      id: "comp-2",
      name: "MetroPipe CCTV Inspection & Repairs",
      speciality: "Robotic Sewer Video Diagnostic & Line Relining",
      state: "Delhi",
      city: "Delhi",
      categories: ["Drain inspection", "Sewer line repair", "Drainage pipe installation"],
      services: ["Robotic crawler camera inspection", "Trenchless pipe relining", "Underground leak pinpointing", "Collapsed pipe excavation"],
      priceRange: "₹3,500 – ₹8,000",
      minPrice: 3500,
      maxPrice: 8000,
      sampleRating: "4.9 / 5.0 (Sample)",
      reviewCount: "58 demo reviews",
      availability: "Mon–Sat, 8 AM–8 PM (Demo)",
      phone: "+91 98765 01002 (Demo Only)",
      email: "service@demo-metropipe.in",
      address: "Sector 14, Dwarka, New Delhi, Delhi",
      equipment: ["Pan-and-Tilt Color Sewer Camera", "CIPP Relining Resins", "Sonde Sonar Pipe Locator"],
      description: "Detects hidden cracked, root-intruded, or collapsed drainage pipelines under paved floors without destructive wall and tile demolition.",
      verificationTips: [
        "Ask for digital USB video footage of the pipeline interior inspection",
        "Verify contractor experience with trenchless epoxy lining",
        "Obtain a written repair estimate before subterranean digging"
      ]
    },
    {
      id: "comp-3",
      name: "MonsoonGuard Dewatering & Gully Works",
      speciality: "Basement Protection & Stormwater Silt Clearing",
      state: "Maharashtra",
      city: "Mumbai",
      categories: ["Waterlogging removal", "Stormwater drain maintenance", "Pumping and water removal"],
      services: ["Storm culvert clearing", "Basement flood suction", "Silt trap installation", "Gully grating unclogging"],
      priceRange: "₹2,800 – ₹6,500",
      minPrice: 2800,
      maxPrice: 6500,
      sampleRating: "4.7 / 5.0 (Sample)",
      reviewCount: "35 demo reviews",
      availability: "24/7 Monsoon Emergency (Demo)",
      phone: "+91 98765 01003 (Demo Only)",
      email: "contact@demo-monsoonguard.in",
      address: "Andheri-Kurla Road, Chakala, Mumbai, Maharashtra",
      equipment: ["Super-Suction Dewatering Tanks", "Gutter Desilting Tools", "Safety Harness Sets"],
      description: "Dedicated rapid responder for Mumbai coastal and low-lying inundation zones, clearing jammed stormwater drains and flooded society basements.",
      verificationTips: [
        "Inquire if pump operators carry certified personal protective equipment",
        "Agree in advance on minimum standby charges vs active pumping hours",
        "Confirm proper legal disposal of extracted silt debris"
      ]
    },
    {
      id: "comp-4",
      name: "SwachhGully Hydro-Jetting Services",
      speciality: "High-Pressure Blockage Clearing & Grease Removal",
      state: "Maharashtra",
      city: "Pune",
      categories: ["Drain cleaning", "Drain inspection", "Emergency drainage services"],
      services: ["High pressure water jetting", "Kitchen fatberg removal", "Rotary root cutting", "Inspection chamber clearing"],
      priceRange: "₹1,500 – ₹3,500",
      minPrice: 1500,
      maxPrice: 3500,
      sampleRating: "4.6 / 5.0 (Sample)",
      reviewCount: "29 demo reviews",
      availability: "Available Today (Demo)",
      phone: "+91 98765 01004 (Demo Only)",
      email: "help@demo-swachhgully.in",
      address: "Kothrud Industrial Area, Pune, Maharashtra",
      equipment: ["250-Bar Mobile Jetting Skids", "Root-Saw Rotary Nozzles", "Fiberglass Push Rods"],
      description: "Clears choked kitchen, bathroom, and compound stormwater pipelines using purely high-pressure water streams without harsh corroding chemicals.",
      verificationTips: [
        "Ensure water pressure is regulated to avoid damaging fragile PVC pipes",
        "Do not allow untreated chemical drain cleaners to be dumped into municipal lines",
        "Check that technician provides a flow test after jetting completion"
      ]
    },
    {
      id: "comp-5",
      name: "Kaveri Stormwater & Pipeline Solutions",
      speciality: "Gully Chamber Slabs & Stormwater Channel Upgrades",
      state: "Tamil Nadu",
      city: "Chennai",
      categories: ["Stormwater drain maintenance", "Drainage pipe installation", "Sewer line repair"],
      services: ["SFRC manhole cover fitting", "Stormwater channel restoration", "Compound slope re-grading", "Perimeter drain mesh installation"],
      priceRange: "₹3,000 – ₹7,500",
      minPrice: 3000,
      maxPrice: 7500,
      sampleRating: "4.8 / 5.0 (Sample)",
      reviewCount: "51 demo reviews",
      availability: "Mon–Sat, 7 AM–7 PM (Demo)",
      phone: "+91 98765 01005 (Demo Only)",
      email: "projects@demo-kaverisystems.in",
      address: "Velachery Main Road, Chennai, Tamil Nadu",
      equipment: ["Precast Concrete Slab Lifters", "Masonry Trench Grinders", "Laser Levelling Instruments"],
      description: "Specializes in civil masonry repairs, replacing broken roadside inspection chamber lids with anti-theft heavy-duty composite slabs.",
      verificationTips: [
        "Verify load class of manhole covers (Light, Medium, or Heavy Duty)",
        "Inspect mortar sealing around inspection frame collars",
        "Insist on warning safety cones around work areas during setting"
      ]
    },
    {
      id: "comp-6",
      name: "Deccan Dewatering & Underground Works",
      speciality: "Subterranean Pipe Laying & Emergency Pumping",
      state: "Telangana",
      city: "Hyderabad",
      categories: ["Pumping and water removal", "Drainage pipe installation", "Waterlogging removal"],
      services: ["Emergency sump pumping", "HDPE drainage pipe trenching", "Rainwater catchment piping", "Basement flood prevention valves"],
      priceRange: "₹2,200 – ₹5,800",
      minPrice: 2200,
      maxPrice: 5800,
      sampleRating: "4.7 / 5.0 (Sample)",
      reviewCount: "37 demo reviews",
      availability: "24/7 On-Call (Demo)",
      phone: "+91 98765 01006 (Demo Only)",
      email: "hyd@demo-deccandrain.in",
      address: "Kukatpally Housing Board Colony, Hyderabad, Telangana",
      equipment: ["Heavy Duty Trench Diggers", "Butt-Fusion HDPE Pipe Welders", "Sludge Sump Vacuums"],
      description: "Installs non-return flap valves that prevent municipal sewage backflow during monsoon cloudbursts in residential communities.",
      verificationTips: [
        "Ensure backflow check valves are tested with clean water before sealing",
        "Check manufacturer warranty on installed HDPE piping materials",
        "Request gradient calculation for gravity drainage lines"
      ]
    },
    {
      id: "comp-7",
      name: "GangaBasin Drain Care & Vacuum Desilting",
      speciality: "Vacuum Tanker Desilting & Sewage Extraction",
      state: "West Bengal",
      city: "Kolkata",
      categories: ["Drain cleaning", "Sewer line repair", "Emergency drainage services"],
      services: ["Vacuum septic & sewer tanker", "Culvert sediment suction", "Chamber gas testing & desilting", "Emergency spill cleanup"],
      priceRange: "₹2,000 – ₹4,800",
      minPrice: 2000,
      maxPrice: 4800,
      sampleRating: "4.6 / 5.0 (Sample)",
      reviewCount: "44 demo reviews",
      availability: "Available Daily (Demo)",
      phone: "+91 98765 01007 (Demo Only)",
      email: "info@demo-gangadrain.in",
      address: "Salt Lake Sector V, Kolkata, West Bengal",
      equipment: ["6000L Vacuum Super-Sucker Tanker", "Multi-Gas Atmospheric Monitors", "Hydraulic Hose Booms"],
      description: "Utilizes mechanized suction tankers to extract thick sewage mud and silt from choked residential manholes without hazardous manual entry.",
      verificationTips: [
        "Strictly ensure no worker enters the chamber manually; insist on mechanical suction only",
        "Verify that extraction trucks dispose waste at authorized municipal dumping yards",
        "Check that vehicle access is cleared prior to tanker arrival"
      ]
    },
    {
      id: "comp-8",
      name: "Sabarmati Civic Pipe Works",
      speciality: "Drainage Conduit Trenching & Sump Repair",
      state: "Gujarat",
      city: "Ahmedabad",
      categories: ["Drainage pipe installation", "Drain inspection", "Drain cleaning"],
      services: ["Underground pipe replacement", "Culvert gradient correction", "Manhole frame leveling", "Internal pipe camera audits"],
      priceRange: "₹1,800 – ₹4,200",
      minPrice: 1800,
      maxPrice: 4200,
      sampleRating: "4.5 / 5.0 (Sample)",
      reviewCount: "22 demo reviews",
      availability: "Mon–Sat, 8 AM–6 PM (Demo)",
      phone: "+91 98765 01008 (Demo Only)",
      email: "contact@demo-sabarmatipipe.in",
      address: "SG Highway, Prahlad Nagar, Ahmedabad, Gujarat",
      equipment: ["Rotary Pipe Scrubbers", "Concrete Pipe Coring Drills", "Inspection Camera Snakes"],
      description: "Expert plumbing contractors for housing societies experiencing repeated underground waterlogging due to backward-sloping drains.",
      verificationTips: [
        "Require contractor to verify pipe slope using a spirit level or laser guide",
        "Confirm pipe joints are sealed with rubber gaskets or solvent cement",
        "Never pay 100% upfront before water testing flow"
      ]
    },
    {
      id: "comp-9",
      name: "Coastal Monsoon Drainage Responders",
      speciality: "Coastal Inundation & High Water Table Dewatering",
      state: "Kerala",
      city: "Kochi",
      categories: ["Waterlogging removal", "Pumping and water removal", "Emergency drainage services"],
      services: ["High water table dewatering", "Saltwater-resistant pump leasing", "Surface water canal skimming", "Compound bund reinforcement"],
      priceRange: "₹2,600 – ₹6,200",
      minPrice: 2600,
      maxPrice: 6200,
      sampleRating: "4.9 / 5.0 (Sample)",
      reviewCount: "63 demo reviews",
      availability: "24/7 Monsoon Ready (Demo)",
      phone: "+91 98765 01009 (Demo Only)",
      email: "relief@demo-coastaldrain.in",
      address: "Marine Drive, Ernakulam, Kochi, Kerala",
      equipment: ["Stainless Steel Marine Dewatering Pumps", "Heavy Duty Float Switches", "Sandbag Spill Bunds"],
      description: "Specialized in managing high tide water backflow and heavy monsoon rain accumulation in coastal residential colonies.",
      verificationTips: [
        "Check that pumps feature automatic float shutoff switches to prevent motor burnout",
        "Confirm electrical connections are weatherproofed against moisture",
        "Ensure backflow check valves withstand coastal salinity"
      ]
    },
    {
      id: "comp-10",
      name: "PinkCity Pipeline & Sump Care",
      speciality: "Dry-Well Installation & Sump Cleaning",
      state: "Rajasthan",
      city: "Jaipur",
      categories: ["Drain cleaning", "Stormwater drain maintenance", "Drain inspection"],
      services: ["Rainwater recharge well clearing", "Storm drain desilting", "High pressure pipeline jetting", "Sump vacuuming"],
      priceRange: "₹1,400 – ₹3,200",
      minPrice: 1400,
      maxPrice: 3200,
      sampleRating: "4.7 / 5.0 (Sample)",
      reviewCount: "31 demo reviews",
      availability: "Available Tomorrow (Demo)",
      phone: "+91 98765 01010 (Demo Only)",
      email: "hello@demo-pinkcitydrain.in",
      address: "Malviya Nagar, Jaipur, Rajasthan",
      equipment: ["Recharge Well Desilting Augers", "High Pressure Jetting Hose", "Submersible Sump Sludge Extractors"],
      description: "Cleans rainwater harvesting recharge pits and clogged stormwater drains to ensure fast percolation during flash desert cloudbursts.",
      verificationTips: [
        "Ensure recharge filter media (gravel and sand layers) is inspected and cleaned",
        "Verify clear separation between stormwater and sewage lines",
        "Inspect silt trap chambers annually before the arrival of the monsoon"
      ]
    },
    {
      id: "comp-11",
      name: "Awadh Sewer Line Tech",
      speciality: "Sewer Line Restoration & Mechanical Rodding",
      state: "Uttar Pradesh",
      city: "Lucknow",
      categories: ["Sewer line repair", "Drain cleaning", "Emergency drainage services"],
      services: ["Mechanical cable rodding", "Sewer line descaling", "Compound outlet unblocking", "Emergency sewer overflow containment"],
      priceRange: "₹1,600 – ₹3,900",
      minPrice: 1600,
      maxPrice: 3900,
      sampleRating: "4.6 / 5.0 (Sample)",
      reviewCount: "27 demo reviews",
      availability: "Daily 8 AM–9 PM (Demo)",
      phone: "+91 98765 01011 (Demo Only)",
      email: "service@demo-awadhsewer.in",
      address: "Gomti Nagar Extension, Lucknow, Uttar Pradesh",
      equipment: ["Heavy Duty Motorized Rodding Machine", "Spiral Cutter Bits", "Bio-Enzymatic Grease Degreasers"],
      description: "Cleans stubborn sewer lines clogged with calcified grease and tree roots using mechanized rod cutters that protect pipeline walls.",
      verificationTips: [
        "Request inspection of the extracted blockage debris to understand cause",
        "Avoid letting contractors push blockages into main municipal line without collection",
        "Confirm written receipt detailing labor and machine rental rates"
      ]
    },
    {
      id: "comp-12",
      name: "Shivalik Storm Drain & Pipe Works",
      speciality: "Hilly Terrain Runoff Management & Pipe Relaying",
      state: "Chandigarh",
      city: "Chandigarh",
      categories: ["Stormwater drain maintenance", "Drainage pipe installation", "Waterlogging removal"],
      services: ["Retaining wall weep hole clearing", "Slope storm channel lining", "Precast perforated drain pipes", "High discharge sump cleaning"],
      priceRange: "₹2,200 – ₹5,000",
      minPrice: 2200,
      maxPrice: 5000,
      sampleRating: "4.8 / 5.0 (Sample)",
      reviewCount: "38 demo reviews",
      availability: "Mon–Sun 8 AM–7 PM (Demo)",
      phone: "+91 98765 01012 (Demo Only)",
      email: "ops@demo-shivalikdrain.in",
      address: "Industrial Area Phase 1, Chandigarh",
      equipment: ["Weep Hole Flush Jets", "Perforated Corrugated Pipe Cutters", "Concrete Channel Formers"],
      description: "Specialized in clearing high-velocity stormwater runoffs, slope channels, and weep holes that protect retaining walls from hydrostatic pressure.",
      verificationTips: [
        "Ensure hillside weep holes have gravel geotextile backing to prevent silt clogging",
        "Verify channel gradients to avoid stagnant standing water near structures",
        "Ask for a post-monsoon inspection guarantee"
      ]
    }
  ];

  // Demo Seed Reports for Initial Load (if localStorage is empty)
  const SEED_REPORTS = [
    {
      id: "DF-2026-1042",
      problemType: "Overflowing drainage after rain",
      state: "Karnataka",
      city: "Bengaluru",
      locality: "Indiranagar 12th Main, Near Metro Pillar 140",
      severity: "High",
      timeStarted: "Earlier today after rain",
      fullName: "Ananya Rao",
      phone: "9876543210",
      photoData: null,
      description: "Stormwater drain running in front of houses is completely choked with silt and plastic bottles. Water has risen to ankle level and is threatening to enter parking basements.",
      dateSubmitted: "14 Oct 2026, 04:30 PM",
      timestamp: Date.now() - 86400000,
      status: "Under Review (simulated)"
    },
    {
      id: "DF-2026-1089",
      problemType: "Sewage water coming outside",
      state: "Maharashtra",
      city: "Mumbai",
      locality: "Andheri East, Near Railway Crossing Gate 3",
      severity: "Emergency",
      timeStarted: "2-4 hours ago",
      fullName: "Vikram Malhotra",
      phone: "9812345678",
      photoData: null,
      description: "Chamber lid has dislodged and foul-smelling blackwater is bubbling onto the main pedestrian footpath. Strong hydrogen sulfide odor and pedestrians are forced onto oncoming vehicle lanes.",
      dateSubmitted: "15 Oct 2026, 08:15 AM",
      timestamp: Date.now() - 7200000,
      status: "Service Recommended (simulated)"
    }
  ];

  const STORAGE_KEY = "drainagefix_reports_demo";

  /* ============================================================================
     2. DOM ELEMENT REFERENCES
     ============================================================================ */
  let dom = {};

  function cacheDomElements() {
    dom = {
      // Header & Navigation
      navMenu: document.getElementById("navMenu"),
      menuToggle: document.getElementById("menuToggle"),
      navLinks: document.querySelectorAll(".nav-link"),
      navReportsCount: document.getElementById("navReportsCount"),

      // Hero Mini Matcher
      heroProblemSelect: document.getElementById("heroProblemSelect"),
      heroMatchBtn: document.getElementById("heroMatchBtn"),
      heroMatchResult: document.getElementById("heroMatchResult"),

      // Common Problems Cards
      problemLinks: document.querySelectorAll(".problem-link"),

      // Smart Matcher
      matcherForm: document.getElementById("matcherForm"),
      matchProblemSelect: document.getElementById("matchProblemSelect"),
      matchStateSelect: document.getElementById("matchStateSelect"),
      matchCityInput: document.getElementById("matchCityInput"),
      matcherResultCard: document.getElementById("matcherResultCard"),
      matchCategoryTitle: document.getElementById("matchCategoryTitle"),
      matchExplanation: document.getElementById("matchExplanation"),
      matchBadgesContainer: document.getElementById("matchBadgesContainer"),
      matchedCompanyCount: document.getElementById("matchedCompanyCount"),
      matchScrollToCompaniesBtn: document.getElementById("matchScrollToCompaniesBtn"),
      matchPreFillReportBtn: document.getElementById("matchPreFillReportBtn"),

      // Report Form
      reportForm: document.getElementById("drainageReportForm"),
      reportProblemType: document.getElementById("reportProblemType"),
      reportState: document.getElementById("reportState"),
      reportCity: document.getElementById("reportCity"),
      reportLocality: document.getElementById("reportLocality"),
      reportTimeStarted: document.getElementById("reportTimeStarted"),
      reportFullName: document.getElementById("reportFullName"),
      reportPhone: document.getElementById("reportPhone"),
      reportPhotoInput: document.getElementById("reportPhotoInput"),
      photoPreviewContainer: document.getElementById("photoPreviewContainer"),
      photoPreviewImg: document.getElementById("photoPreviewImg"),
      removePhotoBtn: document.getElementById("removePhotoBtn"),
      reportDescription: document.getElementById("reportDescription"),

      // Companies Directory & Filters
      companiesGrid: document.getElementById("companiesGrid"),
      companySearchInput: document.getElementById("companySearchInput"),
      filterState: document.getElementById("filterState"),
      filterCity: document.getElementById("filterCity"),
      filterCategory: document.getElementById("filterCategory"),
      filterBudget: document.getElementById("filterBudget"),
      resetFiltersBtn: document.getElementById("resetFiltersBtn"),
      companyCountDisplay: document.getElementById("companyCountDisplay"),
      activeFilterPills: document.getElementById("activeFilterPills"),
      companiesEmptyState: document.getElementById("companiesEmptyState"),

      // Dashboard
      reportsTableBody: document.getElementById("reportsTableBody"),
      reportsEmptyState: document.getElementById("reportsEmptyState"),
      reportsTable: document.getElementById("reportsTable"),
      dashFilterStatus: document.getElementById("dashFilterStatus"),
      dashFilterSeverity: document.getElementById("dashFilterSeverity"),
      dashFilterProblem: document.getElementById("dashFilterProblem"),
      resetDashFiltersBtn: document.getElementById("resetDashFiltersBtn"),
      clearAllReportsBtn: document.getElementById("clearAllReportsBtn"),

      // Modals
      companyModal: document.getElementById("companyModal"),
      modalCompanySpeciality: document.getElementById("modalCompanySpeciality"),
      modalCompanyName: document.getElementById("modalCompanyName"),
      modalCompanyBody: document.getElementById("modalCompanyBody"),
      closeCompanyModalBtn: document.getElementById("closeCompanyModalBtn"),
      modalCloseActionBtn: document.getElementById("modalCloseActionBtn"),
      modalContactActionBtn: document.getElementById("modalContactActionBtn"),

      contactModal: document.getElementById("contactModal"),
      contactModalTitle: document.getElementById("contactModalTitle"),
      contactModalBody: document.getElementById("contactModalBody"),
      closeContactModalBtn: document.getElementById("closeContactModalBtn"),
      closeContactConfirmBtn: document.getElementById("closeContactConfirmBtn"),

      reportDetailsModal: document.getElementById("reportDetailsModal"),
      reportModalTrackingId: document.getElementById("reportModalTrackingId"),
      reportModalTitle: document.getElementById("reportModalTitle"),
      reportModalBody: document.getElementById("reportModalBody"),
      closeReportDetailsBtn: document.getElementById("closeReportDetailsBtn"),
      closeReportDetailsActionBtn: document.getElementById("closeReportDetailsActionBtn"),
      reportFindMatchingCompanyBtn: document.getElementById("reportFindMatchingCompanyBtn"),

      deleteConfirmModal: document.getElementById("deleteConfirmModal"),
      deleteConfirmMessage: document.getElementById("deleteConfirmMessage"),
      closeDeleteModalBtn: document.getElementById("closeDeleteModalBtn"),
      cancelDeleteBtn: document.getElementById("cancelDeleteBtn"),
      confirmDeleteActionBtn: document.getElementById("confirmDeleteActionBtn"),

      reportSuccessModal: document.getElementById("reportSuccessModal"),
      successTrackingId: document.getElementById("successTrackingId"),
      successViewDashboardBtn: document.getElementById("successViewDashboardBtn"),
      successViewMatchingCompaniesBtn: document.getElementById("successViewMatchingCompaniesBtn"),

      toastContainer: document.getElementById("toastContainer")
    };
  }

  /* ============================================================================
     3. LOCAL STORAGE MANAGEMENT (DEMO DATA PERSISTENCE)
     ============================================================================ */

  // Retrieve reports array from localStorage with fallback to sample seed
  function getReports() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with realistic seed demonstration records
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REPORTS));
        return [...SEED_REPORTS];
      }
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Unable to access localStorage:", e);
      return [...SEED_REPORTS];
    }
  }

  // Save reports array to localStorage
  function saveReports(reports) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error("Failed to save report to localStorage:", e);
      showToast("Storage quota exceeded or private mode active.", "warning");
    }
    updateNavBadge();
  }

  // Update navbar report count badge
  function updateNavBadge() {
    const reports = getReports();
    if (dom.navReportsCount) {
      dom.navReportsCount.textContent = reports.length;
    }
  }

  /* ============================================================================
     4. POPULATE SELECTS (STATES & CITIES)
     ============================================================================ */
  function populateStateDropdowns() {
    const stateSelects = [dom.reportState, dom.matchStateSelect, dom.filterState];

    stateSelects.forEach((selectEl) => {
      if (!selectEl) return;
      // Preserve first placeholder option
      const firstOption = selectEl.options[0];
      selectEl.innerHTML = "";
      if (firstOption) selectEl.appendChild(firstOption);

      INDIAN_STATES_AND_UTS.forEach((stateName) => {
        const opt = document.createElement("option");
        opt.value = stateName;
        opt.textContent = stateName;
        selectEl.appendChild(opt);
      });
    });
  }

  function populateCompanyCityFilter() {
    if (!dom.filterCity) return;
    // Extract unique cities from sample companies
    const cities = Array.from(new Set(SAMPLE_COMPANIES.map((c) => c.city))).sort();
    dom.filterCity.innerHTML = '<option value="">All Cities</option>';
    cities.forEach((city) => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      dom.filterCity.appendChild(opt);
    });
  }

  /* ============================================================================
     5. TOAST NOTIFICATIONS
     ============================================================================ */
  function showToast(message, type = "info") {
    if (!dom.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `<span>${icon}</span> <div>${escapeHtml(message)}</div>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }

  /* ============================================================================
     6. ESCAPE UTILITY (XSS PROTECTION)
     ============================================================================ */
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ============================================================================
     7. HERO MINI MATCH SIMULATOR
     ============================================================================ */
  function initHeroMiniMatch() {
    if (!dom.heroMatchBtn || !dom.heroProblemSelect) return;

    const quickMap = {
      overflow: "Stormwater Drain Maintenance & High-Volume Dewatering",
      blocked: "Drain Cleaning via Hydro-Jetting & CCTV Inspection",
      waterlog: "Emergency Dewatering & Silt Gully Extraction",
      sewage: "Sewer Line Repair & Mechanized Vacuum Suction",
      stagnant: "Drain Cleaning & Sump Drainage Prevention"
    };

    dom.heroMatchBtn.addEventListener("click", () => {
      const val = dom.heroProblemSelect.value;
      const rec = quickMap[val] || "General Civic Drainage Maintenance";
      dom.heroMatchResult.innerHTML = `<span class="recommend-tag">Recommended:</span> ${rec}`;
      dom.heroMatchResult.style.animation = "none";
      dom.heroMatchResult.offsetHeight; // trigger reflow
      dom.heroMatchResult.style.animation = "fadeIn 0.3s ease-in-out";
    });
  }

  /* ============================================================================
     8. SMART PROBLEM-TO-SERVICE MATCHING ENGINE
     ============================================================================ */
  let lastMatchedCategory = "";

  function handleMatcherSubmit(e) {
    e.preventDefault();
    const problem = dom.matchProblemSelect.value;
    const state = dom.matchStateSelect.value;
    const city = dom.matchCityInput.value.trim().toLowerCase();

    if (!problem) {
      showToast("Please choose a drainage problem to analyze.", "warning");
      return;
    }

    const matchData = PROBLEM_MATCHING_RULES[problem] || {
      category: "Emergency drainage services",
      secondary: "Drain inspection",
      explanation: "Comprehensive diagnostic survey required by experienced drainage technicians.",
      equipment: ["Inspection Camera", "Pressure Test Kits"],
      urgency: "Medium"
    };

    lastMatchedCategory = matchData.category;
    dom.matchCategoryTitle.textContent = matchData.category;
    dom.matchExplanation.textContent = matchData.explanation;

    // Badges
    dom.matchBadgesContainer.innerHTML = `
      <span class="spec-badge">Primary: ${escapeHtml(matchData.category)}</span>
      <span class="spec-badge">Secondary: ${escapeHtml(matchData.secondary)}</span>
      <span class="spec-badge">Urgency: ${escapeHtml(matchData.urgency)}</span>
    `;

    // Calculate matching demo companies
    const matchingCompanies = SAMPLE_COMPANIES.filter((comp) => {
      const catMatch = comp.categories.includes(matchData.category) || comp.categories.includes(matchData.secondary);
      const stateMatch = !state || comp.state.toLowerCase() === state.toLowerCase();
      const cityMatch = !city || comp.city.toLowerCase().includes(city);
      return catMatch && (stateMatch || cityMatch || true); // soft match to ensure demonstration results
    });

    dom.matchedCompanyCount.textContent = matchingCompanies.length;
    dom.matcherResultCard.classList.remove("hidden");
    dom.matcherResultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function setupMatcherActions() {
    if (dom.matchScrollToCompaniesBtn) {
      dom.matchScrollToCompaniesBtn.addEventListener("click", () => {
        // Pre-set company filter to this category and state
        if (lastMatchedCategory && dom.filterCategory) {
          dom.filterCategory.value = lastMatchedCategory;
        }
        if (dom.matchStateSelect.value && dom.filterState) {
          dom.filterState.value = dom.matchStateSelect.value;
        }
        renderCompanies();
        document.getElementById("companies-section").scrollIntoView({ behavior: "smooth" });
        showToast(`Filtered companies for "${lastMatchedCategory}"`, "info");
      });
    }

    if (dom.matchPreFillReportBtn) {
      dom.matchPreFillReportBtn.addEventListener("click", () => {
        if (dom.matchProblemSelect.value && dom.reportProblemType) {
          dom.reportProblemType.value = dom.matchProblemSelect.value;
        }
        if (dom.matchStateSelect.value && dom.reportState) {
          dom.reportState.value = dom.matchStateSelect.value;
        }
        if (dom.matchCityInput.value && dom.reportCity) {
          dom.reportCity.value = dom.matchCityInput.value;
        }
        document.getElementById("report-section").scrollIntoView({ behavior: "smooth" });
        showToast("Prefilled report form with matched parameters.", "info");
      });
    }
  }

  /* ============================================================================
     9. COMMON PROBLEM CARDS QUICK ACTION
     ============================================================================ */
  function setupProblemCardLinks() {
    dom.problemLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const prob = link.getAttribute("data-problem");
        if (prob && dom.reportProblemType) {
          dom.reportProblemType.value = prob;
          showToast(`Selected "${prob}" in the report form.`, "info");
        }
      });
    });
  }

  /* ============================================================================
     10. REPORT FORM HANDLING & LOCALSTORAGE
     ============================================================================ */
  let currentUploadedPhotoData = null;

  // Handle Photo Preview with FileReader
  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) {
      clearPhotoPreview();
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (JPG, PNG).", "warning");
      clearPhotoPreview();
      return;
    }

    // Limit to 2MB for localStorage health
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image is larger than 2MB. Please choose a smaller photo.", "warning");
      clearPhotoPreview();
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      currentUploadedPhotoData = event.target.result;
      dom.photoPreviewImg.src = currentUploadedPhotoData;
      dom.photoPreviewContainer.classList.remove("hidden");
    };
    reader.onerror = function () {
      showToast("Error reading selected photo file.", "warning");
      clearPhotoPreview();
    };
    reader.readAsDataURL(file);
  }

  function clearPhotoPreview() {
    currentUploadedPhotoData = null;
    if (dom.reportPhotoInput) dom.reportPhotoInput.value = "";
    if (dom.photoPreviewImg) dom.photoPreviewImg.src = "";
    if (dom.photoPreviewContainer) dom.photoPreviewContainer.classList.add("hidden");
  }

  // Validate and submit report form
  function handleReportSubmit(e) {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll(".field-error").forEach((el) => el.classList.remove("visible"));
    document.querySelectorAll(".form-control").forEach((el) => el.classList.remove("has-error"));

    let isValid = true;

    // Validate Problem Type
    if (!dom.reportProblemType.value) {
      markFieldError("reportProblemType", "Please choose a drainage problem type.");
      isValid = false;
    }

    // Validate State
    if (!dom.reportState.value) {
      markFieldError("reportState", "Please select an Indian state or UT.");
      isValid = false;
    }

    // Validate City
    if (!dom.reportCity.value.trim()) {
      markFieldError("reportCity", "Please specify your city or town.");
      isValid = false;
    }

    // Validate Locality
    if (!dom.reportLocality.value.trim()) {
      markFieldError("reportLocality", "Please provide your area or landmark.");
      isValid = false;
    }

    // Validate Severity
    const severityRadio = document.querySelector('input[name="severity"]:checked');
    if (!severityRadio) {
      const errEl = document.getElementById("err-severity");
      if (errEl) errEl.classList.add("visible");
      isValid = false;
    }

    // Validate Time Started
    if (!dom.reportTimeStarted.value) {
      markFieldError("reportTimeStarted", "Please specify when the issue started.");
      isValid = false;
    }

    // Validate Description
    const descText = dom.reportDescription.value.trim();
    if (!descText || descText.length < 15) {
      markFieldError("reportDescription", "Please provide a clear description (at least 15 characters).");
      isValid = false;
    }

    // Optional Phone validation
    const phoneVal = dom.reportPhone.value.trim();
    if (phoneVal && !/^[0-9]{10}$/.test(phoneVal)) {
      showToast("Optional phone must be a 10-digit mobile number.", "warning");
      dom.reportPhone.classList.add("has-error");
      isValid = false;
    }

    if (!isValid) {
      showToast("Please correct the highlighted fields before submitting.", "warning");
      return;
    }

    // Generate unique Demo Report Tracking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReportId = `DF-2026-${randomSuffix}`;

    const newReport = {
      id: newReportId,
      problemType: dom.reportProblemType.value,
      state: dom.reportState.value,
      city: dom.reportCity.value.trim(),
      locality: dom.reportLocality.value.trim(),
      severity: severityRadio ? severityRadio.value : "High",
      timeStarted: dom.reportTimeStarted.value,
      fullName: dom.reportFullName.value.trim() || "Anonymous Citizen",
      phone: phoneVal || "Not provided",
      photoData: currentUploadedPhotoData,
      description: descText,
      dateSubmitted: formatCurrentDate(),
      timestamp: Date.now(),
      status: "Submitted (local demo)"
    };

    // Save into localStorage
    const reports = getReports();
    reports.unshift(newReport);
    saveReports(reports);

    // Refresh Dashboard Table
    renderReportsTable();

    // Show Success Modal
    openSuccessModal(newReport);

    // Reset Form
    dom.reportForm.reset();
    clearPhotoPreview();

    // Re-check High as default severity
    const highRadio = document.querySelector('input[name="severity"][value="High"]');
    if (highRadio) highRadio.checked = true;

    showToast(`Demo Report #${newReportId} saved to browser storage!`, "success");
  }

  function markFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(`err-${fieldId}`);
    if (field) field.classList.add("has-error");
    if (err) {
      if (message) err.textContent = message;
      err.classList.add("visible");
    }
  }

  function formatCurrentDate() {
    const d = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(d.getDate()).padStart(2, "0");
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year}, ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  }

  /* ============================================================================
     11. FIND DRAINAGE COMPANIES (DIRECTORY & FILTERS)
     ============================================================================ */
  function renderCompanies() {
    if (!dom.companiesGrid) return;

    const searchTerm = dom.companySearchInput.value.trim().toLowerCase();
    const selectedState = dom.filterState.value;
    const selectedCity = dom.filterCity.value;
    const selectedCategory = dom.filterCategory.value;
    const selectedBudget = dom.filterBudget.value;

    const filtered = SAMPLE_COMPANIES.filter((comp) => {
      // Search matching name, services, equipment, or speciality
      if (searchTerm) {
        const hay = `${comp.name} ${comp.speciality} ${comp.services.join(" ")} ${comp.equipment.join(" ")} ${comp.city} ${comp.state}`.toLowerCase();
        if (!hay.includes(searchTerm)) return false;
      }

      // State Filter
      if (selectedState && comp.state !== selectedState) {
        return false;
      }

      // City Filter
      if (selectedCity && comp.city !== selectedCity) {
        return false;
      }

      // Category Filter
      if (selectedCategory && !comp.categories.includes(selectedCategory)) {
        return false;
      }

      // Budget Range Filter
      if (selectedBudget) {
        if (selectedBudget === "under2000" && comp.maxPrice > 2000) return false;
        if (selectedBudget === "2000-4000" && (comp.minPrice > 4000 || comp.maxPrice < 2000)) return false;
        if (selectedBudget === "4000-7000" && (comp.minPrice > 7000 || comp.maxPrice < 4000)) return false;
        if (selectedBudget === "above7000" && comp.maxPrice < 7000) return false;
      }

      return true;
    });

    // Update count display
    if (dom.companyCountDisplay) {
      dom.companyCountDisplay.textContent = `Showing ${filtered.length} of ${SAMPLE_COMPANIES.length} sample providers`;
    }

    // Active filter pills
    updateActiveFilterPills(selectedState, selectedCity, selectedCategory, selectedBudget, searchTerm);

    // Render Grid
    dom.companiesGrid.innerHTML = "";

    if (filtered.length === 0) {
      dom.companiesEmptyState.classList.remove("hidden");
      return;
    }

    dom.companiesEmptyState.classList.add("hidden");

    filtered.forEach((company) => {
      const card = document.createElement("article");
      card.className = "company-card";

      // Services tags preview (first 3)
      const serviceTags = company.services
        .slice(0, 3)
        .map((s) => `<span class="service-tag">${escapeHtml(s)}</span>`)
        .join("");

      card.innerHTML = `
        <div class="company-card-header">
          <div class="company-logo-placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="company-title-wrap">
            <h3 class="company-name">${escapeHtml(company.name)}</h3>
            <span class="company-speciality">${escapeHtml(company.speciality)}</span>
            <div class="company-location-badge">
              <span>📍</span> ${escapeHtml(company.city)}, ${escapeHtml(company.state)}
            </div>
          </div>
        </div>

        <div class="company-demo-warning">
          Demo Listing — Verify Before Hiring
        </div>

        <div class="company-services-list">
          ${serviceTags}
        </div>

        <div class="company-meta-grid">
          <div>
            <span class="meta-item-label">Indicative Pricing</span>
            <span class="meta-item-value">${escapeHtml(company.priceRange)}</span>
          </div>
          <div>
            <span class="meta-item-label">Rating (Sample)</span>
            <span class="meta-item-value meta-rating">★ ${escapeHtml(company.sampleRating)}</span>
          </div>
          <div>
            <span class="meta-item-label">Status</span>
            <span class="meta-item-value meta-avail-demo">${escapeHtml(company.availability)}</span>
          </div>
          <div>
            <span class="meta-item-label">Reviews</span>
            <span class="meta-item-value">${escapeHtml(company.reviewCount)}</span>
          </div>
        </div>

        <div class="company-card-actions">
          <button type="button" class="btn btn-outline btn-sm view-company-details-btn" data-id="${company.id}">
            View Details
          </button>
          <button type="button" class="btn btn-primary btn-sm contact-company-btn" data-id="${company.id}">
            Contact (Demo)
          </button>
        </div>
      `;

      dom.companiesGrid.appendChild(card);
    });

    // Attach Event Listeners to rendered buttons
    dom.companiesGrid.querySelectorAll(".view-company-details-btn").forEach((btn) => {
      btn.addEventListener("click", () => openCompanyModal(btn.getAttribute("data-id")));
    });

    dom.companiesGrid.querySelectorAll(".contact-company-btn").forEach((btn) => {
      btn.addEventListener("click", () => openContactModal(btn.getAttribute("data-id")));
    });
  }

  function updateActiveFilterPills(state, city, category, budget, search) {
    if (!dom.activeFilterPills) return;
    const pills = [];
    if (state) pills.push(`State: ${state}`);
    if (city) pills.push(`City: ${city}`);
    if (category) pills.push(`Category: ${category}`);
    if (budget) pills.push(`Budget: Active`);
    if (search) pills.push(`Search: "${search}"`);

    dom.activeFilterPills.innerHTML = pills
      .map((p) => `<span class="filter-tag-pill">${escapeHtml(p)}</span>`)
      .join("");
  }

  function resetCompanyFilters() {
    if (dom.companySearchInput) dom.companySearchInput.value = "";
    if (dom.filterState) dom.filterState.value = "";
    if (dom.filterCity) dom.filterCity.value = "";
    if (dom.filterCategory) dom.filterCategory.value = "";
    if (dom.filterBudget) dom.filterBudget.value = "";
    renderCompanies();
    showToast("Filters reset to default view.", "info");
  }

  /* ============================================================================
     12. DASHBOARD: SAVED DEMO REPORTS (MY REPORTS)
     ============================================================================ */
  function renderReportsTable() {
    if (!dom.reportsTableBody) return;

    const reports = getReports();
    const filterStatus = dom.dashFilterStatus ? dom.dashFilterStatus.value : "";
    const filterSeverity = dom.dashFilterSeverity ? dom.dashFilterSeverity.value : "";
    const filterProblem = dom.dashFilterProblem ? dom.dashFilterProblem.value : "";

    const filtered = reports.filter((rep) => {
      if (filterStatus && rep.status !== filterStatus) return false;
      if (filterSeverity && rep.severity !== filterSeverity) return false;
      if (filterProblem && rep.problemType !== filterProblem) return false;
      return true;
    });

    dom.reportsTableBody.innerHTML = "";

    if (filtered.length === 0) {
      dom.reportsTable.classList.add("hidden");
      dom.reportsEmptyState.classList.remove("hidden");
      return;
    }

    dom.reportsTable.classList.remove("hidden");
    dom.reportsEmptyState.classList.add("hidden");

    filtered.forEach((rep) => {
      const tr = document.createElement("tr");

      // Severity Class
      let sevClass = "badge-low";
      if (rep.severity === "Medium") sevClass = "badge-medium";
      if (rep.severity === "High") sevClass = "badge-high";
      if (rep.severity === "Emergency") sevClass = "badge-emergency";

      // Status Class
      let statusClass = "status-submitted";
      if (rep.status.includes("Review")) statusClass = "status-review";
      if (rep.status.includes("Recommended")) statusClass = "status-recommended";
      if (rep.status.includes("Resolved")) statusClass = "status-resolved";

      tr.innerHTML = `
        <td>
          <span class="tracking-code">${escapeHtml(rep.id)}</span>
        </td>
        <td>
          <strong>${escapeHtml(rep.problemType)}</strong>
          <div class="text-sm text-muted">${escapeHtml(rep.timeStarted || "")}</div>
        </td>
        <td>
          ${escapeHtml(rep.locality)},<br>
          <span class="text-muted">${escapeHtml(rep.city)}, ${escapeHtml(rep.state)}</span>
        </td>
        <td>
          <span class="text-sm">${escapeHtml(rep.dateSubmitted)}</span>
        </td>
        <td>
          <span class="problem-badge ${sevClass}">${escapeHtml(rep.severity)}</span>
        </td>
        <td>
          <span class="status-pill ${statusClass}">${escapeHtml(rep.status)}</span>
          <!-- Inline Demo Status Changer -->
          <select class="table-status-select" data-id="${rep.id}" aria-label="Change simulated status">
            <option value="Submitted (local demo)" ${rep.status === "Submitted (local demo)" ? "selected" : ""}>Submitted</option>
            <option value="Under Review (simulated)" ${rep.status === "Under Review (simulated)" ? "selected" : ""}>Under Review</option>
            <option value="Service Recommended (simulated)" ${rep.status === "Service Recommended (simulated)" ? "selected" : ""}>Service Recommended</option>
            <option value="Resolved (simulated)" ${rep.status === "Resolved (simulated)" ? "selected" : ""}>Resolved</option>
          </select>
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button type="button" class="btn-icon-action view-report-btn" data-id="${rep.id}" title="View Details">
              Inspect
            </button>
            <button type="button" class="btn-icon-action delete-action delete-report-btn" data-id="${rep.id}" title="Delete Report">
              Delete
            </button>
          </div>
        </td>
      `;

      dom.reportsTableBody.appendChild(tr);
    });

    // Event Listeners for inline status change
    dom.reportsTableBody.querySelectorAll(".table-status-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const id = select.getAttribute("data-id");
        const newStatus = e.target.value;
        updateReportStatus(id, newStatus);
      });
    });

    // Inspect Details
    dom.reportsTableBody.querySelectorAll(".view-report-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openReportDetailsModal(btn.getAttribute("data-id"));
      });
    });

    // Delete Button
    dom.reportsTableBody.querySelectorAll(".delete-report-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openDeleteConfirmModal(btn.getAttribute("data-id"));
      });
    });
  }

  function updateReportStatus(reportId, newStatus) {
    const reports = getReports();
    const index = reports.findIndex((r) => r.id === reportId);
    if (index !== -1) {
      reports[index].status = newStatus;
      saveReports(reports);
      renderReportsTable();
      showToast(`Status for ${reportId} updated to "${newStatus}" (Simulated)`, "info");
    }
  }

  function resetDashboardFilters() {
    if (dom.dashFilterStatus) dom.dashFilterStatus.value = "";
    if (dom.dashFilterSeverity) dom.dashFilterSeverity.value = "";
    if (dom.dashFilterProblem) dom.dashFilterProblem.value = "";
    renderReportsTable();
  }

  function clearAllReports() {
    if (confirm("Permanently delete ALL saved demonstration reports from your local browser?")) {
      saveReports([]);
      renderReportsTable();
      showToast("All demo reports removed from localStorage.", "info");
    }
  }

  /* ============================================================================
     13. MODALS LOGIC & DETAIL PANELS
     ============================================================================ */

  // A. Company Details Modal
  let activeModalCompany = null;

  function openCompanyModal(companyId) {
    const comp = SAMPLE_COMPANIES.find((c) => c.id === companyId);
    if (!comp) return;

    activeModalCompany = comp;
    dom.modalCompanyName.textContent = comp.name;
    dom.modalCompanySpeciality.textContent = comp.speciality;

    const servicesListHtml = comp.services.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
    const equipmentListHtml = comp.equipment.map((e) => `<li>${escapeHtml(e)}</li>`).join("");
    const checklistHtml = comp.verificationTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("");

    dom.modalCompanyBody.innerHTML = `
      <div class="modal-detail-section">
        <p><strong>Overview:</strong> ${escapeHtml(comp.description)}</p>
      </div>

      <div class="modal-detail-section">
        <h4 class="modal-section-title">Specialist Services Offered</h4>
        <ul class="checklist-ul">${servicesListHtml}</ul>
      </div>

      <div class="modal-detail-section">
        <h4 class="modal-section-title">Machinery &amp; Equipment Deployed</h4>
        <ul class="checklist-ul">${equipmentListHtml}</ul>
      </div>

      <div class="modal-detail-section">
        <div class="company-meta-grid" style="border-radius: 8px; background: #f8fafc; padding: 1rem;">
          <div>
            <span class="meta-item-label">Estimated Service Cost</span>
            <span class="meta-item-value">${escapeHtml(comp.priceRange)}</span>
          </div>
          <div>
            <span class="meta-item-label">Customer Rating</span>
            <span class="meta-item-value meta-rating">★ ${escapeHtml(comp.sampleRating)}</span>
          </div>
          <div>
            <span class="meta-item-label">Operating City</span>
            <span class="meta-item-value">${escapeHtml(comp.city)}, ${escapeHtml(comp.state)}</span>
          </div>
          <div>
            <span class="meta-item-label">Dispatch Status</span>
            <span class="meta-item-value meta-avail-demo">${escapeHtml(comp.availability)}</span>
          </div>
        </div>
      </div>

      <!-- Provider Verification Checklist Required by Specification -->
      <div class="verification-checklist-box">
        <div class="checklist-title">
          <span>🛡️</span> Mandatory Verification Checklist Before Hiring:
        </div>
        <ul class="checklist-ul">
          ${checklistHtml}
          <li>Never pay 100% advance before satisfactory on-site completion.</li>
          <li>Ensure workers possess required safety gear (harness, gumboots, masks).</li>
        </ul>
      </div>
    `;

    dom.companyModal.classList.remove("hidden");
  }

  function closeCompanyModal() {
    dom.companyModal.classList.add("hidden");
  }

  // B. Contact Simulation Modal
  function openContactModal(companyId) {
    const comp = SAMPLE_COMPANIES.find((c) => c.id === companyId) || activeModalCompany;
    if (!comp) return;

    dom.contactModalTitle.textContent = `Contact: ${comp.name}`;
    dom.contactModalBody.innerHTML = `
      <div class="modal-detail-section">
        <div class="civic-badge" style="margin-bottom: 0.75rem;">Simulated Contractor Dispatch</div>
        <p>You are viewing demonstration contact coordinates for <strong>${escapeHtml(comp.name)}</strong>:</p>
        <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>📞 Telephone:</strong> ${escapeHtml(comp.phone)}</p>
          <p><strong>✉️ Email:</strong> ${escapeHtml(comp.email)}</p>
          <p><strong>📍 Local Base:</strong> ${escapeHtml(comp.address)}</p>
          <p><strong>⏱️ Response Window:</strong> ${escapeHtml(comp.availability)}</p>
        </div>
        <div class="form-privacy-note">
          <strong>Important Safety Notice:</strong>
          DrainageFix is an educational simulator. The telephone and email contacts above are illustrative placeholders. Do not send monetary deposits or sensitive information to these addresses.
        </div>
      </div>
    `;

    // Close details modal if open
    closeCompanyModal();
    dom.contactModal.classList.remove("hidden");
  }

  function closeContactModal() {
    dom.contactModal.classList.add("hidden");
  }

  // C. View Report Details Modal
  let activeReportForModal = null;

  function openReportDetailsModal(reportId) {
    const reports = getReports();
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return;

    activeReportForModal = rep;
    dom.reportModalTrackingId.textContent = `Report Reference #${rep.id}`;
    dom.reportModalTitle.textContent = rep.problemType;

    let photoHtml = "";
    if (rep.photoData) {
      photoHtml = `
        <div class="modal-detail-section">
          <h4 class="modal-section-title">Submitted Photo Evidence</h4>
          <div style="max-height: 250px; overflow: hidden; border-radius: 8px; border: 1px solid #cbd5e1;">
            <img src="${rep.photoData}" alt="Uploaded drainage problem" style="width: 100%; height: auto; object-fit: contain;">
          </div>
        </div>
      `;
    }

    dom.reportModalBody.innerHTML = `
      <div class="modal-detail-section">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
          <span class="status-pill status-review">${escapeHtml(rep.status)}</span>
          <span class="problem-badge badge-high">${escapeHtml(rep.severity)} Priority</span>
          <span class="status-pill" style="background: #e2e8f0;">Logged: ${escapeHtml(rep.dateSubmitted)}</span>
        </div>
        <p><strong>Location:</strong> ${escapeHtml(rep.locality)}, ${escapeHtml(rep.city)}, ${escapeHtml(rep.state)}</p>
        <p><strong>Started:</strong> ${escapeHtml(rep.timeStarted)}</p>
        <p><strong>Reported By:</strong> ${escapeHtml(rep.fullName)} (Phone: ${escapeHtml(rep.phone)})</p>
      </div>

      <div class="modal-detail-section">
        <h4 class="modal-section-title">Citizen Incident Narrative</h4>
        <p style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.875rem;">
          "${escapeHtml(rep.description)}"
        </p>
      </div>

      ${photoHtml}

      <div class="form-privacy-note">
        <strong>Notice:</strong> This record is maintained securely in your browser's private local database.
      </div>
    `;

    dom.reportDetailsModal.classList.remove("hidden");
  }

  function closeReportDetailsModal() {
    dom.reportDetailsModal.classList.add("hidden");
  }

  // D. Delete Confirmation Modal
  let reportToDeleteId = null;

  function openDeleteConfirmModal(reportId) {
    reportToDeleteId = reportId;
    dom.deleteConfirmMessage.innerHTML = `Are you sure you want to permanently delete demo report <strong>#${escapeHtml(reportId)}</strong> from browser storage?`;
    dom.deleteConfirmModal.classList.remove("hidden");
  }

  function closeDeleteConfirmModal() {
    reportToDeleteId = null;
    dom.deleteConfirmModal.classList.add("hidden");
  }

  function confirmDeleteReport() {
    if (!reportToDeleteId) return;
    let reports = getReports();
    reports = reports.filter((r) => r.id !== reportToDeleteId);
    saveReports(reports);
    renderReportsTable();
    showToast(`Report #${reportToDeleteId} deleted successfully.`, "info");
    closeDeleteConfirmModal();
  }

  // E. Success Modal After Reporting
  function openSuccessModal(report) {
    dom.successTrackingId.textContent = report.id;
    dom.reportSuccessModal.classList.remove("hidden");

    // Hook buttons
    dom.successViewDashboardBtn.onclick = () => {
      dom.reportSuccessModal.classList.add("hidden");
      document.getElementById("dashboard-section").scrollIntoView({ behavior: "smooth" });
    };

    dom.successViewMatchingCompaniesBtn.onclick = () => {
      dom.reportSuccessModal.classList.add("hidden");
      // Find matching rule
      const rule = PROBLEM_MATCHING_RULES[report.problemType];
      if (rule && dom.filterCategory) {
        dom.filterCategory.value = rule.category;
      }
      if (dom.filterState && report.state) {
        dom.filterState.value = report.state;
      }
      renderCompanies();
      document.getElementById("companies-section").scrollIntoView({ behavior: "smooth" });
    };
  }

  /* ============================================================================
     14. NAVIGATION & MOBILE HAMBURGER CONTROLS
     ============================================================================ */
  function setupNavigation() {
    // Mobile Hamburger
    if (dom.menuToggle && dom.navMenu) {
      dom.menuToggle.addEventListener("click", () => {
        const isOpen = dom.navMenu.classList.toggle("open");
        dom.menuToggle.classList.toggle("open");
        dom.menuToggle.setAttribute("aria-expanded", isOpen);
      });

      // Close menu when clicking nav link
      dom.navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          dom.navMenu.classList.remove("open");
          dom.menuToggle.classList.remove("open");
          dom.menuToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    // ScrollSpy to highlight active link
    const sections = document.querySelectorAll("main section[id]");
    window.addEventListener(
      "scroll",
      debounce(() => {
        let currentSectionId = "";
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach((section) => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSectionId = section.getAttribute("id");
          }
        });

        dom.navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${currentSectionId}`) {
            link.classList.add("active");
          }
        });
      }, 50)
    );
  }

  // Debounce utility to optimize scroll event listeners
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /* ============================================================================
     15. INITIALIZATION & EVENT ATTACHMENTS
     ============================================================================ */
  function init() {
    cacheDomElements();
    populateStateDropdowns();
    populateCompanyCityFilter();
    setupNavigation();
    initHeroMiniMatch();
    setupProblemCardLinks();
    setupMatcherActions();
    updateNavBadge();

    // Matcher Form Submit
    if (dom.matcherForm) {
      dom.matcherForm.addEventListener("submit", handleMatcherSubmit);
    }

    // Report Form Events
    if (dom.reportForm) {
      dom.reportForm.addEventListener("submit", handleReportSubmit);
    }
    if (dom.reportPhotoInput) {
      dom.reportPhotoInput.addEventListener("change", handlePhotoUpload);
    }
    if (dom.removePhotoBtn) {
      dom.removePhotoBtn.addEventListener("click", clearPhotoPreview);
    }

    // Company Directory Filter Events
    if (dom.companySearchInput) {
      dom.companySearchInput.addEventListener("input", debounce(renderCompanies, 200));
    }
    if (dom.filterState) dom.filterState.addEventListener("change", renderCompanies);
    if (dom.filterCity) dom.filterCity.addEventListener("change", renderCompanies);
    if (dom.filterCategory) dom.filterCategory.addEventListener("change", renderCompanies);
    if (dom.filterBudget) dom.filterBudget.addEventListener("change", renderCompanies);
    if (dom.resetFiltersBtn) dom.resetFiltersBtn.addEventListener("click", resetCompanyFilters);

    // Initial render of companies
    renderCompanies();

    // Dashboard Events
    if (dom.dashFilterStatus) dom.dashFilterStatus.addEventListener("change", renderReportsTable);
    if (dom.dashFilterSeverity) dom.dashFilterSeverity.addEventListener("change", renderReportsTable);
    if (dom.dashFilterProblem) dom.dashFilterProblem.addEventListener("change", renderReportsTable);
    if (dom.resetDashFiltersBtn) dom.resetDashFiltersBtn.addEventListener("click", resetDashboardFilters);
    if (dom.clearAllReportsBtn) dom.clearAllReportsBtn.addEventListener("click", clearAllReports);

    // Initial render of saved reports
    renderReportsTable();

    // Modal Close Buttons
    if (dom.closeCompanyModalBtn) dom.closeCompanyModalBtn.addEventListener("click", closeCompanyModal);
    if (dom.modalCloseActionBtn) dom.modalCloseActionBtn.addEventListener("click", closeCompanyModal);
    if (dom.modalContactActionBtn) {
      dom.modalContactActionBtn.addEventListener("click", () => {
        if (activeModalCompany) openContactModal(activeModalCompany.id);
      });
    }

    if (dom.closeContactModalBtn) dom.closeContactModalBtn.addEventListener("click", closeContactModal);
    if (dom.closeContactConfirmBtn) dom.closeContactConfirmBtn.addEventListener("click", closeContactModal);

    if (dom.closeReportDetailsBtn) dom.closeReportDetailsBtn.addEventListener("click", closeReportDetailsModal);
    if (dom.closeReportDetailsActionBtn) dom.closeReportDetailsActionBtn.addEventListener("click", closeReportDetailsModal);
    if (dom.reportFindMatchingCompanyBtn) {
      dom.reportFindMatchingCompanyBtn.addEventListener("click", () => {
        closeReportDetailsModal();
        if (activeReportForModal) {
          const rule = PROBLEM_MATCHING_RULES[activeReportForModal.problemType];
          if (rule && dom.filterCategory) {
            dom.filterCategory.value = rule.category;
          }
          if (dom.filterState && activeReportForModal.state) {
            dom.filterState.value = activeReportForModal.state;
          }
          renderCompanies();
          document.getElementById("companies-section").scrollIntoView({ behavior: "smooth" });
          showToast(`Filtered companies matching Report #${activeReportForModal.id}`, "info");
        }
      });
    }

    if (dom.closeDeleteModalBtn) dom.closeDeleteModalBtn.addEventListener("click", closeDeleteConfirmModal);
    if (dom.cancelDeleteBtn) dom.cancelDeleteBtn.addEventListener("click", closeDeleteConfirmModal);
    if (dom.confirmDeleteActionBtn) dom.confirmDeleteActionBtn.addEventListener("click", confirmDeleteReport);

    // Close modals on clicking outside the card
    document.querySelectorAll(".modal-overlay").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
        }
      });
    });

    // Close modals on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay").forEach((modal) => modal.classList.add("hidden"));
      }
    });

    // Expose global helper namespace for any inline onclick handlers if needed
    window.DrainageApp = {
      resetCompanyFilters: resetCompanyFilters,
      openCompanyModal: openCompanyModal,
      openContactModal: openContactModal,
      openReportDetailsModal: openReportDetailsModal
    };

    console.log("DrainageFix initialized successfully. Running offline in demo mode.");
  }

  // Run on DOM Content Loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
