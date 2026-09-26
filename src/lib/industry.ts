export type IndustryType =
  | "SOFTWARE_IT"
  | "HEALTHCARE_CLINIC"
  | "SALON_BEAUTY"
  | "RESTAURANT_FOOD"
  | "AUTO_GARAGE"
  | "FITNESS_GYM"
  | "RETAIL_SHOP"
  | "HOTEL_HOSPITALITY"
  | "PROFESSIONAL_SERVICES"
  | "GENERAL";

export interface IndustryConfig {
  type: IndustryType;
  label: string;
  tagline: string;
  tags: string[];
  placeholder: string;
  keywords: string;
  reviewDrafts: {
    direct: { headline: string; text: (name: string, tags: string, note?: string) => string };
    detailed: { headline: string; text: (name: string, tags: string, note?: string) => string };
    enthusiastic: { headline: string; text: (name: string, tags: string, note?: string) => string };
  };
}

export const INDUSTRY_CONFIGS: Record<IndustryType, IndustryConfig> = {
  SOFTWARE_IT: {
    type: "SOFTWARE_IT",
    label: "Software & IT Solutions",
    tagline: "Custom Software Development, Web & Cloud IT Services",
    tags: [
      "Expert Developers",
      "Robust Software",
      "Prompt Tech Support",
      "Clean UI/UX Design",
      "Timely Delivery",
      "Agile Team",
    ],
    placeholder: "Mention your project, tech stack or service (optional)...",
    keywords: "custom software development, mobile app development, web application, prompt tech support, top IT company, clean code",
    reviewDrafts: {
      direct: {
        headline: "Top-Tier Tech Engineering!",
        text: (name, tags, note) =>
          `Outstanding technical expertise from ${name}! Their ${tags || "software engineering and prompt tech support"} exceeded our project requirements.${note ? ` Specifically impressed with: ${note}.` : ""} Highly recommended for anyone seeking reliable software development.`,
      },
      detailed: {
        headline: "Highly Skilled & Reliable Dev Team",
        text: (name, tags, note) =>
          `Working with ${name} has been an absolute game changer for our business. The development team demonstrated deep technical proficiency, especially regarding ${tags || "clean code and timely delivery"}.${note ? ` They handled our requirement for ${note} effortlessly.` : ""} Communication was seamless throughout the sprint. 5 stars all the way!`,
      },
      enthusiastic: {
        headline: "Best Software Partner We've Worked With!",
        text: (name, tags, note) =>
          `Cannot recommend ${name} enough! If you need top-notch software, robust development, and dedicated developers who actually deliver on time, this is the company to trust.${note ? ` Loved their execution on ${note}.` : ""} Truly 10/10 tech excellence!`,
      },
    },
  },

  HEALTHCARE_CLINIC: {
    type: "HEALTHCARE_CLINIC",
    label: "Clinics, Doctors & Dental",
    tagline: "Compassionate Healthcare & Modern Medical Treatments",
    tags: [
      "Caring Doctors",
      "Clean Clinic",
      "Painless Treatment",
      "Friendly Staff",
      "Prompt Appointment",
      "Hygienic Setup",
    ],
    placeholder: "Mention doctor, treatment or dental care (optional)...",
    keywords: "best doctor, hygienic clinic, painless treatment, caring staff, quick consultation",
    reviewDrafts: {
      direct: {
        headline: "Exceptional Patient Care!",
        text: (name, tags, note) =>
          `Very satisfied with the medical care at ${name}! The ${tags || "caring doctors and clean clinic"} made the entire experience comfortable.${note ? ` Especially thankful for the care during ${note}.` : ""} Highly recommended clinic!`,
      },
      detailed: {
        headline: "Compassionate, Gentle & Thorough",
        text: (name, tags, note) =>
          `Visited ${name} and was thoroughly impressed by the hygiene and professionalism. The doctor took ample time to explain the diagnosis clearly, and their ${tags || "painless treatment and polite staff"} put me right at ease.${note ? ` Great experience with ${note}.` : ""} One of the finest healthcare facilities around.`,
      },
      enthusiastic: {
        headline: "Best Clinic Experience Ever!",
        text: (name, tags, note) =>
          `Truly 5-star medical care at ${name}! From the front desk reception to the consultation, everything was handled with utmost care and empathy.${note ? ` The outcome for ${note} was wonderful.` : ""} Will always trust them for healthcare!`,
      },
    },
  },

  SALON_BEAUTY: {
    type: "SALON_BEAUTY",
    label: "Salons, Spas & Beauty Parlors",
    tagline: "Premium Hair, Beauty, Skin & Wellness Experience",
    tags: [
      "Skilled Stylists",
      "Relaxing Ambiance",
      "Great Haircut",
      "Premium Products",
      "Polite Staff",
      "Hygienic Setup",
    ],
    placeholder: "Mention stylist or service like hair, facial, spa (optional)...",
    keywords: "best salon, skilled hair stylist, relaxing spa, premium beauty products, great makeover",
    reviewDrafts: {
      direct: {
        headline: "Loved the Makeover!",
        text: (name, tags, note) =>
          `Amazing service at ${name}! The ${tags || "skilled stylists and relaxing ambiance"} made the session so enjoyable.${note ? ` Loved how they styled my ${note}.` : ""} Walked out feeling refreshed and confident.`,
      },
      detailed: {
        headline: "Masterful Styling & Relaxing Vibe",
        text: (name, tags, note) =>
          `Had a wonderful visit at ${name}. The team is genuinely skilled and pays great attention to personal preferences. Their ${tags || "great service and premium products"} delivered fantastic results.${note ? ` Highly recommend booking with them for ${note}.` : ""} Definitely my regular salon now!`,
      },
      enthusiastic: {
        headline: "10/10 Experience, Totally Worth It!",
        text: (name, tags, note) =>
          `Best salon experience in town! ${name} has the most welcoming vibe and talented stylists who work magic.${note ? ` They did wonders with ${note}!` : ""} Everyone gave me compliments. Thank you team!`,
      },
    },
  },

  RESTAURANT_FOOD: {
    type: "RESTAURANT_FOOD",
    label: "Restaurants, Cafes & Food",
    tagline: "Authentic Flavors, Great Ambiance & Delicious Food",
    tags: [
      "Delicious Food",
      "Quick Service",
      "Cozy Ambiance",
      "Polite Staff",
      "Fresh Ingredients",
      "Great Value",
    ],
    placeholder: "Mention favorite dish or server (optional)...",
    keywords: "delicious food, best restaurant, cozy ambiance, quick service, authentic taste",
    reviewDrafts: {
      direct: {
        headline: "Fantastic Food & Quick Service!",
        text: (name, tags, note) =>
          `Had a wonderful meal at ${name}! The ${tags || "delicious food and quick service"} were spot on.${note ? ` Loved the ${note}!` : ""} Definitely coming back with friends!`,
      },
      detailed: {
        headline: "Superb Flavors & Welcoming Ambiance",
        text: (name, tags, note) =>
          `Visited ${name} and had a delightful dining experience. Every dish tasted fresh and authentic, especially with their ${tags || "great hospitality and cozy ambiance"}.${note ? ` Must try their ${note}.` : ""} Kudos to the chef and service staff!`,
      },
      enthusiastic: {
        headline: "5 Stars for Taste & Hospitality!",
        text: (name, tags, note) =>
          `Absolute 10/10 food spot! ${name} never disappoints. Flavors are top notch, portions are generous, and the staff makes you feel right at home.${note ? ` Do not miss ordering ${note}.` : ""} Highly recommended!`,
      },
    },
  },

  AUTO_GARAGE: {
    type: "AUTO_GARAGE",
    label: "Automobile & Bike Garages",
    tagline: "Expert Vehicle Service, Repairs & Detailing",
    tags: [
      "Honest Mechanics",
      "Quick Turnaround",
      "Transparent Pricing",
      "Genuine Parts",
      "Smooth Driving",
      "Clean Workshop",
    ],
    placeholder: "Mention your vehicle model or service done (optional)...",
    keywords: "best car mechanic, bike service, transparent billing, quick repair, genuine spare parts",
    reviewDrafts: {
      direct: {
        headline: "Fast, Honest & Reliable Service!",
        text: (name, tags, note) =>
          `Got vehicle service done at ${name} and couldn't be happier. The ${tags || "honest mechanics and transparent pricing"} gave total peace of mind.${note ? ` They diagnosed and fixed ${note} in record time.` : ""} Car feels brand new!`,
      },
      detailed: {
        headline: "Professional Mechanics & Genuine Work",
        text: (name, tags, note) =>
          `Finding a trustworthy garage is rare, but ${name} is exceptional. They explained the repairs clearly, used genuine parts, and delivered on time.${note ? ` Solved the issue with ${note} perfectly.` : ""} Very satisfied with the smoothness of the drive.`,
      },
      enthusiastic: {
        headline: "Top Rated Auto Care!",
        text: (name, tags, note) =>
          `Best garage experience ever! ${name} has skilled technicians who know their craft thoroughly. Fair pricing, no unnecessary charges, and prompt turnaround.${note ? ` Thank you for fixing ${note}!` : ""} 10/10 recommended!`,
      },
    },
  },

  FITNESS_GYM: {
    type: "FITNESS_GYM",
    label: "Gyms, Fitness & Yoga",
    tagline: "Modern Equipment, Certified Trainers & Fitness Community",
    tags: [
      "Certified Trainers",
      "Top Equipment",
      "Clean Facilities",
      "High Energy",
      "Personal Guidance",
      "Spacious Gym",
    ],
    placeholder: "Mention trainer or fitness goal (optional)...",
    keywords: "best gym, certified fitness trainer, modern gym equipment, workout motivation, clean gym",
    reviewDrafts: {
      direct: {
        headline: "Awesome Gym & High Energy!",
        text: (name, tags, note) =>
          `Loving my workouts at ${name}! The ${tags || "top equipment and certified trainers"} create the best fitness environment.${note ? ` Great coaching on ${note}.` : ""} Highly recommended for anyone wanting results!`,
      },
      detailed: {
        headline: "Exceptional Training & Spotless Setup",
        text: (name, tags, note) =>
          `Joined ${name} and it's by far the best decision for my health. The trainers are knowledgeable, encouraging, and ensure proper workout posture. The ${tags || "clean facilities and motivating vibe"} keep you consistent.${note ? ` Seeing great progress in ${note}.` : ""} 5 stars!`,
      },
      enthusiastic: {
        headline: "Best Fitness Center in the Area!",
        text: (name, tags, note) =>
          `10/10 gym! ${name} has top-of-the-line machines, friendly community, and dedicated coaches who push you to achieve your personal best.${note ? ` Special shoutout for ${note}!` : ""} Join without hesitation!`,
      },
    },
  },

  RETAIL_SHOP: {
    type: "RETAIL_SHOP",
    label: "Retail, Boutiques & Stores",
    tagline: "Curated Collections, Premium Quality & Great Value",
    tags: [
      "Great Collection",
      "Helpful Staff",
      "Premium Quality",
      "Fair Pricing",
      "Latest Trends",
      "Hassle-Free Shopping",
    ],
    placeholder: "Mention product bought or shopping experience (optional)...",
    keywords: "best shopping store, great collection, premium quality, helpful sales staff, fair prices",
    reviewDrafts: {
      direct: {
        headline: "Wonderful Shopping Experience!",
        text: (name, tags, note) =>
          `Shopped at ${name} and was thoroughly delighted! The ${tags || "great collection and helpful staff"} made finding what I needed so effortless.${note ? ` Loved the quality of ${note}.` : ""} Will definitely visit again!`,
      },
      detailed: {
        headline: "Impressive Quality & Courteous Service",
        text: (name, tags, note) =>
          `Had a great retail experience at ${name}. Their curation of products is top quality and reasonably priced. The staff was patient, polite, and guided me to the best options.${note ? ` Really happy with the purchase of ${note}.` : ""} Highly recommended store!`,
      },
      enthusiastic: {
        headline: "My Favorite Shopping Destination!",
        text: (name, tags, note) =>
          `5 stars all the way for ${name}! Fantastic variety, authentic quality, and a genuinely warm customer experience.${note ? ` Very pleased with ${note}.` : ""} Must visit!`,
      },
    },
  },

  HOTEL_HOSPITALITY: {
    type: "HOTEL_HOSPITALITY",
    label: "Hotels, Resorts & Lodging",
    tagline: "Comfortable Stay, Clean Rooms & Warm Hospitality",
    tags: [
      "Clean Rooms",
      "Courteous Staff",
      "Great Location",
      "Delicious Breakfast",
      "Peaceful Stay",
      "Quick Check-in",
    ],
    placeholder: "Mention room type, stay duration, or amenities (optional)...",
    keywords: "best hotel stay, clean rooms, hospitable staff, great location, comfortable lodging",
    reviewDrafts: {
      direct: {
        headline: "Wonderful & Comfortable Stay!",
        text: (name, tags, note) =>
          `Enjoyed a great stay at ${name}! The ${tags || "clean rooms and courteous staff"} made our trip memorable and stress-free.${note ? ` Especially appreciated ${note}.` : ""} Highly recommended!`,
      },
      detailed: {
        headline: "Top Hospitality & Spotless Comfort",
        text: (name, tags, note) =>
          `Stayed at ${name} and couldn't be more pleased. The property is well-maintained, check-in was seamless, and the housekeeping team was prompt. Their ${tags || "clean rooms and peaceful vibe"} made it a restful visit.${note ? ` Loved the service for ${note}.` : ""} Will book again!`,
      },
      enthusiastic: {
        headline: "Outstanding 5-Star Hospitality!",
        text: (name, tags, note) =>
          `10/10 stay at ${name}! From the warm welcome to the spotless rooms and attentive service, everything exceeded our expectations.${note ? ` Thank you for making ${note} so pleasant!` : ""} Highly recommended!`,
      },
    },
  },

  PROFESSIONAL_SERVICES: {
    type: "PROFESSIONAL_SERVICES",
    label: "Professional Services (Legal, CA, Consulting)",
    tagline: "Expert Advice, Transparent Process & Reliable Execution",
    tags: [
      "Expert Advice",
      "Transparent Process",
      "Prompt Communication",
      "Timely Execution",
      "Trustworthy",
      "Clear Guidance",
    ],
    placeholder: "Mention service, consultation or case handled (optional)...",
    keywords: "expert consultant, trustworthy advisor, prompt response, professional service, transparent guidance",
    reviewDrafts: {
      direct: {
        headline: "Highly Professional & Reliable!",
        text: (name, tags, note) =>
          `Consulted with ${name} and was extremely impressed with their professionalism. Their ${tags || "expert advice and prompt communication"} solved our requirements seamlessly.${note ? ` Handled ${note} with great competence.` : ""} Highly recommended!`,
      },
      detailed: {
        headline: "Thorough, Knowledgeable & Dedicated",
        text: (name, tags, note) =>
          `The team at ${name} is exceptionally knowledgeable and transparent. They took the time to understand our situation and provided sound, practical solutions without delays.${note ? ` Very pleased with their execution on ${note}.` : ""} A truly dependable professional firm.`,
      },
      enthusiastic: {
        headline: "Exceptional Service & Complete Peace of Mind!",
        text: (name, tags, note) =>
          `5 stars! ${name} is the gold standard for client service and expertise. Trustworthy guidance, clear milestones, and responsive follow-up.${note ? ` Thank you for your work on ${note}!` : ""} Would recommend to anyone!`,
      },
    },
  },

  GENERAL: {
    type: "GENERAL",
    label: "General Business & Services",
    tagline: "Dedicated Service, High Quality & Customer Satisfaction",
    tags: [
      "Friendly Staff",
      "Prompt Service",
      "High Quality",
      "Fair Pricing",
      "Professional Approach",
      "Great Experience",
    ],
    placeholder: "Mention any specific service, staff, or experience (optional)...",
    keywords: "excellent service, highly recommended, prompt response, great quality, professional staff",
    reviewDrafts: {
      direct: {
        headline: "Outstanding Experience!",
        text: (name, tags, note) =>
          `Had an amazing experience with ${name}! The ${tags || "prompt service and high quality"} really stood out.${note ? ` Especially appreciated: ${note}.` : ""} Highly recommend their services to everyone!`,
      },
      detailed: {
        headline: "Consistently Top-Tier & Professional",
        text: (name, tags, note) =>
          `From start to finish, ${name} exceeded all expectations. You can really feel their commitment to customer satisfaction, especially regarding ${tags || "professionalism and fair pricing"}.${note ? ` Great handling of ${note}.` : ""} Truly a 5-star team that deserves all the praise.`,
      },
      enthusiastic: {
        headline: "5 Stars All the Way!",
        text: (name, tags, note) =>
          `Such a great discovery! ${name} is simply top notch. Love their ${tags || "attentive support and dedication to quality"}.${note ? ` Especially impressed with ${note}.` : ""} 10/10 recommend to friends and family!`,
      },
    },
  },
};

/**
 * Intelligent detector that inspects business name, category, tagline and keywords
 * to accurately identify the industry vertical.
 */
export function detectIndustry(
  name: string = "",
  category: string = "",
  tagline: string = ""
): IndustryConfig {
  const combined = `${name} ${category} ${tagline}`.toLowerCase();

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORITY 1: Food & Dining (Most common merchant vertical)
  // Check FIRST to prevent "Cloud Kitchen" matching SOFTWARE_IT via "cloud",
  // "Digital Cafe" matching via "digital", etc.
  // ═══════════════════════════════════════════════════════════════════════
  if (
    combined.includes("restaurant") ||
    combined.includes("cafe") ||
    combined.includes("café") ||
    combined.includes("bistro") ||
    combined.includes("bakery") ||
    combined.includes("kitchen") ||
    combined.includes("food") ||
    combined.includes("biryani") ||
    combined.includes("spice") ||
    combined.includes("sweet") ||
    combined.includes("dhaba") ||
    combined.includes("mess") ||
    combined.includes("tiffin") ||
    combined.includes("tea") ||
    combined.includes("chai") ||
    combined.includes("coffee") ||
    combined.includes("dine") ||
    combined.includes("dining") ||
    combined.includes("grill") ||
    combined.includes("pizza") ||
    combined.includes("burger") ||
    combined.includes("chicken") ||
    combined.includes("juice") ||
    combined.includes("yummy") ||
    combined.includes("tasty") ||
    combined.includes("delicious") ||
    combined.includes("cook") ||
    combined.includes("catering") ||
    combined.includes("snack") ||
    combined.includes("ice cream") ||
    combined.includes("sweets") ||
    combined.includes("chaat") ||
    combined.includes("pani puri") ||
    combined.includes("dosa") ||
    combined.includes("idli") ||
    combined.includes("noodle") ||
    combined.includes("chinese") ||
    combined.includes("mughlai") ||
    combined.includes("north indian") ||
    combined.includes("south indian") ||
    combined.includes("fast food") ||
    combined.includes("cloud kitchen") ||
    combined.includes("eat") ||
    combined.includes("meals") ||
    combined.includes("lunch") ||
    combined.includes("dinner") ||
    combined.includes("breakfast")
  ) {
    return INDUSTRY_CONFIGS.RESTAURANT_FOOD;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORITY 2: Retail & Stores (Second most common local merchant vertical)
  // Check before SOFTWARE_IT to prevent "Digital Store" → tech misclassification
  // ═══════════════════════════════════════════════════════════════════════
  if (
    combined.includes("store") ||
    combined.includes("shop") ||
    combined.includes("boutique") ||
    combined.includes("jewel") ||
    combined.includes("fashion") ||
    combined.includes("clothing") ||
    combined.includes("garment") ||
    combined.includes("textile") ||
    combined.includes("fabric") ||
    combined.includes("tailor") ||
    combined.includes("stitch") ||
    combined.includes("optics") ||
    combined.includes("optical") ||
    combined.includes("electronics") ||
    combined.includes("mobile") ||
    combined.includes("mall") ||
    combined.includes("mart") ||
    combined.includes("supermarket") ||
    combined.includes("kirana") ||
    combined.includes("general store") ||
    combined.includes("readymade") ||
    combined.includes("saree") ||
    combined.includes("sari") ||
    combined.includes("kurta") ||
    combined.includes("studio") && (combined.includes("fashion") || combined.includes("photo") || combined.includes("design"))
  ) {
    return INDUSTRY_CONFIGS.RETAIL_SHOP;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORITY 3: Hotel & Lodging
  // Check before SOFTWARE_IT to prevent "Hotel Digital" → tech misclassification
  // ═══════════════════════════════════════════════════════════════════════
  if (
    combined.includes("hotel") ||
    combined.includes("resort") ||
    combined.includes("lodge") ||
    combined.includes("lodging") ||
    combined.includes("stay") ||
    combined.includes("inn ") ||
    combined.includes("suites") ||
    combined.includes("guest house") ||
    combined.includes("motel") ||
    combined.includes("homestay")
  ) {
    return INDUSTRY_CONFIGS.HOTEL_HOSPITALITY;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORITY 4: Clinics, Doctors & Dental
  // ═══════════════════════════════════════════════════════════════════════
  if (
    combined.includes("clinic") ||
    combined.includes("dental") ||
    combined.includes("doctor") ||
    combined.includes("hospital") ||
    combined.includes("physio") ||
    combined.includes("ortho") ||
    combined.includes("pharma") ||
    combined.includes("diagnostic") ||
    combined.includes("healthcare") ||
    combined.includes("medic") ||
    combined.includes("derma") ||
    combined.includes("eye care") ||
    combined.includes("ayurved") ||
    combined.includes("homeopath") ||
    combined.includes("lab")
  ) {
    return INDUSTRY_CONFIGS.HEALTHCARE_CLINIC;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORITY 5: Salons, Spas & Beauty
  // ═══════════════════════════════════════════════════════════════════════
  if (
    combined.includes("salon") ||
    combined.includes("spa") ||
    combined.includes("beauty") ||
    combined.includes("hair") ||
    combined.includes("makeover") ||
    combined.includes("barber") ||
    combined.includes("parlour") ||
    combined.includes("parlor") ||
    combined.includes("nails") ||
    combined.includes("skincare") ||
    combined.includes("cosmetic") ||
    combined.includes("mehndi") ||
    combined.includes("henna") ||
    combined.includes("bridal")
  ) {
    return INDUSTRY_CONFIGS.SALON_BEAUTY;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORITY 6: Automobile & Bikes
  // ═══════════════════════════════════════════════════════════════════════
  if (
    combined.includes("garage") ||
    combined.includes("auto") ||
    combined.includes("motors") ||
    combined.includes("mechanic") ||
    combined.includes("car ") ||
    combined.includes("bike ") ||
    combined.includes("tyre") ||
    combined.includes("tire") ||
    combined.includes("detailing") ||
    combined.includes("vehicle") ||
    combined.includes("wheel") ||
    combined.includes("two wheeler") ||
    combined.includes("scooter")
  ) {
    return INDUSTRY_CONFIGS.AUTO_GARAGE;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORITY 7: Gym & Fitness
  // ═══════════════════════════════════════════════════════════════════════
  if (
    combined.includes("gym") ||
    combined.includes("fitness") ||
    combined.includes("workout") ||
    combined.includes("crossfit") ||
    combined.includes("yoga") ||
    combined.includes("pilates") ||
    combined.includes("sports") ||
    combined.includes("martial") ||
    combined.includes("boxing") ||
    combined.includes("zumba")
  ) {
    return INDUSTRY_CONFIGS.FITNESS_GYM;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORITY 8: Software / IT / Tech
  // Now SAFE to check — all ambiguous terms (cloud, digital, solutions, studio)
  // have been pre-filtered by food/retail/hotel above.
  // ═══════════════════════════════════════════════════════════════════════
  if (
    combined.includes("technology") ||
    combined.includes("technologies") ||
    combined.includes("software") ||
    combined.includes("tech") ||
    combined.includes("digital") ||
    combined.includes("solutions") ||
    combined.includes("developer") ||
    combined.includes("cloud") ||
    combined.includes("it ") ||
    combined.includes("infotech") ||
    combined.includes("systems") ||
    combined.includes("consulting") ||
    combined.includes("cyber") ||
    combined.includes("ai ") ||
    combined.includes("app ") ||
    combined.includes("saas") ||
    combined.includes("startup")
  ) {
    return INDUSTRY_CONFIGS.SOFTWARE_IT;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRIORITY 9: Professional Services (Legal, Tax, Finance)
  // ═══════════════════════════════════════════════════════════════════════
  if (
    combined.includes("advocate") ||
    combined.includes("legal") ||
    combined.includes("law") ||
    combined.includes("tax") ||
    combined.includes("ca ") ||
    combined.includes("audit") ||
    combined.includes("realt") ||
    combined.includes("properties") ||
    combined.includes("financial") ||
    combined.includes("insurance") ||
    combined.includes("chartered")
  ) {
    return INDUSTRY_CONFIGS.PROFESSIONAL_SERVICES;
  }

  return INDUSTRY_CONFIGS.GENERAL;
}
