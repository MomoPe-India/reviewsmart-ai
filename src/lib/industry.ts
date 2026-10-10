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
  | "PHOTOGRAPHY_STUDIO"
  | "PRINTING_GRAPHICS"
  | "GOLD_BUYERS"
  | "TOURS_TRAVELS"
  | "TATTOO_STUDIO"
  | "APPLIANCE_REPAIR"
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
    placeholder: "Mention favorite dish or food order (optional)...",
    keywords: "delicious food, best restaurant, cozy ambiance, quick service, authentic taste",
    reviewDrafts: {
      direct: {
        headline: "Fantastic Food & Quick Service!",
        text: (name, tags, note) =>
          `Had a wonderful meal from ${name}! The ${tags || "delicious food and quick service"} were spot on.${note ? ` Loved the ${note}!` : ""} Definitely ordering again!`,
      },
      detailed: {
        headline: "Superb Flavors & Welcoming Service",
        text: (name, tags, note) =>
          `Had a delightful dining experience with ${name}. Every dish tasted fresh and authentic, especially with their ${tags || "great hospitality and quality ingredients"}.${note ? ` Must try their ${note}.` : ""} Kudos to the chef and service staff!`,
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
          `Got vehicle service done at ${name} and couldn't be happier. The ${tags || "honest mechanics and transparent pricing"} gave total peace of mind.${note ? ` They diagnosed and fixed ${note} in record time.` : ""} Vehicle feels brand new!`,
      },
      detailed: {
        headline: "Professional Diagnostics & Quality Work",
        text: (name, tags, note) =>
          `Excellent garage experience at ${name}. The team explained every repair clearly before touching the vehicle. Their ${tags || "quick turnaround and genuine parts"} restored full performance.${note ? ` Great job with ${note}.` : ""} 100% recommended for reliable servicing!`,
      },
      enthusiastic: {
        headline: "Best Garage in Town!",
        text: (name, tags, note) =>
          `Found my go-to automobile service center at ${name}! Skilled mechanics, fair pricing, and zero hassle.${note ? ` Especially thankful for solving the ${note} issue.` : ""} 5 stars without hesitation!`,
      },
    },
  },

  FITNESS_GYM: {
    type: "FITNESS_GYM",
    label: "Gyms, Crossfit & Fitness Studios",
    tagline: "High-Energy Training, Modern Equipment & Expert Coaching",
    tags: [
      "Modern Equipment",
      "Certified Trainers",
      "Clean & Motivating",
      "Personal Attention",
      "Great Community",
      "Flexible Timings",
    ],
    placeholder: "Mention your workout, coach or fitness goal (optional)...",
    keywords: "best gym, certified fitness trainer, modern gym equipment, weight loss coaching, motivating gym",
    reviewDrafts: {
      direct: {
        headline: "Best Gym to Stay Fit & Motivated!",
        text: (name, tags, note) =>
          `Training at ${name} has been amazing! The ${tags || "modern equipment and certified trainers"} create the perfect workout environment.${note ? ` The guidance for ${note} has been great.` : ""} Highly recommended fitness center!`,
      },
      detailed: {
        headline: "Super Clean, Well Equipped & Great Vibe",
        text: (name, tags, note) =>
          `Joined ${name} and loving the journey so far. State-of-the-art machines, well-maintained floor, and supportive coaches who focus on ${tags || "personal attention and proper form"}.${note ? ` Seeing real results with ${note}.` : ""} Worth every penny!`,
      },
      enthusiastic: {
        headline: "Top-Tier Fitness Experience!",
        text: (name, tags, note) =>
          `10/10 energy and coaching at ${name}! If you want serious results and a motivating community, this is the place to join.${note ? ` Loved the ${note} sessions.` : ""} Proud to be a member here!`,
      },
    },
  },

  RETAIL_SHOP: {
    type: "RETAIL_SHOP",
    label: "Retail, Boutiques & Stores",
    tagline: "Curated Fashion, Lifestyle & Premium In-Store Experience",
    tags: [
      "Great Collection",
      "Helpful Staff",
      "Premium Quality",
      "Fair Pricing",
      "Latest Trends",
      "Hassle-Free Shopping",
    ],
    placeholder: "Mention clothing, product bought or shopping experience (optional)...",
    keywords: "best shopping store, great collection, premium quality, helpful sales staff, fair prices",
    reviewDrafts: {
      direct: {
        headline: "Wonderful Experience & Great Selection!",
        text: (name, tags, note) =>
          `Had a wonderful experience at ${name}! Really impressed with their ${tags || "great collection and helpful staff"}.${note ? ` Loved the quality of ${note}.` : ""} Finding what I needed was effortless. Will definitely visit again!`,
      },
      detailed: {
        headline: "Impressive Quality & Courteous Service",
        text: (name, tags, note) =>
          `Visited ${name} and was thoroughly impressed by their selection and customer service. The staff was patient, polite, and guided me to the best options, with great attention to ${tags || "premium quality and fair pricing"}.${note ? ` Very happy with the purchase of ${note}.` : ""} Highly recommended store!`,
      },
      enthusiastic: {
        headline: "My Favorite Shopping Destination!",
        text: (name, tags, note) =>
          `5 stars all the way for ${name}! Fantastic variety, authentic quality, and a genuinely warm customer experience.${note ? ` Very pleased with ${note}.` : ""} One of the best places around for ${tags || "latest trends and great quality"}!`,
      },
    },
  },

  HOTEL_HOSPITALITY: {
    type: "HOTEL_HOSPITALITY",
    label: "Hotels, Resorts & Lodging",
    tagline: "Comfortable Stay, Warm Hospitality & Memorable Experiences",
    tags: [
      "Comfortable Stay",
      "Courteous Staff",
      "Spotless Rooms",
      "Delicious Breakfast",
      "Prime Location",
      "Smooth Check-in",
    ],
    placeholder: "Mention room, trip purpose or special amenity (optional)...",
    keywords: "best hotel stay, comfortable rooms, courteous staff, luxury resort, delicious breakfast",
    reviewDrafts: {
      direct: {
        headline: "Extremely Comfortable Stay!",
        text: (name, tags, note) =>
          `Had a memorable stay at ${name}! The ${tags || "spotless rooms and courteous staff"} made us feel right at home.${note ? ` Special shoutout for ${note}.` : ""} Will definitely book again!`,
      },
      detailed: {
        headline: "Impeccable Hospitality & Clean Rooms",
        text: (name, tags, note) =>
          `Stayed at ${name} and thoroughly enjoyed the experience. Smooth check-in, spacious and hygienic rooms, and attentive staff who ensured ${tags || "comfort and quick service"}.${note ? ` Great experience with ${note}.` : ""} Highly recommended hotel!`,
      },
      enthusiastic: {
        headline: "10/10 Hospitality & Wonderful Experience!",
        text: (name, tags, note) =>
          `A fantastic stay at ${name}! Everything from the reception welcome to the room comfort exceeded expectations.${note ? ` Loved the ${note}.` : ""} Thank you team for making our visit so pleasant!`,
      },
    },
  },

  PROFESSIONAL_SERVICES: {
    type: "PROFESSIONAL_SERVICES",
    label: "Legal, Tax & Consulting",
    tagline: "Trusted Advisory, Legal Guidance & Financial Solutions",
    tags: [
      "Expert Advice",
      "Transparent Guidance",
      "Prompt Communication",
      "Hassle-Free Process",
      "Trustworthy",
      "Professional Team",
    ],
    placeholder: "Mention service or consultation area (optional)...",
    keywords: "trusted consultant, expert legal advice, tax advisor, transparent financial guidance, professional team",
    reviewDrafts: {
      direct: {
        headline: "Trustworthy & Highly Professional!",
        text: (name, tags, note) =>
          `Great experience consulting with ${name}. Their ${tags || "expert advice and transparent guidance"} simplified everything.${note ? ` Handled our matter regarding ${note} very well.` : ""} Highly recommended professional service!`,
      },
      detailed: {
        headline: "Clear Guidance & Seamless Execution",
        text: (name, tags, note) =>
          `Approached ${name} for consultation and was thoroughly impressed by their expertise and patience. They explained every detail clearly and ensured ${tags || "prompt communication and hassle-free processing"}.${note ? ` Very thankful for their assistance with ${note}.` : ""} Truly dependable professionals.`,
      },
      enthusiastic: {
        headline: "Top-Tier Professional Advisory!",
        text: (name, tags, note) =>
          `5-star rating for ${name}! Finding a consultant with such high integrity, domain knowledge, and prompt execution is rare.${note ? ` Outstanding support on ${note}.` : ""} Will always consult them!`,
      },
    },
  },

  PHOTOGRAPHY_STUDIO: {
    type: "PHOTOGRAPHY_STUDIO",
    label: "Photography & Photo Framing Studios",
    tagline: "Creative Photography, High-Resolution Prints & Photo Framing Services",
    tags: [
      "Pre-Wedding Shoots",
      "Candid Wedding Photography",
      "Traditional Wedding Photography",
      "Cinematic Wedding Films",
      "Fashion & Portfolio",
      "Big Size Photo",
      "Customized Gifts Shop",
      "Cup Printing",
      "Magic Pillows",
      "Pillow Printing",
      "Keychain Printing",
      "Photo Frames",
      "Album Design",
      "Headshots & Corporate Portraits",
      "Corporate Events",
    ],
    placeholder: "Mention pre-wedding shoot, wedding film, customized gifts, cup printing or frames (optional)...",
    keywords: "pre-wedding shoots, candid wedding photography, traditional wedding photography, cinematic wedding films, fashion and portfolio, big size photo, customized gifts shop, cup printing, pillow printing, magic pillows, keychain printing, photo framing, album design, kadapa studio",
    reviewDrafts: {
      direct: {
        headline: "Neat Work & Timely Delivery",
        text: (name, tags, note) =>
          `Ordered photo frames and custom work from ${name}. The finishing is very neat, and the print clarity turned out sharp.${note ? ` Loved how they handled ${note}.` : ""} Delivered right on time, really satisfied!`,
      },
      detailed: {
        headline: "Professional & Creative Studio",
        text: (name, tags, note) =>
          `Visited ${name} for ${tags || "photo framing and prints"}. The team took the time to show sample borders and paper types patiently. Output exceeded expectations with solid frame borders.${note ? ` Handled ${note} with great care.` : ""} A dependable studio.`,
      },
      enthusiastic: {
        headline: "Super Quality on Photo Frames!",
        text: (name, tags, note) =>
          `The photo quality and acrylic finishing from ${name} came out super neat! Everyone at home was really pleased with the output.${note ? ` Special thanks for sorting out ${note}.` : ""} Prompt communication and honest pricing.`,
      },
    },
  },

  PRINTING_GRAPHICS: {
    type: "PRINTING_GRAPHICS",
    label: "Flex Printing & Graphic Design Studios",
    tagline: "High-Resolution Flex Banners, Sign Boards, Commercial Printing & Creative Graphics",
    tags: [
      "Flex Printing",
      "Sign Boards",
      "Banner Printing",
      "Visiting Cards",
      "Graphic Design",
      "Mug Printing",
      "T-Shirt Printing",
      "Brochures & Pamphlets",
      "Fast Delivery",
      "Vibrant Colors",
      "Weather-Proof Quality",
    ],
    placeholder: "Mention flex banner, sign board, visiting card, mugs or graphic design (optional)...",
    keywords: "city grafix kadapa flex printing sign boards banners graphic design visiting cards mug printing t-shirt printing brochures pamphlets offset printing weather proof quality",
    reviewDrafts: {
      direct: {
        headline: "Vibrant Printing & Timely Delivery",
        text: (name, tags, note) =>
          `Ordered ${tags || "flex printing and banners"} from ${name}. The print quality is super crisp and the colors came out very vibrant.${note ? ` Handled ${note} quickly.` : ""} Delivered right on schedule, great work!`,
      },
      detailed: {
        headline: "Outstanding Graphic Design & Print Finish",
        text: (name, tags, note) =>
          `Visited ${name} for ${tags || "sign boards and promotional printing"}. The graphic designer was very skilled, listened patiently to our requirements, and finalized the layout quickly. Output quality on the boards exceeded expectations.${note ? ` Really happy with how they did ${note}.` : ""} Truly dependable printing hub in Kadapa.`,
      },
      enthusiastic: {
        headline: "Top Class Flex & Sign Board Work!",
        text: (name, tags, note) =>
          `Superb experience with ${name}! The banner colors, material durability, and neat finishing are top notch.${note ? ` Especially impressed with ${note}.` : ""} Reasonable prices and courteous staff. Highly recommended!`,
      },
    },
  },

  GOLD_BUYERS: {
    type: "GOLD_BUYERS",
    label: "Gold Buying & Pledged Gold Services",
    tagline: "Sell Gold for Cash · Old Gold Evaluation & Purity Testing · Pledged Gold Assistance · Instant Payment",
    tags: [
      "Sell Gold for Cash",
      "Old Gold Evaluation",
      "Gold Purity Testing",
      "Gold Valuation",
      "Pledged Gold Assistance",
      "Transparent Gold Pricing",
      "Quick Instant Payment",
      "Doorstep Gold Evaluation",
    ],
    placeholder: "Mention selling old gold, evaluation, purity testing, or pledged gold assistance (optional)...",
    keywords: "sell gold for cash, old gold evaluation, gold purity testing, gold valuation, pledged gold assistance, transparent gold pricing, quick instant payment, doorstep gold evaluation, release pledged gold, instant bank transfer",
    reviewDrafts: {
      direct: {
        headline: "Instant Payment & Best Market Rate!",
        text: (name, tags, note) =>
          `Superb experience with ${name}! The ${tags || "instant bank transfer and transparent valuation"} made the entire transaction smooth and trustworthy.${note ? ` Especially appreciated the help with ${note}.` : ""} Received highest market rate with zero hidden deductions.`,
      },
      detailed: {
        headline: "100% Transparent & Trustworthy Gold Buying Service",
        text: (name, tags, note) =>
          `Visited ${name} to sell old gold and was thoroughly impressed by their honesty. Purity was verified right in front of me on computerized German equipment, weighing was completely accurate, and payment was transferred to my bank account in 2 minutes.${note ? ` Handled ${note} with absolute transparency.` : ""} One of the most reliable gold buying services in town!`,
      },
      enthusiastic: {
        headline: "Best Gold Buying & Pledged Gold Assistance!",
        text: (name, tags, note) =>
          `Truly a 5-star experience with ${name}! If you want to release pledged gold or sell old gold jewellery at the highest market rate without any stress, this is the place to visit.${note ? ` Very impressed with ${note}.` : ""} Highly recommended to everyone!`,
      },
    },
  },

  TOURS_TRAVELS: {
    type: "TOURS_TRAVELS",
    label: "Tours, Travels & Self-Drive Cabs",
    tagline: "Premier Cab Service, Outstation Rides, Pilgrimage Packages & Self-Drive Car Rentals",
    tags: [
      "Tirupati Darshan",
      "Self Drive",
      "Airport Drops",
      "Gandikota Tour",
      "Clean AC Cabs",
      "Fair Pricing",
      "Punctual Driver",
      "Outstation Trips",
      "Friendly Chauffeur",
      "Fast Booking",
    ],
    placeholder: "Mention route, car model (Innova Crysta, Etios), driver or booking experience (optional)...",
    keywords: "mana tours kadapa cab service outstation cabs self drive car rental tirupati temple darshan package bangalore airport fixed drop gandikota canyon day tour clean ac vehicles innova crysta etios upfront transparent pricing punctual chauffeurs fastag enabled zero hidden charges",
    reviewDrafts: {
      direct: {
        headline: "Punctual Pickup & Spotless AC Cab!",
        text: (name, tags, note) =>
          `Booked a cab with ${name} and had a completely hassle-free journey. The ${tags || "clean AC vehicle and punctual driver"} made traveling comfortable and safe.${note ? ` Handled our trip for ${note} smoothly.` : ""} Transparent upfront fare with zero hidden charges. Highly recommended cab service!`,
      },
      detailed: {
        headline: "Reliable, Safe & 100% Transparent Travel Partner",
        text: (name, tags, note) =>
          `Used ${name} for our outstation journey. Chauffeur arrived 10 minutes before schedule, drove very safely on the highway, and the vehicle was thoroughly sanitized with powerful AC.${note ? ` Specifically impressed with their service for ${note}.` : ""} Billing was clear and exactly as quoted on WhatsApp. One of the best travels in Rayalaseema!`,
      },
      enthusiastic: {
        headline: "Top Class Cab & Rental Service in Kadapa!",
        text: (name, tags, note) =>
          `Outstanding experience with ${name}! The cars are in showroom condition, drivers are polite and disciplined, and pricing is super fair.${note ? ` Loved how they arranged ${note}!` : ""} From booking to drop-off, everything was top-notch. Will always book with them!`,
      },
    },
  },

  TATTOO_STUDIO: {
    type: "TATTOO_STUDIO",
    label: "Tattoo & Body Piercing Studio",
    tagline: "Custom Tattoo Art, Realistic Portraits, Sterile Piercings & Cover-Up Specialists",
    tags: [
      "Custom Tattoo Art",
      "Hygienic Studio",
      "Skilled Artist",
      "Sterilized Needles",
      "Portrait Tattoo",
      "Ear & Nose Piercing",
      "Cover-Up Tattoo",
      "Painless Experience",
      "Aftercare Guidance",
      "Fair Pricing",
    ],
    placeholder: "Mention tattoo design (portrait, lettering, tribal), piercing, artist skill or hygiene...",
    keywords: "karthik tattoo studio kts kadapa professional tattoo artist body piercing ear piercing nose piercing helix piercing custom tattoo portrait tattoo cover up tattoo sterile single use needles hygienic studio wireless tattoo machine pain free tattoo aftercare healing advice",
    reviewDrafts: {
      direct: {
        headline: "Superb Tattoo Detailing & 100% Hygienic Studio!",
        text: (name, tags, note) =>
          `Got inked at ${name} and the outcome exceeded my expectations! The ${tags || "skilled artist and sterile setup"} made the whole session comfortable.${note ? ` They did an extraordinary job on ${note}.` : ""} Extremely clean studio with fresh single-use needles and quality ink. Best tattoo studio in Kadapa!`,
      },
      detailed: {
        headline: "Skilled Tattoo Artist, Painless Piercing & Great Aftercare",
        text: (name, tags, note) =>
          `Visited ${name} after hearing great reviews, and they totally lived up to the reputation. The artist took time during consultation to refine the design to perfection.${note ? ` Specifically impressed with their work on ${note}.` : ""} Super hygienic setup, opened sterilized needles right in front of me, and gave clear aftercare instructions. Highly recommended!`,
      },
      enthusiastic: {
        headline: "Master of Tattoo Art & Safe Piercings in Kadapa!",
        text: (name, tags, note) =>
          `Hands down the best tattoo studio in Rayalaseema! ${name} creates true art on skin with crisp line work and smooth shading.${note ? ` Loved how they customized ${note}!` : ""} Friendly vibe, reasonable pricing, and utmost hygiene. 10/10 experience!`,
      },
    },
  },

  APPLIANCE_REPAIR: {
    type: "APPLIANCE_REPAIR",
    label: "AC, Fridge & Appliance Repair",
    tagline: "Top #1 AC Repair, Refrigerator & Washing Machine Doorstep Services",
    tags: [
      "Deep AC Jet Wash",
      "Quick Cooling Restored",
      "Fast Doorstep Service",
      "AC Gas Refilling",
      "Affordable & Fair Rates",
      "Genuine Spare Parts",
      "Expert Fridge Repair",
      "Washing Machine Fixed",
      "Professional Technician",
      "Prompt Same-Day Visit",
    ],
    placeholder: "Mention appliance (AC, Fridge, Washing Machine) or repair work...",
    keywords:
      "as refrigeration kadapa top ac repair best ac service ac gas charging r32 r410 r22 deep jet wash ac foam wash ac installation fridge repair kadapa refrigerator gas charging single door double door washing machine repair kadapa doorstep appliance repair 24 hours ac mechanic",
    reviewDrafts: {
      direct: {
        headline: "Super Fast & Reliable AC Service in Kadapa!",
        text: (name, tags, note) =>
          `Called ${name} for our appliance service and was very impressed with their ${tags || "quick cooling restoration and prompt doorstep visit"}.${note ? ` Specifically pleased with: ${note}.` : ""} The technician arrived on time and resolved the issue efficiently. Highly recommended!`,
      },
      detailed: {
        headline: "Expert Diagnosis, Genuine Spares & Honest Pricing",
        text: (name, tags, note) =>
          `Had an issue with our appliance and reached out to ${name}. The technician diagnosed the fault accurately, used genuine parts, and gave a very fair quote without any hidden charges. Their ${tags || "deep jet wash and clean workmanship"} restored perfect performance.${note ? ` Handled ${note} with complete expertise.` : ""} Truly the best appliance repair service in Kadapa!`,
      },
      enthusiastic: {
        headline: "Top #1 AC & Appliance Technicians in Rayalaseema!",
        text: (name, tags, note) =>
          `Fantastic experience with ${name}! From scheduling to doorstep arrival, everything was lightning fast. They fixed our ${tags || "cooling problem and delivered great results"}.${note ? ` Special appreciation for ${note}.` : ""} 10/10 service, will definitely call them again!`,
      },
    },
  },

  GENERAL: {
    type: "GENERAL",
    label: "General Business & Services",
    tagline: "Reliable Quality, Friendly Service & Great Value",
    tags: [
      "Great Service",
      "Friendly Staff",
      "Prompt Response",
      "High Quality",
      "Fair Pricing",
      "Highly Recommended",
    ],
    placeholder: "Mention any specific highlight or experience (optional)...",
    keywords: "great customer service, reliable business, friendly staff, fair pricing, highly recommended",
    reviewDrafts: {
      direct: {
        headline: "Great Service & Experience!",
        text: (name, tags, note) =>
          `Very satisfied with ${name}! The ${tags || "great service and friendly staff"} made the visit pleasant.${note ? ` Appreciated the help with ${note}.` : ""} Definitely recommend!`,
      },
      detailed: {
        headline: "Consistently Top-Tier & Professional",
        text: (name, tags, note) =>
          `From start to finish, ${name} delivered a wonderful experience. You can really feel their commitment to customer satisfaction, especially regarding ${tags || "professionalism and fair pricing"}.${note ? ` Great handling of ${note}.` : ""} Truly a 5-star team that deserves praise.`,
      },
      enthusiastic: {
        headline: "5 Stars All the Way!",
        text: (name, tags, note) =>
          `Such a great experience with ${name}! Love their ${tags || "attentive support and dedication to quality"}.${note ? ` Especially impressed with ${note}.` : ""} 10/10 recommend to friends and family!`,
      },
    },
  },
};

/**
 * Intelligent, deterministic industry classifier.
 * Uses exact word boundary matching and prioritizes the merchant's explicit CATEGORY,
 * then NAME, then TAGLINE to avoid substring collisions (e.g. "treatment" -> "eat" or "mobile app" -> "mobile").
 */
export function detectIndustry(
  name: string = "",
  category: string = "",
  tagline: string = ""
): IndustryConfig {
  const normCat = (" " + category + " ").toLowerCase();
  const normName = (" " + name + " ").toLowerCase();
  const normTag = (" " + tagline + " ").toLowerCase();

  const hasWord = (str: string, word: string): boolean => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
    return regex.test(str);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // STEP 1: CATEGORY-FIRST MATCHING (Highest Confidence)
  // ═══════════════════════════════════════════════════════════════════════
  if (
    hasWord(normCat, "software") ||
    hasWord(normCat, "it solutions") ||
    hasWord(normCat, "information technology") ||
    hasWord(normCat, "technology") ||
    hasWord(normCat, "tech") ||
    hasWord(normCat, "developer") ||
    hasWord(normCat, "coding") ||
    hasWord(normCat, "programming") ||
    normCat.includes("training institute") ||
    normCat.includes("web dev") ||
    normCat.includes("app dev") ||
    normCat.includes("cloud computing")
  ) {
    return INDUSTRY_CONFIGS.SOFTWARE_IT;
  }

  if (
    hasWord(normCat, "dental") ||
    hasWord(normCat, "clinic") ||
    hasWord(normCat, "doctor") ||
    hasWord(normCat, "hospital") ||
    hasWord(normCat, "healthcare") ||
    hasWord(normCat, "physio") ||
    hasWord(normCat, "medical") ||
    hasWord(normCat, "pharma") ||
    hasWord(normCat, "pharmacy") ||
    hasWord(normCat, "ayurveda") ||
    hasWord(normCat, "homeopathy") ||
    hasWord(normCat, "diagnostic")
  ) {
    return INDUSTRY_CONFIGS.HEALTHCARE_CLINIC;
  }

  if (
    hasWord(normCat, "kitchen") ||
    hasWord(normCat, "restaurant") ||
    hasWord(normCat, "cafe") ||
    hasWord(normCat, "café") ||
    hasWord(normCat, "food") ||
    hasWord(normCat, "bakery") ||
    hasWord(normCat, "bistro") ||
    hasWord(normCat, "catering") ||
    hasWord(normCat, "dining") ||
    normCat.includes("cloud kitchen") ||
    hasWord(normCat, "sweets") ||
    hasWord(normCat, "tiffin") ||
    hasWord(normCat, "mess") ||
    hasWord(normCat, "fast food")
  ) {
    return INDUSTRY_CONFIGS.RESTAURANT_FOOD;
  }

  if (
    hasWord(normCat, "photography") ||
    hasWord(normCat, "photo") ||
    hasWord(normCat, "photos") ||
    hasWord(normCat, "photographer") ||
    hasWord(normCat, "gift") ||
    hasWord(normCat, "gifts") ||
    hasWord(normCat, "framing") ||
    hasWord(normCat, "videography") ||
    (hasWord(normCat, "studio") && (normCat.includes("photo") || normCat.includes("gift")))
  ) {
    return INDUSTRY_CONFIGS.PHOTOGRAPHY_STUDIO;
  }

  if (
    hasWord(normCat, "salon") ||
    hasWord(normCat, "spa") ||
    hasWord(normCat, "beauty") ||
    hasWord(normCat, "hair") ||
    hasWord(normCat, "parlour") ||
    hasWord(normCat, "parlor") ||
    hasWord(normCat, "makeover") ||
    hasWord(normCat, "bridal") ||
    normCat.includes("beauty academy") ||
    normCat.includes("beauty service")
  ) {
    return INDUSTRY_CONFIGS.SALON_BEAUTY;
  }

  if (
    hasWord(normCat, "fashion") ||
    hasWord(normCat, "clothing") ||
    hasWord(normCat, "garment") ||
    hasWord(normCat, "garments") ||
    hasWord(normCat, "apparel") ||
    hasWord(normCat, "tailor") ||
    hasWord(normCat, "tailoring") ||
    hasWord(normCat, "textile") ||
    hasWord(normCat, "textiles") ||
    hasWord(normCat, "boutique") ||
    hasWord(normCat, "saree") ||
    hasWord(normCat, "sarees") ||
    hasWord(normCat, "retail") ||
    hasWord(normCat, "jewellery") ||
    hasWord(normCat, "jewelry") ||
    hasWord(normCat, "optical") ||
    hasWord(normCat, "optics") ||
    hasWord(normCat, "store") ||
    (hasWord(normCat, "shop") && !normCat.includes("photo") && !normCat.includes("gift")) ||
    hasWord(normCat, "supermarket") ||
    hasWord(normCat, "mart")
  ) {
    return INDUSTRY_CONFIGS.RETAIL_SHOP;
  }

  if (
    hasWord(normCat, "garage") ||
    hasWord(normCat, "auto") ||
    hasWord(normCat, "automobile") ||
    hasWord(normCat, "mechanic") ||
    hasWord(normCat, "bike service") ||
    hasWord(normCat, "two wheeler") ||
    hasWord(normCat, "car service")
  ) {
    return INDUSTRY_CONFIGS.AUTO_GARAGE;
  }

  if (
    hasWord(normCat, "gym") ||
    hasWord(normCat, "fitness") ||
    hasWord(normCat, "crossfit") ||
    hasWord(normCat, "workout") ||
    hasWord(normCat, "yoga") ||
    hasWord(normCat, "pilates")
  ) {
    return INDUSTRY_CONFIGS.FITNESS_GYM;
  }

  if (
    hasWord(normCat, "hotel") ||
    hasWord(normCat, "resort") ||
    hasWord(normCat, "lodge") ||
    hasWord(normCat, "lodging") ||
    hasWord(normCat, "hospitality") ||
    hasWord(normCat, "guest house") ||
    hasWord(normCat, "stay")
  ) {
    return INDUSTRY_CONFIGS.HOTEL_HOSPITALITY;
  }

  if (
    hasWord(normCat, "legal") ||
    hasWord(normCat, "law") ||
    hasWord(normCat, "advocate") ||
    hasWord(normCat, "tax") ||
    hasWord(normCat, "audit") ||
    hasWord(normCat, "accounting") ||
    hasWord(normCat, "financial") ||
    hasWord(normCat, "properties") ||
    hasWord(normCat, "realtor")
  ) {
    return INDUSTRY_CONFIGS.PROFESSIONAL_SERVICES;
  }

  if (
    hasWord(normCat, "gold") ||
    hasWord(normCat, "gold buyer") ||
    hasWord(normCat, "gold buyers") ||
    hasWord(normCat, "pledged gold") ||
    hasWord(normCat, "jewellery valuation") ||
    hasWord(normCat, "gold loan release")
  ) {
    return INDUSTRY_CONFIGS.GOLD_BUYERS;
  }

  if (
    hasWord(normCat, "tours") ||
    hasWord(normCat, "travel") ||
    hasWord(normCat, "travels") ||
    hasWord(normCat, "tourism") ||
    hasWord(normCat, "cab") ||
    hasWord(normCat, "cabs") ||
    hasWord(normCat, "taxi") ||
    hasWord(normCat, "car rental") ||
    hasWord(normCat, "self drive") ||
    hasWord(normCat, "self-drive") ||
    hasWord(normCat, "tour operator") ||
    hasWord(normCat, "travel agency") ||
    hasWord(normCat, "transports") ||
    hasWord(normCat, "transportation") ||
    normCat.includes("tours and travels") ||
    normCat.includes("tours & travels")
  ) {
    return INDUSTRY_CONFIGS.TOURS_TRAVELS;
  }

  if (
    hasWord(normCat, "tattoo") ||
    hasWord(normCat, "tattoos") ||
    hasWord(normCat, "piercing") ||
    hasWord(normCat, "piercings") ||
    hasWord(normCat, "body art") ||
    normCat.includes("tattoo studio") ||
    normCat.includes("body piercing") ||
    normCat.includes("ear piercing") ||
    normCat.includes("nose piercing")
  ) {
    return INDUSTRY_CONFIGS.TATTOO_STUDIO;
  }

  if (
    hasWord(normCat, "refrigeration") ||
    hasWord(normCat, "refrigerator") ||
    hasWord(normCat, "fridge") ||
    hasWord(normCat, "air conditioning") ||
    hasWord(normCat, "ac repair") ||
    hasWord(normCat, "ac service") ||
    hasWord(normCat, "appliance repair") ||
    hasWord(normCat, "washing machine") ||
    normCat.includes("air conditioning repair") ||
    normCat.includes("refrigerator repair") ||
    normCat.includes("washing machine repair")
  ) {
    return INDUSTRY_CONFIGS.APPLIANCE_REPAIR;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STEP 2: BUSINESS NAME MATCHING (If category was generic/unspecified)
  // ═══════════════════════════════════════════════════════════════════════
  if (
    hasWord(normName, "technologies") ||
    hasWord(normName, "technology") ||
    hasWord(normName, "infotech") ||
    hasWord(normName, "software") ||
    (hasWord(normName, "solutions") && (normName.includes("tech") || normName.includes("it")))
  ) {
    return INDUSTRY_CONFIGS.SOFTWARE_IT;
  }

  if (
    hasWord(normName, "photography") ||
    hasWord(normName, "photos") ||
    hasWord(normName, "photo") ||
    (hasWord(normName, "studio") &&
      (normCat.includes("photo") ||
        normCat.includes("gift") ||
        normCat.includes("framing") ||
        normTag.includes("photo") ||
        normTag.includes("gift") ||
        normTag.includes("framing")))
  ) {
    return INDUSTRY_CONFIGS.PHOTOGRAPHY_STUDIO;
  }

  if (
    hasWord(normName, "dental") ||
    hasWord(normName, "clinic") ||
    hasWord(normName, "hospital") ||
    hasWord(normName, "doctor") ||
    hasWord(normName, "diagnostic")
  ) {
    return INDUSTRY_CONFIGS.HEALTHCARE_CLINIC;
  }

  if (
    hasWord(normName, "kitchen") ||
    hasWord(normName, "restaurant") ||
    hasWord(normName, "cafe") ||
    hasWord(normName, "café") ||
    hasWord(normName, "food") ||
    hasWord(normName, "biryani") ||
    hasWord(normName, "bakery") ||
    hasWord(normName, "bakes") ||
    hasWord(normName, "sweets") ||
    hasWord(normName, "dhaba") ||
    hasWord(normName, "tiffin") ||
    hasWord(normName, "mess") ||
    hasWord(normName, "yummy") ||
    hasWord(normName, "pizza") ||
    hasWord(normName, "burger")
  ) {
    return INDUSTRY_CONFIGS.RESTAURANT_FOOD;
  }

  if (
    hasWord(normName, "salon") ||
    hasWord(normName, "spa") ||
    hasWord(normName, "beauty") ||
    hasWord(normName, "hair") ||
    hasWord(normName, "parlour") ||
    hasWord(normName, "parlor") ||
    hasWord(normName, "makeover") ||
    hasWord(normName, "bridal") ||
    normName.includes("beauty academy") ||
    normName.includes("fashion beauty")
  ) {
    return INDUSTRY_CONFIGS.SALON_BEAUTY;
  }

  if (
    hasWord(normName, "fashions") ||
    hasWord(normName, "fashion") ||
    hasWord(normName, "silks") ||
    hasWord(normName, "boutique") ||
    hasWord(normName, "textiles") ||
    hasWord(normName, "sarees") ||
    hasWord(normName, "dresses") ||
    hasWord(normName, "garments") ||
    hasWord(normName, "clothing") ||
    (hasWord(normName, "studio") &&
      (normName.includes("fashion") ||
        normTag.includes("designer") ||
        normTag.includes("tailor") ||
        normTag.includes("wear")))
  ) {
    return INDUSTRY_CONFIGS.RETAIL_SHOP;
  }

  if (
    hasWord(normName, "garage") ||
    hasWord(normName, "motors") ||
    hasWord(normName, "mechanic") ||
    hasWord(normName, "automotive")
  ) {
    return INDUSTRY_CONFIGS.AUTO_GARAGE;
  }

  if (hasWord(normName, "gym") || hasWord(normName, "fitness")) {
    return INDUSTRY_CONFIGS.FITNESS_GYM;
  }

  if (
    hasWord(normName, "hotel") ||
    hasWord(normName, "resort") ||
    hasWord(normName, "residency") ||
    hasWord(normName, "lodge")
  ) {
    return INDUSTRY_CONFIGS.HOTEL_HOSPITALITY;
  }

  if (
    hasWord(normName, "gold") ||
    normName.includes("vr gold") ||
    normName.includes("gold buyer") ||
    normName.includes("gold buyers")
  ) {
    return INDUSTRY_CONFIGS.GOLD_BUYERS;
  }

  if (
    hasWord(normName, "tours") ||
    hasWord(normName, "travels") ||
    hasWord(normName, "travel") ||
    hasWord(normName, "cabs") ||
    hasWord(normName, "cab") ||
    hasWord(normName, "taxi") ||
    hasWord(normName, "self drive") ||
    hasWord(normName, "self-drive") ||
    hasWord(normName, "transports") ||
    normName.includes("mana tours") ||
    normName.includes("tours & travels") ||
    normName.includes("tours and travels")
  ) {
    return INDUSTRY_CONFIGS.TOURS_TRAVELS;
  }

  if (
    hasWord(normName, "tattoo") ||
    hasWord(normName, "tattoos") ||
    hasWord(normName, "piercing") ||
    hasWord(normName, "piercings") ||
    normName.includes("tattoo studio") ||
    normName.includes("kts") ||
    normName.includes("karthik tattoo")
  ) {
    return INDUSTRY_CONFIGS.TATTOO_STUDIO;
  }

  if (
    hasWord(normName, "refrigeration") ||
    hasWord(normName, "refrigerations") ||
    hasWord(normName, "refrigerator") ||
    hasWord(normName, "fridge") ||
    hasWord(normName, "appliances") ||
    hasWord(normName, "appliance") ||
    normName.includes("as refrigeration") ||
    normName.includes("ac repair") ||
    normName.includes("ac service")
  ) {
    return INDUSTRY_CONFIGS.APPLIANCE_REPAIR;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STEP 3: TAGLINE CONTEXTUAL MATCHING (Precise multi-word phrases)
  // ═══════════════════════════════════════════════════════════════════════
  if (
    hasWord(normTag, "software") ||
    normTag.includes("app development") ||
    normTag.includes("web development") ||
    normTag.includes("cloud solutions") ||
    normTag.includes("tech solutions")
  ) {
    return INDUSTRY_CONFIGS.SOFTWARE_IT;
  }

  if (
    normTag.includes("photography") ||
    normTag.includes("photo studio") ||
    normTag.includes("photo framing") ||
    normTag.includes("photo shoot")
  ) {
    return INDUSTRY_CONFIGS.PHOTOGRAPHY_STUDIO;
  }

  if (
    normTag.includes("grafix") ||
    normTag.includes("graphic") ||
    normTag.includes("flex") ||
    normTag.includes("banner") ||
    normTag.includes("sign board") ||
    normTag.includes("visiting card") ||
    normTag.includes("offset") ||
    normTag.includes("printing")
  ) {
    return INDUSTRY_CONFIGS.PRINTING_GRAPHICS;
  }

  if (
    normTag.includes("gold") ||
    normTag.includes("pledged gold") ||
    normTag.includes("sell gold")
  ) {
    return INDUSTRY_CONFIGS.GOLD_BUYERS;
  }

  if (
    normTag.includes("teeth") ||
    normTag.includes("dental") ||
    normTag.includes("patient care") ||
    normTag.includes("treatment")
  ) {
    return INDUSTRY_CONFIGS.HEALTHCARE_CLINIC;
  }

  if (
    normTag.includes("biryani") ||
    normTag.includes("dining") ||
    normTag.includes("delicious food") ||
    normTag.includes("tasty food") ||
    normTag.includes("fresh food")
  ) {
    return INDUSTRY_CONFIGS.RESTAURANT_FOOD;
  }

  if (
    normTag.includes("designer wear") ||
    normTag.includes("clothing") ||
    normTag.includes("tailoring") ||
    normTag.includes("shopping")
  ) {
    return INDUSTRY_CONFIGS.RETAIL_SHOP;
  }

  if (
    normTag.includes("tours") ||
    normTag.includes("travels") ||
    normTag.includes("cab") ||
    normTag.includes("taxi") ||
    normTag.includes("self drive") ||
    normTag.includes("car rental") ||
    normTag.includes("airport drop") ||
    normTag.includes("darshan") ||
    normTag.includes("pilgrimage")
  ) {
    return INDUSTRY_CONFIGS.TOURS_TRAVELS;
  }

  if (
    normTag.includes("tattoo") ||
    normTag.includes("piercing") ||
    normTag.includes("body art") ||
    normTag.includes("get inked")
  ) {
    return INDUSTRY_CONFIGS.TATTOO_STUDIO;
  }

  if (
    normTag.includes("refrigeration") ||
    normTag.includes("ac repair") ||
    normTag.includes("ac service") ||
    normTag.includes("air conditioner") ||
    normTag.includes("washing machine") ||
    normTag.includes("fridge repair")
  ) {
    return INDUSTRY_CONFIGS.APPLIANCE_REPAIR;
  }

  return INDUSTRY_CONFIGS.GENERAL;
}
