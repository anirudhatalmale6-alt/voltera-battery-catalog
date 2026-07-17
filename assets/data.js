// Sample battery catalog data.
// In the final build this data is served from the admin panel / database —
// products, images, specs and prices are all editable there.
window.PRODUCTS = [
  {
    id: "power-lifepo4",
    name: "PowerCore 100",
    tagline: "12V 100Ah LiFePO4 Deep-Cycle",
    category: "Lithium",
    image: "assets/img/power-lifepo4.svg",
    price: "$549",
    summary: "A drop-in lithium replacement built for solar, RV and off-grid use. Over 4,000 cycles and half the weight of lead-acid.",
    benefits: [
      "4,000+ deep-cycle life at 80% DoD",
      "Built-in smart BMS protection",
      "Lightweight — 11.5 kg",
      "5-year warranty"
    ],
    specs: {
      "Nominal Voltage": "12.8 V",
      "Capacity": "100 Ah (1280 Wh)",
      "Chemistry": "LiFePO4",
      "Cycle Life": "4,000+ @ 80% DoD",
      "Max Continuous Discharge": "100 A",
      "Weight": "11.5 kg",
      "Dimensions": "330 × 173 × 220 mm",
      "Operating Temp": "-20°C to 60°C"
    }
  },
  {
    id: "marine-deep",
    name: "MarineCell 200",
    tagline: "12V 200Ah Deep Cycle",
    category: "Deep Cycle",
    image: "assets/img/marine-deep.svg",
    price: "$789",
    summary: "High-capacity deep-cycle power for boats and marine electronics, with vibration-resistant construction for life on the water.",
    benefits: [
      "Huge 200Ah usable capacity",
      "Vibration & corrosion resistant",
      "Ideal for trolling motors & house banks",
      "Maintenance-free"
    ],
    specs: {
      "Nominal Voltage": "12.8 V",
      "Capacity": "200 Ah (2560 Wh)",
      "Chemistry": "LiFePO4",
      "Cycle Life": "3,500+ @ 80% DoD",
      "Max Continuous Discharge": "150 A",
      "Weight": "20.4 kg",
      "Dimensions": "522 × 240 × 219 mm",
      "Operating Temp": "-20°C to 60°C"
    }
  },
  {
    id: "ultralite-24",
    name: "UltraLite 24",
    tagline: "24V 50Ah Lithium",
    category: "Lithium",
    image: "assets/img/ultralite-24.svg",
    price: "$629",
    summary: "A compact 24V lithium pack for e-mobility, robotics and light industrial use where weight and space really matter.",
    benefits: [
      "24V system in a compact case",
      "Fast 0.5C charging",
      "Bluetooth state-of-charge monitoring",
      "Only 9.8 kg"
    ],
    specs: {
      "Nominal Voltage": "25.6 V",
      "Capacity": "50 Ah (1280 Wh)",
      "Chemistry": "LiFePO4",
      "Cycle Life": "4,000+ @ 80% DoD",
      "Max Continuous Discharge": "80 A",
      "Weight": "9.8 kg",
      "Dimensions": "305 × 168 × 210 mm",
      "Operating Temp": "-20°C to 55°C"
    }
  },
  {
    id: "solarmax-rack",
    name: "SolarMax Rack",
    tagline: "48V 100Ah Server-Rack",
    category: "Solar Storage",
    image: "assets/img/solarmax-rack.svg",
    price: "$1,899",
    summary: "A 48V rack-mount module for solar and backup systems. Stack up to 16 units and monitor them over CAN/RS485.",
    benefits: [
      "5.12 kWh per module",
      "Stackable to 80+ kWh",
      "CAN / RS485 inverter comms",
      "Front-panel status display"
    ],
    specs: {
      "Nominal Voltage": "51.2 V",
      "Capacity": "100 Ah (5120 Wh)",
      "Chemistry": "LiFePO4",
      "Cycle Life": "6,000+ @ 80% DoD",
      "Max Continuous Discharge": "100 A",
      "Weight": "42 kg",
      "Dimensions": "442 × 420 × 133 mm (2U)",
      "Communication": "CAN, RS485"
    }
  },
  {
    id: "agm-75",
    name: "GuardAGM 75",
    tagline: "12V 75Ah AGM Sealed",
    category: "AGM",
    image: "assets/img/agm-75.svg",
    price: "$219",
    summary: "A sealed maintenance-free AGM battery for backup power, alarms and general standby use. Spill-proof and reliable.",
    benefits: [
      "Sealed, spill-proof AGM",
      "Low self-discharge",
      "Great for UPS & standby",
      "No maintenance required"
    ],
    specs: {
      "Nominal Voltage": "12 V",
      "Capacity": "75 Ah",
      "Chemistry": "AGM (Lead-Acid)",
      "Design Life": "5–7 years float",
      "Terminal Type": "M6 bolt",
      "Weight": "22 kg",
      "Dimensions": "260 × 169 × 230 mm",
      "Operating Temp": "-15°C to 50°C"
    }
  },
  {
    id: "powerwall-5k",
    name: "HomeWall 5",
    tagline: "5.0 kWh Wall-Mount Storage",
    category: "Home Storage",
    image: "assets/img/powerwall-5k.svg",
    price: "$2,290",
    summary: "A sleek wall-mounted home battery that stores solar energy for the evening and keeps essentials running in an outage.",
    benefits: [
      "5.0 kWh usable capacity",
      "Slim wall-mount design",
      "App energy monitoring",
      "Backup-ready with ATS"
    ],
    specs: {
      "Nominal Voltage": "51.2 V",
      "Usable Capacity": "5.0 kWh",
      "Chemistry": "LiFePO4",
      "Cycle Life": "6,000+ @ 90% DoD",
      "Max Output": "5 kW peak / 3.5 kW cont.",
      "Weight": "48 kg",
      "Dimensions": "600 × 400 × 150 mm",
      "Protection": "IP65 indoor/outdoor"
    }
  },
  {
    id: "startpro-agm",
    name: "StartPro EFB",
    tagline: "12V 60Ah Start-Stop",
    category: "Automotive",
    image: "assets/img/startpro-agm.svg",
    price: "$179",
    summary: "An enhanced flooded battery engineered for modern start-stop vehicles, delivering strong cold-cranking power year round.",
    benefits: [
      "High cold-cranking amps",
      "Built for start-stop cycling",
      "Enhanced charge acceptance",
      "Maintenance-free"
    ],
    specs: {
      "Nominal Voltage": "12 V",
      "Capacity": "60 Ah",
      "Cold Cranking Amps": "640 A (EN)",
      "Chemistry": "EFB (Lead-Acid)",
      "Terminal Layout": "0 (right +)",
      "Weight": "16.8 kg",
      "Dimensions": "242 × 175 × 190 mm",
      "Warranty": "4 years"
    }
  },
  {
    id: "portable-500",
    name: "GoPower 500",
    tagline: "500Wh Portable Power Station",
    category: "Portable",
    image: "assets/img/portable-500.svg",
    price: "$459",
    summary: "A grab-and-go power station for camping, work sites and emergencies. AC, USB-C and 12V outputs in one compact unit.",
    benefits: [
      "500Wh in a portable case",
      "230V AC + USB-C PD + 12V",
      "Recharge from solar or wall",
      "LCD power display"
    ],
    specs: {
      "Capacity": "500 Wh",
      "Chemistry": "LiFePO4",
      "AC Output": "230V / 500W (1000W peak)",
      "USB-C": "100W PD",
      "Recharge": "Wall 4h / Solar 200W",
      "Weight": "6.2 kg",
      "Dimensions": "300 × 195 × 195 mm",
      "Cycle Life": "3,000+"
    }
  }
];
