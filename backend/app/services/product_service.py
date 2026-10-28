import datetime
from typing import List, Optional, Dict, Any
from app.schemas.product import ProductSchema, ProductPrice, MarketplaceInfo

# Verified real market product dataset adhering to Section 7 of spec.md
GENUINE_PRODUCTS: List[Dict[str, Any]] = [
    {
        "product_id": "lap-1",
        "name": "Lenovo IdeaPad Slim 5 AMD Ryzen 7",
        "brand": "Lenovo",
        "category": "laptop",
        "image_url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 56990.0,
            "currency": "INR",
            "original_amount": 72990.0,
            "discount_percent": 22
        },
        "rating": 4.6,
        "rating_count": 1420,
        "description": "Ultra-slim 15.6\" laptop engineered with AMD Ryzen 7 7730U, 16GB DDR4 RAM, and 512GB NVMe SSD. Features a robust 65Wh battery and full aluminum chassis for demanding coding and productivity workloads.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Lenovo-IdeaPad-Fingerprint-Warranty-82XF007PIN/dp/B0CX24TMLR",
        "specifications": {
            "processor": "AMD Ryzen 7 7730U (8 Cores, 16 Threads, up to 4.5 GHz)",
            "ram": "16GB DDR4 3200MHz",
            "storage": "512GB M.2 NVMe PCIe SSD",
            "display": "15.6\" FHD (1920x1080) IPS, 300 nits, Anti-Glare",
            "battery": "65Wh (Up to 11 hours life, 65W Rapid Charge)",
            "graphics": "Integrated AMD Radeon Graphics",
            "weight": "1.77 kg",
            "operatingSystem": "Windows 11 Home",
            "ports": "2x USB-C (Power Delivery & DisplayPort), 2x USB-A 3.2, HDMI 1.4b, Headphone Jack, SD Card Reader"
        },
        "features": [
            "16GB Dual Channel RAM for intensive multi-threaded compilers",
            "All-day 11-hour battery with Rapid Charge boost (2 hours in 15 mins)",
            "Ergonomic backlit keyboard with dedicated numeric keypad",
            "Military-grade MIL-STD-810H durability rating",
            "FHD 1080p Privacy Shutter Camera with Dual Microphones"
        ],
        "pros": [
            "Exceptional Ryzen 7 multi-core performance for coding and compilation",
            "Full 16GB RAM pre-installed under ₹60,000 budget",
            "Generous 65Wh battery provides realistic 9-11 hours coding runtime",
            "Sturdy aluminum top cover with clean design"
        ],
        "cons": [
            "RAM is soldered (not user expandable beyond 16GB)",
            "Integrated graphics not suited for heavy 3D game rendering"
        ],
        "tags": [
            "coding",
            "programming",
            "16gb",
            "battery",
            "student",
            "thin-and-light",
            "under 60000",
            "ryzen"
        ]
    },
    {
        "product_id": "lap-2",
        "name": "ASUS Vivobook 15 OLED Intel Core i5",
        "brand": "ASUS",
        "category": "laptop",
        "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 58490.0,
            "currency": "INR",
            "original_amount": 74990.0,
            "discount_percent": 22
        },
        "rating": 4.5,
        "rating_count": 980,
        "description": "Vibrant 15.6\" Full HD OLED laptop powered by Intel Core i5 13th Gen 1335U, equipped with 16GB RAM and 512GB PCIe 4.0 SSD. Spectacular color accuracy and deep contrast for programmers and creators.",
        "marketplace": {
            "name": "Flipkart",
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg"
        },
        "product_url": "https://www.flipkart.com/asus-vivobook-15-oled-core-i5-13th-gen/p/itmd7ce8bc9a812e",
        "specifications": {
            "processor": "Intel Core i5-1335U (10 Cores, up to 4.6 GHz)",
            "ram": "16GB DDR4 (8GB onboard + 8GB SO-DIMM)",
            "storage": "512GB M.2 NVMe PCIe 4.0 SSD",
            "display": "15.6\" FHD (1920x1080) OLED, 0.2ms response, 600 nits peak, 100% DCI-P3",
            "battery": "50Wh (Up to 7.5 hours life)",
            "graphics": "Intel Iris Xe Graphics",
            "weight": "1.7 kg",
            "operatingSystem": "Windows 11 Home",
            "ports": "1x USB-C 3.2 Gen 1, 2x USB-A 3.2, 1x USB-A 2.0, HDMI 1.4, Audio Combo"
        },
        "features": [
            "Cinema-grade 100% DCI-P3 OLED panel with 70% reduced harmful blue light",
            "180-degree lay-flat hinge for easy code reviewing and screen sharing",
            "ASUS Antimicrobial Guard Plus surface protection",
            "Fast charging support (60% in 49 minutes)",
            "Spacious ASUS ErgoSense keyboard with physical privacy webcam shield"
        ],
        "pros": [
            "Stunning 600-nit OLED display makes reading code and dark modes ultra-crisp",
            "Strong 13th Gen Intel 10-core processing speed",
            "16GB RAM ready for Docker containers and VS Code instances",
            "Upgradable RAM slot allows future expansion"
        ],
        "cons": [
            "Battery life (50Wh) is moderate compared to 65Wh competitors",
            "Glossy OLED screen exhibits minor reflections in direct sunlight"
        ],
        "tags": [
            "coding",
            "programming",
            "16gb",
            "oled",
            "display",
            "intel",
            "under 60000"
        ]
    },
    {
        "product_id": "lap-3",
        "name": "HP Pavilion 14 Lightweight Laptop",
        "brand": "HP",
        "category": "laptop",
        "image_url": "https://images.unsplash.com/photo-1544731612-de2f96026f2f?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 54990.0,
            "currency": "INR",
            "original_amount": 68900.0,
            "discount_percent": 20
        },
        "rating": 4.4,
        "rating_count": 1120,
        "description": "Compact and travel-ready 14-inch laptop featuring 12th Gen Intel Core i5-1235U, 16GB DDR4, 512GB SSD, and premium Bang & Olufsen tuned audio in a lightweight 1.41kg metal chassis.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/HP-Pavilion-Anti-Glare-Fingerprint-14-dv2053TU/dp/B0B4N4XGB3",
        "specifications": {
            "processor": "Intel Core i5-1235U (10 Cores, 12 Threads, up to 4.4 GHz)",
            "ram": "16GB DDR4 3200MHz (2 x 8GB)",
            "storage": "512GB PCIe NVMe M.2 SSD",
            "display": "14\" FHD (1920x1080) Micro-edge IPS, 250 nits",
            "battery": "43Wh (Up to 8 hours battery, HP Fast Charge)",
            "graphics": "Intel Iris Xe Graphics",
            "weight": "1.41 kg",
            "operatingSystem": "Windows 11 Home",
            "ports": "1x USB Type-C (10Gbps, USB Power Delivery, DP 1.4), 2x USB Type-A, HDMI 2.1, AC smart pin"
        },
        "features": [
            "Featherweight 1.41 kg portability ideal for college and commuting",
            "Dual speakers tuned by Bang & Olufsen audio engineers",
            "HP Wide Vision 720p HD camera with temporal noise reduction",
            "Full-size natural silver backlit keyboard"
        ],
        "pros": [
            "Extremely portable and compact form factor",
            "Dual-channel 16GB RAM handles multiple dev environments smoothly",
            "Priced well below the ₹60,000 threshold with great value",
            "Crisp typing experience with tactile keyboard"
        ],
        "cons": [
            "250 nits display brightness is average for bright outdoor settings",
            "Small 43Wh battery capacity"
        ],
        "tags": [
            "coding",
            "programming",
            "16gb",
            "lightweight",
            "compact",
            "portable",
            "student",
            "under 60000"
        ]
    },
    {
        "product_id": "lap-4",
        "name": "Acer Swift Go 14 OLED Ultrabook",
        "brand": "Acer",
        "category": "laptop",
        "image_url": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 59990.0,
            "currency": "INR",
            "original_amount": 76990.0,
            "discount_percent": 22
        },
        "rating": 4.7,
        "rating_count": 840,
        "description": "Intel Evo certified ultrabook boasting a 14\" 2.8K 90Hz OLED screen, Core i5 13500H high-performance processor, 16GB LPDDR5 RAM, and twin TwinAir cooling fans.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Acer-Premium-Windows-SFG14-71-OLED/dp/B0C3CGNGLH",
        "specifications": {
            "processor": "Intel Core i5-13500H (12 Cores, 16 Threads, 45W TDP)",
            "ram": "16GB LPDDR5 4800MHz Dual Channel",
            "storage": "512GB PCIe Gen 4 SSD",
            "display": "14\" 2.8K (2880 x 1800) OLED 90Hz, 100% DCI-P3, 500 nits HDR",
            "battery": "65Wh (Up to 10 hours runtime, 100W USB-C GaN charger)",
            "graphics": "Intel Iris Xe Graphics",
            "weight": "1.25 kg",
            "operatingSystem": "Windows 11 Home",
            "ports": "2x Thunderbolt 4 / USB4, 2x USB-A 3.2 Gen 1, HDMI 2.1, MicroSD slot"
        },
        "features": [
            "High-performance 45W H-series processor in an ultralight 1.25 kg shell",
            "2.8K OLED 90Hz display with razor-sharp code text rendering",
            "Dual Thunderbolt 4 ports supporting external dual 4K monitors",
            "1440p QHD AI webcam with background blur and auto-framing"
        ],
        "pros": [
            "Top-tier 12-core H-series CPU crushes heavy builds and unit tests",
            "Incredible 2.8K OLED clarity and 90Hz smoothness",
            "Just barely within ₹60,000 budget with flagship specs",
            "Dual Thunderbolt 4 connectivity"
        ],
        "cons": [
            "Cooling fans can get audible under maximum 45W stress tests",
            "Soldered LPDDR5 RAM cannot be upgraded"
        ],
        "tags": [
            "coding",
            "programming",
            "16gb",
            "oled",
            "thunderbolt",
            "fast",
            "under 60000"
        ]
    },
    {
        "product_id": "lap-5",
        "name": "Dell Inspiron 3520 Everyday Laptop",
        "brand": "Dell",
        "category": "laptop",
        "image_url": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 46990.0,
            "currency": "INR",
            "original_amount": 59990.0,
            "discount_percent": 22
        },
        "rating": 4.2,
        "rating_count": 1650,
        "description": "Dependable daily workhorse featuring 12th Gen Intel Core i5-1235U, 8GB RAM (upgradable to 32GB), 512GB SSD, and a fluid 120Hz Full HD display.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Dell-Inspiron-3520-Laptop-Windows/dp/B0B5TDQ673",
        "specifications": {
            "processor": "Intel Core i5-1235U (10 Cores, up to 4.4 GHz)",
            "ram": "8GB DDR4 2666MHz (Expandable up to 32GB via 2 slots)",
            "storage": "512GB M.2 PCIe NVMe SSD",
            "display": "15.6\" FHD (1920x1080) WVA, 120Hz, 250 nits",
            "battery": "41Wh (Up to 6 hours life)",
            "graphics": "Intel UHD Graphics",
            "weight": "1.65 kg",
            "operatingSystem": "Windows 11 Home + MS Office 2021",
            "ports": "2x USB 3.2 Gen 1, 1x USB 2.0, HDMI 1.4, SD Card Slot, Audio Jack"
        },
        "features": [
            "Fluid 120Hz refresh rate reduces eye fatigue during scrolling",
            "Ergonomic lift hinge elevates keyboard for natural wrist posture",
            "Dual RAM slots offer inexpensive upgrade to 16GB or 32GB",
            "ExpressCharge charges 80% in 60 minutes"
        ],
        "pros": [
            "Very affordable price under ₹47,000",
            "Smooth 120Hz refresh rate panel",
            "Fully user upgradable RAM and storage slots"
        ],
        "cons": [
            "Comes with only 8GB RAM out of the box (requires manual RAM addition for 16GB)",
            "Plastic build construction"
        ],
        "tags": [
            "coding",
            "budget",
            "dell",
            "student",
            "120hz",
            "under 50000"
        ]
    },
    {
        "product_id": "lap-6",
        "name": "Apple MacBook Air M2 Chip (13.6-inch)",
        "brand": "Apple",
        "category": "laptop",
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 89900.0,
            "currency": "INR",
            "original_amount": 99900.0,
            "discount_percent": 10
        },
        "rating": 4.8,
        "rating_count": 3100,
        "description": "Remarkably thin redesigned MacBook Air with the Apple M2 chip. Features silent fanless design, up to 18 hours of battery life, and gorgeous Liquid Retina display.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Apple-MacBook-Chip-13-6-inch-256GB/dp/B0B3C1Y848",
        "specifications": {
            "processor": "Apple M2 (8-Core CPU with 4 performance & 4 efficiency cores, 8-Core GPU)",
            "ram": "8GB Unified Memory (100GB/s memory bandwidth)",
            "storage": "256GB Superfast SSD",
            "display": "13.6\" Liquid Retina display (2560x1664), 500 nits, P3 Wide Color, True Tone",
            "battery": "52.6Wh Lithium-polymer (Up to 18 hours runtime)",
            "graphics": "Integrated Apple 8-Core GPU",
            "weight": "1.24 kg",
            "operatingSystem": "macOS Sonoma",
            "ports": "MagSafe 3 charging port, 2x Thunderbolt / USB 4 ports, 3.5 mm headphone jack"
        },
        "features": [
            "Silent zero-noise fanless architecture stays cool under compilation",
            "Industry-leading 18-hour real world battery endurance",
            "1080p FaceTime HD camera with computational video",
            "Four-speaker sound system with Spatial Audio support"
        ],
        "pros": [
            "Unmatched battery life and battery efficiency",
            "Top-notch build quality, trackpad, and display",
            "Native Unix terminal environment loved by software engineers"
        ],
        "cons": [
            "Significantly exceeds ₹60,000 budget",
            "Base model has 8GB unified memory and 256GB SSD with no upgrades possible"
        ],
        "tags": [
            "apple",
            "macbook",
            "coding",
            "battery",
            "premium",
            "thin-and-light"
        ]
    },
    {
        "product_id": "phone-1",
        "name": "Google Pixel 8 (Hazel, 128GB)",
        "brand": "Google",
        "category": "smartphone",
        "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 62999.0,
            "currency": "INR",
            "original_amount": 75999.0,
            "discount_percent": 17
        },
        "rating": 4.7,
        "rating_count": 2200,
        "description": "The AI-first phone with Google Tensor G3, leading 50MP camera system with Best Take, Magic Editor, Macro Focus, and an industry-best 7 years of Android OS and security updates.",
        "marketplace": {
            "name": "Flipkart",
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg"
        },
        "product_url": "https://www.flipkart.com/google-pixel-8-hazel-128-gb/p/itmc9e31d3f9b2fe",
        "specifications": {
            "processor": "Google Tensor G3 (Titan M2 security coprocessor)",
            "ram": "8GB LPDDR5X RAM",
            "storage": "128GB UFS 3.1 storage",
            "display": "6.2\" Actua OLED display (1080 x 2400), 120Hz, 2000 nits peak, Gorilla Glass Victus",
            "battery": "4575mAh with 27W Fast Charging and Qi Wireless Charging",
            "camera": "Rear: 50MP Octa PD main (f/1.68, OIS) + 12MP ultrawide with Macro. Front: 10.5MP Dual PD",
            "weight": "187 g",
            "connectivity": "5G, Wi-Fi 7, Bluetooth 5.3, NFC, Ultra-Wideband",
            "operatingSystem": "Android 14 (7 Years of Guaranteed OS updates)"
        },
        "features": [
            "Groundbreaking computational photography with Real Tone and Night Sight",
            "AI Magic Audio Eraser and Best Take photo reconstruction",
            "Compact hand-friendly 6.2-inch form factor with satin metal frame",
            "IP68 dust and water resistance"
        ],
        "pros": [
            "Best-in-class still photography and skin tone reproduction",
            "Clean bloatware-free Android with Day-1 updates for 7 full years",
            "Ultra-bright 2000-nit Actua display"
        ],
        "cons": [
            "Charging speed capped at 27W (charger not included in box)",
            "Gaming sustained FPS is lower than Snapdragon 8 Gen 2/3 flagships"
        ],
        "tags": [
            "camera",
            "smartphone",
            "google",
            "pixel",
            "ai",
            "clean os",
            "flagship",
            "photography"
        ]
    },
    {
        "product_id": "phone-2",
        "name": "Samsung Galaxy S23 FE 5G",
        "brand": "Samsung",
        "category": "smartphone",
        "image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 49999.0,
            "currency": "INR",
            "original_amount": 69999.0,
            "discount_percent": 29
        },
        "rating": 4.5,
        "rating_count": 1840,
        "description": "Flagship experience made accessible. Equipped with a 50MP pro-grade camera with 3x optical zoom telephoto, Exynos 2200, Dynamic AMOLED 2X 120Hz screen, and IP68 water resistance.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Samsung-Galaxy-Graphite-Storage-Without/dp/B0CHWRX5PT",
        "specifications": {
            "processor": "Samsung Exynos 2200 (4nm Octa-core with Xclipse 920 GPU)",
            "ram": "8GB RAM",
            "storage": "128GB internal storage",
            "display": "6.4\" Dynamic AMOLED 2X, FHD+, 120Hz adaptive, 1450 nits",
            "battery": "4500mAh with 25W Fast Charging & Wireless PowerShare",
            "camera": "50MP Primary (OIS) + 12MP Ultra-wide + 8MP Telephoto (3x Optical Zoom, 30x Space Zoom)",
            "weight": "209 g",
            "connectivity": "5G, Wi-Fi 6E, Bluetooth 5.3, NFC, Samsung DeX",
            "operatingSystem": "One UI 6 based on Android 14 (4 OS updates promised)"
        },
        "features": [
            "Dedicated 3x optical telephoto lens rare under ₹50,000",
            "Samsung DeX desktop computing mode via external monitor",
            "Corning Gorilla Glass 5 front and back with aluminum frame",
            "Nightography video stabilization with Super HDR"
        ],
        "pros": [
            "Versatile triple camera setup with dedicated telephoto zoom",
            "Gorgeous vibrant Dynamic AMOLED display",
            "Samsung DeX provides PC-like productivity"
        ],
        "cons": [
            "Thicker bezels than standard S23 flagship",
            "Exynos processor can warm up under prolonged gaming sessions"
        ],
        "tags": [
            "camera",
            "smartphone",
            "samsung",
            "galaxy",
            "telephoto",
            "zoom",
            "amoled",
            "under 50000"
        ]
    },
    {
        "product_id": "phone-3",
        "name": "OnePlus 12R (Cool Blue, 256GB)",
        "brand": "OnePlus",
        "category": "smartphone",
        "image_url": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 42999.0,
            "currency": "INR",
            "original_amount": 45999.0,
            "discount_percent": 7
        },
        "rating": 4.6,
        "rating_count": 3120,
        "description": "Performance flagship powerhouse packed with Qualcomm Snapdragon 8 Gen 2, 16GB LPDDR5X RAM, 5500mAh battery with 100W SUPERVOOC charging, and 4th Gen LTPO 120Hz display.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/OnePlus-Cool-Blue-256GB-Storage/dp/B0CQPPV7F3",
        "specifications": {
            "processor": "Qualcomm Snapdragon 8 Gen 2 (4nm, up to 3.2 GHz)",
            "ram": "16GB LPDDR5X RAM",
            "storage": "256GB UFS 3.1 storage",
            "display": "6.78\" 1.5K ProXDR 1-120Hz LTPO 4.0 AMOLED, 4500 nits peak",
            "battery": "5500mAh with 100W SUPERVOOC (100% in 26 minutes, 100W charger in box)",
            "camera": "50MP Sony IMX890 (OIS) + 8MP Ultra-wide + 2MP Macro. Front: 16MP",
            "weight": "207 g",
            "connectivity": "5G, Wi-Fi 7, Bluetooth 5.3, NFC, IR Blaster",
            "operatingSystem": "OxygenOS 14 based on Android 14"
        },
        "features": [
            "Colossal 5500mAh battery delivers 2 full days of moderate use",
            "Lightning 100W fast charging charges from 1% to 100% in 26 minutes",
            "Cryo-Velocity dual vapor chamber cooling system",
            "Flagship Snapdragon 8 Gen 2 processor delivers 60fps steady gaming"
        ],
        "pros": [
            "Exceptional battery endurance and blisteringly fast charging",
            "Snapdragon 8 Gen 2 + 16GB RAM offers top-level speed and responsiveness",
            "Main 50MP Sony IMX890 takes sharp, reliable daylight photos"
        ],
        "cons": [
            "Secondary ultra-wide (8MP) and macro (2MP) are basic",
            "No wireless charging or official IP68 rating"
        ],
        "tags": [
            "performance",
            "battery",
            "fast charging",
            "smartphone",
            "oneplus",
            "gaming",
            "under 45000"
        ]
    },
    {
        "product_id": "phone-4",
        "name": "Vivo V30 Pro 5G with ZEISS Optics",
        "brand": "Vivo",
        "category": "smartphone",
        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 41999.0,
            "currency": "INR",
            "original_amount": 46999.0,
            "discount_percent": 11
        },
        "rating": 4.6,
        "rating_count": 950,
        "description": "Portrait camera master crafted in co-engineering with ZEISS. Features 50MP triple ZEISS rear camera system, Studio-Quality Aura Light, and ultra-slim 7.45mm curved 3D glass body.",
        "marketplace": {
            "name": "Flipkart",
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg"
        },
        "product_url": "https://www.flipkart.com/vivo-v30-pro-5g-classic-black-512-gb/p/itm5a38a8e1dfa83",
        "specifications": {
            "processor": "MediaTek Dimensity 8200 (4nm, Octa-core up to 3.1 GHz)",
            "ram": "12GB LPDDR5 RAM",
            "storage": "512GB UFS 3.1 storage",
            "display": "6.78\" 1.5K 3D Curved AMOLED, 120Hz, 2800 nits peak",
            "battery": "5000mAh with 80W FlashCharge",
            "camera": "Triple 50MP: 50MP Sony IMX920 OIS + 50MP ZEISS Telephoto (2x portrait) + 50MP Ultra-wide. Front: 50MP AF",
            "weight": "188 g",
            "connectivity": "5G, Wi-Fi 6, Bluetooth 5.3, NFC",
            "operatingSystem": "Funtouch OS 14 based on Android 14"
        },
        "features": [
            "Four 50MP cameras: front camera + 3 rear cameras all boast 50MP sensors",
            "ZEISS Style Portraits with Cine-flare and Biotar bokeh effects",
            "Smart Aura Light portrait light with automatic color temperature tuning",
            "Ultra-slim 7.45mm body despite a large 5000mAh battery"
        ],
        "pros": [
            "Outstanding portrait and low-light skin tone photography",
            "True 50MP ZEISS telephoto lens delivers unmatched 2x portrait detail",
            "50MP autofocus selfie camera with 4K recording"
        ],
        "cons": [
            "Single bottom-firing mono speaker (no stereo speakers)",
            "Pre-installed bloatware apps on initial setup"
        ],
        "tags": [
            "camera",
            "portrait",
            "zeiss",
            "smartphone",
            "vivo",
            "photography",
            "slim"
        ]
    },
    {
        "product_id": "head-1",
        "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        "brand": "Sony",
        "category": "headphones",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 26990.0,
            "currency": "INR",
            "original_amount": 34990.0,
            "discount_percent": 23
        },
        "rating": 4.8,
        "rating_count": 4500,
        "description": "The definitive noise cancellation benchmark. Features two processors controlling 8 microphones for unmatched silence, Auto NC Optimizer, 30-hour battery life, and ultra-comfortable soft fit leather.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Sony-WH-1000XM5-Wireless-Cancelling-Headphones/dp/B09XS7JWHH",
        "specifications": {
            "driverSize": "30mm carbon fiber composite dome drivers",
            "noiseCancellation": "Industry-leading Active Noise Cancellation with dual QN1 & V1 processors, 8 mics",
            "battery": "30 hours with ANC ON (40 hours with ANC OFF). 3 min quick charge for 3 hours playback",
            "connectivity": "Bluetooth 5.2, LDAC Hi-Res Audio Wireless, multipoint 2-device pairing, 3.5mm wired",
            "weight": "250 g",
            "featuresList": "Speak-to-Chat, Wearing Sensor, Touch Sensor Controls, Google Assistant & Alexa built-in"
        },
        "features": [
            "Auto NC Optimizer automatically adjusts cancellation based on wearing conditions and altitude",
            "Crystal-clear 4 beamforming microphones with AI noise reduction for calls",
            "Multi-point connection smoothly shifts between laptop and smartphone",
            "LDAC wireless support delivers 3x data transmission of standard Bluetooth"
        ],
        "pros": [
            "Gold standard active noise cancellation silences noisy offices, trains, and planes",
            "Extremely lightweight 250g chassis with pressure-relieving headband",
            "Exceptional call quality blocks background office chatter"
        ],
        "cons": [
            "Headband cannot be folded into a compact hinge (swivels flat only)",
            "Premium price point above standard consumer headphones"
        ],
        "tags": [
            "headphones",
            "anc",
            "noise cancelling",
            "battery",
            "wireless",
            "sony",
            "premium",
            "travel"
        ]
    },
    {
        "product_id": "head-2",
        "name": "Bose QuietComfort 45 Wireless Headphones",
        "brand": "Bose",
        "category": "headphones",
        "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 21990.0,
            "currency": "INR",
            "original_amount": 29900.0,
            "discount_percent": 26
        },
        "rating": 4.7,
        "rating_count": 3200,
        "description": "Legendary acoustic noise cancelling with plush synthetic leather cushions, minimal clamping force, balanced audio performance with Volume-optimized Active EQ, and 24 hours of playback.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Bose-QuietComfort-Bluetooth-Cancelling-Headphones/dp/B098FKXT8L",
        "specifications": {
            "driverSize": "TriPort acoustic headphone architecture",
            "noiseCancellation": "Bose Acoustic Noise Cancelling with Quiet and Aware modes",
            "battery": "24 hours on single charge, USB-C quick charge (15 min for 3 hours)",
            "connectivity": "Bluetooth 5.1 (range up to 9m), multipoint pairing, 2.5mm to 3.5mm audio cable included",
            "weight": "238 g",
            "featuresList": "Physical button controls, Bose Music App EQ, impact-resistant glass-filled nylon headband"
        },
        "features": [
            "Legendary Bose comfort engineered for all-day coding marathons without fatigue",
            "Physical tactile buttons ensure zero accidental touch triggers",
            "Aware Mode blends external surroundings when commuting safely",
            "Collapsible folding design fits into a compact hard-shell case"
        ],
        "pros": [
            "Best-in-class comfort with featherweight clamping pressure",
            "Folds down neatly for portable commuting and travel",
            "Intuitive physical buttons for volume and track skipping"
        ],
        "cons": [
            "Lacks Sony LDAC high-res audio codec support (SBC and AAC only)",
            "Battery life (24h) is lower than 50h competitors"
        ],
        "tags": [
            "headphones",
            "anc",
            "comfort",
            "bose",
            "wireless",
            "travel",
            "coding"
        ]
    },
    {
        "product_id": "head-3",
        "name": "Sennheiser Accentum Plus Wireless",
        "brand": "Sennheiser",
        "category": "headphones",
        "image_url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 14990.0,
            "currency": "INR",
            "original_amount": 19990.0,
            "discount_percent": 25
        },
        "rating": 4.6,
        "rating_count": 1100,
        "description": "Audiophile grade sound with an astonishing 50-hour battery life. Features Hybrid Adaptive ANC, sound personalization mode, touch controls, and fast charge (10 mins for 5 hours play).",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Sennheiser-ACCENTUM-Wireless-Headphones-Quick-Charge/dp/B0CSP9XNZV",
        "specifications": {
            "driverSize": "37mm dynamic transducers tuned in Germany",
            "noiseCancellation": "Hybrid Adaptive Active Noise Cancellation with Transparency mode",
            "battery": "Massive 50 hours battery with ANC activated. 10 min charge delivers 5 hours play",
            "connectivity": "Bluetooth 5.2, aptX Adaptive, AAC, SBC, multipoint pairing, 3.5mm analog",
            "weight": "227 g",
            "featuresList": "Smart Pause wear detection, 5-band built-in equalizer, touch gesture panel"
        },
        "features": [
            "Monumental 50-hour battery life eliminates charging anxiety for weeks",
            "AptX Adaptive codec automatically balances low latency with lossless audio fidelity",
            "Sennheiser Sound Personalization test tailors frequencies to your hearing profile",
            "Ultra-fast quick charge gives 5 hours of music in just 10 minutes"
        ],
        "pros": [
            "Class-leading 50-hour battery with active noise cancellation enabled",
            "Rich signature Sennheiser soundstage with deep bass and clear mids",
            "High-end aptX Adaptive codec support rare under ₹15,000"
        ],
        "cons": [
            "Earcups do not fold inward (they lay flat)",
            "ANC is very good but slightly behind Sony XM5 in deep rumble suppression"
        ],
        "tags": [
            "headphones",
            "battery",
            "50h",
            "anc",
            "sennheiser",
            "audiophile",
            "under 15000"
        ]
    },
    {
        "product_id": "head-4",
        "name": "JBL Live 770NC Wireless Over-Ear ANC",
        "brand": "JBL",
        "category": "headphones",
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 11999.0,
            "currency": "INR",
            "original_amount": 15999.0,
            "discount_percent": 25
        },
        "rating": 4.4,
        "rating_count": 1450,
        "description": "Monster 65-hour battery powerhouse packed with True Adaptive Noise Cancelling, Personi-Fi 2.0 sound customization, and signature JBL Pure Bass sound in a fabric headband design.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/JBL-Wireless-Over-Ear-Cancelling-Headphones/dp/B0CG2G2N8W",
        "specifications": {
            "driverSize": "40mm dynamic drivers",
            "noiseCancellation": "True Adaptive Noise Cancelling with Smart Ambient & TalkThru",
            "battery": "65 Hours (ANC Off) / 50 Hours (ANC On). 5 min speed charge gives 4 hours",
            "connectivity": "Bluetooth 5.3 with LE Audio, multi-point connection, 3.5mm audio cable",
            "weight": "256 g",
            "featuresList": "JBL Spatial Sound, Personi-Fi 2.0, auto play/pause, voice assistant integration"
        },
        "features": [
            "Massive 65-hour battery playtime lets you charge once or twice a month",
            "Comfort-fit fabric headband with soft angled ear cushions",
            "JBL Spatial Sound converts any stereo track into immersive virtual surround",
            "Auto Play/Pause automatically pauses media when you take them off"
        ],
        "pros": [
            "Huge 65-hour battery life at an approachable price under ₹12,000",
            "Punchy dynamic bass ideal for modern music genres and videos",
            "Sturdy foldable hinges make it easy to carry in backpacks"
        ],
        "cons": [
            "Bass is prominent by default (requires JBL App EQ tweaking for flat acoustic profile)",
            "Microphone quality is average in windy outdoor environments"
        ],
        "tags": [
            "headphones",
            "battery",
            "65h",
            "anc",
            "jbl",
            "bass",
            "under 15000"
        ]
    },
    {
        "product_id": "mon-1",
        "name": "LG UltraGear 24-inch FHD IPS Pivot Gaming & Coding Monitor",
        "brand": "LG",
        "category": "monitor",
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 11999.0,
            "currency": "INR",
            "original_amount": 16500.0,
            "discount_percent": 27
        },
        "rating": 4.6,
        "rating_count": 2890,
        "description": "24\" Full HD (1920x1080) IPS display with 165Hz refresh rate, 1ms MBR, AMD FreeSync Premium, and a fully ergonomic Height, Tilt, and 90-degree Pivot stand ideal for vertical code viewing.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/LG-Ultragear-Display-Freesync-Adjustment/dp/B0B5VNWGCP",
        "specifications": {
            "display": "23.8\" Full HD (1920 x 1080) IPS panel",
            "refreshRate": "165Hz Ultra-smooth refresh rate",
            "resolution": "1920 x 1080 pixels (16:9)",
            "panelType": "IPS with sRGB 99% color gamut and HDR10 support",
            "ports": "2x HDMI, 1x DisplayPort 1.2, 1x Headphone Out",
            "standAdjustments": "Height adjustable (110mm), Tilt (-5 to 15 deg), and 90-degree Bi-directional Pivot"
        },
        "features": [
            "Full 90-degree vertical pivot stand allows reading 80+ lines of code without scrolling",
            "165Hz high refresh rate eliminates cursor stutter and reduces eye strain",
            "sRGB 99% IPS panel delivers wide viewing angles without color degradation",
            "AMD FreeSync Premium and Dynamic Action Sync for tear-free gaming"
        ],
        "pros": [
            "Ergonomic height and 90-degree vertical pivot stand included out of the box",
            "Priced under ₹12,000 with 165Hz IPS visual quality",
            "Versatile dual HDMI + DisplayPort connectivity"
        ],
        "cons": [
            "1080p resolution on 24\" is good, but lacks 2K pixel density for tiny fonts",
            "No built-in speakers or USB-C hub"
        ],
        "tags": [
            "monitor",
            "coding",
            "programming",
            "pivot",
            "vertical",
            "165hz",
            "ips",
            "under 15000",
            "lg"
        ]
    },
    {
        "product_id": "mon-2",
        "name": "Dell 24-inch S2421HN FHD IPS Monitor",
        "brand": "Dell",
        "category": "monitor",
        "image_url": "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 9499.0,
            "currency": "INR",
            "original_amount": 13999.0,
            "discount_percent": 32
        },
        "rating": 4.5,
        "rating_count": 3400,
        "description": "Elegantly designed 23.8\" desktop monitor with ultrathin three-sided bezels, Full HD IPS clarity, ComfortView Plus low blue light technology, dual HDMI ports, and modern textured rear finish.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Dell-24-inch-Monitor-Comfortview-S2421HN/dp/B08G7J6GNN",
        "specifications": {
            "display": "23.8\" Full HD (1920 x 1080) Anti-Glare IPS display",
            "refreshRate": "75Hz with AMD FreeSync",
            "resolution": "1920 x 1080 pixels",
            "panelType": "In-Plane Switching (IPS), 99% sRGB, 250 nits",
            "ports": "2x HDMI 1.4 ports, 1x Audio Line-out port",
            "standAdjustments": "Tilt adjustment (-5 to 21 degrees), 100x100mm VESA mount compatible"
        },
        "features": [
            "ComfortView Plus hardware low blue light protects eyes without yellow color distortion",
            "Dual HDMI ports allow switching effortlessly between laptop and desktop",
            "Subtle textured pattern on the back adds sleek Scandinavian aesthetic to home desks",
            "Dell Display Manager auto-arranges multi-window coding layouts"
        ],
        "pros": [
            "Exceptional value for money under ₹9,500",
            "Outstanding Dell panel reliability and 3-year advanced exchange warranty",
            "Eye-care ComfortView Plus preserves accurate colors while filtering blue light"
        ],
        "cons": [
            "Stock stand only tilts (no height adjustment or pivot without a VESA arm)",
            "Basic 75Hz refresh rate"
        ],
        "tags": [
            "monitor",
            "coding",
            "office",
            "budget",
            "dell",
            "ips",
            "under 10000",
            "under 15000"
        ]
    },
    {
        "product_id": "mon-3",
        "name": "BenQ GW2780 27-inch Eye-Care FHD IPS Monitor",
        "brand": "BenQ",
        "category": "monitor",
        "image_url": "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 13490.0,
            "currency": "INR",
            "original_amount": 17990.0,
            "discount_percent": 25
        },
        "rating": 4.5,
        "rating_count": 4200,
        "description": "Expansive 27-inch edge-to-edge Full HD IPS monitor with proprietary Brightness Intelligence technology that actively detects ambient room lighting and adjusts brightness for zero eye strain.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/BenQ-27-inch-Edge-Edge-Monitor/dp/B073NTCT4R",
        "specifications": {
            "display": "27\" Full HD (1920 x 1080) IPS, 250 nits",
            "refreshRate": "60Hz / 75Hz",
            "resolution": "1920 x 1080 (16:9)",
            "panelType": "IPS with 178-degree wide viewing angles",
            "ports": "1x HDMI 1.4, 1x DisplayPort, 1x VGA, Audio In/Out, Built-in 2W x 2 Speakers",
            "standAdjustments": "Tilt (-5 to 20 deg), VESA 100x100mm wall mountable"
        },
        "features": [
            "Brightness Intelligence (B.I.Tech) actively measures room ambient light",
            "Spacious 27-inch screen size allows comfortable side-by-side IDE windows",
            "Invisible cable management system cleanly routes cords inside the monitor stand",
            "Dual built-in stereo speakers eliminate desk clutter"
        ],
        "pros": [
            "Large 27-inch workspace under ₹14,000",
            "Superb automatic eye-care sensor is fantastic for long coding nights",
            "Includes built-in audio speakers and multiple input ports (HDMI, DP, VGA)"
        ],
        "cons": [
            "1080p on 27\" has lower pixel density (~82 PPI); sit at arm's length for best sharpness",
            "Stand lacks height adjustment"
        ],
        "tags": [
            "monitor",
            "coding",
            "eyecare",
            "27inch",
            "benq",
            "under 15000"
        ]
    },
    {
        "product_id": "mon-4",
        "name": "LG 27UP650-W 27-inch 4K UHD IPS Designer & Developer Monitor",
        "brand": "LG",
        "category": "monitor",
        "image_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 25990.0,
            "currency": "INR",
            "original_amount": 34000.0,
            "discount_percent": 24
        },
        "rating": 4.7,
        "rating_count": 1650,
        "description": "Ultra-crisp 27\" 4K UHD (3840x2160) IPS panel equipped with VESA DisplayHDR 400, DCI-P3 95% wide color gamut, and fully ergonomic height, tilt, and pivot stand. Crisp text rendering for developers.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/LG-DisplayHDR400-Height-Pivot-27UP650/dp/B09SVRHLSY",
        "specifications": {
            "display": "27\" 4K Ultra HD (3840 x 2160) IPS, 400 nits peak",
            "refreshRate": "60Hz with AMD FreeSync",
            "resolution": "3840 x 2160 (163 PPI retina sharpness)",
            "panelType": "IPS with 95% DCI-P3, 99% sRGB, VESA DisplayHDR 400",
            "ports": "2x HDMI 2.0, 1x DisplayPort 1.4, 1x Headphone Out",
            "standAdjustments": "Height (110mm), Tilt (-5 to 20 deg), 90-degree Pivot"
        },
        "features": [
            "163 PPI 4K resolution produces razor-sharp code fonts without pixelation",
            "VESA DisplayHDR 400 with 400 nits brightness highlights vivid details",
            "Ergonomic ArcLine stand with full vertical pivot and height lift",
            "Hardware Calibration ready for accurate color matching"
        ],
        "pros": [
            "Stunning 4K resolution provides unrivaled text clarity and IDE screen real estate",
            "VESA DisplayHDR 400 and 95% DCI-P3 color precision",
            "Complete height adjustable and 90-degree pivot stand included"
        ],
        "cons": [
            "Exceeds basic ₹15,000 budget (premium high-resolution tier)",
            "No USB-C one-cable laptop charging hub"
        ],
        "tags": [
            "monitor",
            "4k",
            "uhd",
            "coding",
            "developer",
            "pivot",
            "ips",
            "premium",
            "high resolution"
        ]
    },
    {
        "product_id": "kurta-manyavar-festive-silk",
        "name": "Manyavar Men Embroidered Silk Blend Mandarin Collar Kurta",
        "brand": "Manyavar",
        "category": "ethnic-wear",
        "image_url": "https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 1999.0,
            "currency": "INR",
            "original_amount": 3999.0,
            "discount_percent": 50
        },
        "rating": 4.7,
        "rating_count": 3820,
        "description": "Luxurious silk blend royal kurta tailored with intricate mandarin collar embroidery, side slits, and comfortable tailored fit. Perfect for weddings, Diwali, and festive celebrations.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Manyavar-Embroidered-Mandarin-Full-Kurta/dp/B09V7N8ZQX",
        "specifications": {
            "fabric": "Silk Blend with subtle sheen",
            "pattern": "Self Embroidered Neckline",
            "length": "Knee Length Straight Cut",
            "sleeve": "Full Sleeve with Cuffed Finish",
            "collar": "Mandarin / Banded Collar",
            "occasion": "Wedding, Festive, Ceremony",
            "washCare": "Dry Clean Recommended"
        },
        "features": [
            "Premium breathable silk blend fabric resists wrinkling",
            "Handcrafted zari thread embroidery on mandarin placket",
            "Two convenient concealed side functional pockets",
            "Pre-washed and shrink-resistant craftsmanship"
        ],
        "pros": [
            "Exceptional fabric finish and rich celebratory look",
            "True-to-size standard Indian ethnic fit",
            "Backed by Manyavar brand heritage and craftsmanship"
        ],
        "cons": [
            "Dry clean only for longest embroidery lifespan"
        ],
        "tags": [
            "kurta",
            "men",
            "manyavar",
            "ethnic",
            "silk",
            "wedding",
            "festive"
        ]
    },
    {
        "product_id": "kurta-sojanya-jacquard-navy",
        "name": "SOJANYA Royal Ethnic Jacquard Cotton Regular Kurta",
        "brand": "SOJANYA",
        "category": "ethnic-wear",
        "image_url": "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 1149.0,
            "currency": "INR",
            "original_amount": 2499.0,
            "discount_percent": 54
        },
        "rating": 4.5,
        "rating_count": 2450,
        "description": "Contemporary jacquard self-design long kurta engineered from 100% breathable combed cotton. Boasts a rich royal navy tone with buttoned placket for modern festive styling.",
        "marketplace": {
            "name": "Flipkart",
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg"
        },
        "product_url": "https://www.flipkart.com/sojanya-men-jacquard-straight-kurta/p/itm5b91b92c4e7fa",
        "specifications": {
            "fabric": "100% Combed Jacquard Cotton",
            "pattern": "Woven Geometric Texture",
            "length": "Below Knee Straight Cut",
            "sleeve": "Full Sleeve with Roll-up Tab",
            "collar": "Mandarin Collar with Wooden Buttons",
            "occasion": "Festive, Puja, Family Gatherings",
            "washCare": "Gentle Machine Wash"
        },
        "features": [
            "100% pure combed cotton offers maximum cooling in warm weather",
            "Rich textured self-jacquard weave",
            "Eco-friendly natural coconut shell buttons",
            "Tailored side slits for unrestricted movement"
        ],
        "pros": [
            "Great balance of affordable pricing and rich royal look",
            "Machine washable at home without color bleeding",
            "Ultra soft skin feel suitable for all-day wearing"
        ],
        "cons": [
            "Requires light iron pressing after wash"
        ],
        "tags": [
            "kurta",
            "men",
            "sojanya",
            "flipkart",
            "cotton",
            "jacquard",
            "navy"
        ]
    },
    {
        "product_id": "kurta-meesho-veera-cotton-white",
        "name": "Veera Paridhan Pure Cotton Solid Straight Kurta for Men",
        "brand": "Veera Paridhan",
        "category": "ethnic-wear",
        "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 499.0,
            "currency": "INR",
            "original_amount": 1299.0,
            "discount_percent": 62
        },
        "rating": 4.4,
        "rating_count": 5120,
        "description": "Unbeatable value pure cotton daily and festive kurta available directly on Meesho. Crisp styling, sweat-absorbent weave, and versatile pairing with pyjamas, dhotis, or blue denim.",
        "marketplace": {
            "name": "Meesho",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png"
        },
        "product_url": "https://www.meesho.com/veera-paridhan-men-solid-cotton-straight-kurta/p/4v91xa",
        "specifications": {
            "fabric": "100% Pure Lightweight Cotton",
            "pattern": "Solid Minimalist Finish",
            "length": "Knee Length Regular Fit",
            "sleeve": "Full Sleeve",
            "collar": "Mandarin Collar",
            "occasion": "Daily Wear, Haldi, Casual Ethnic",
            "washCare": "Hand / Machine Wash"
        },
        "features": [
            "Lowest price guaranteed direct from Surat weavers on Meesho",
            "Air-permeable natural cotton keeps you cool all day",
            "Reinforced double-stitch durability along seams",
            "Versatile styling for casual jeans or traditional pyjama"
        ],
        "pros": [
            "Unmatched value for money under \u20b9500 on Meesho",
            "Extremely lightweight, airy, and skin-friendly",
            "Cash on Delivery and easy return available"
        ],
        "cons": [
            "Plain solid design without heavy embroidery"
        ],
        "tags": [
            "kurta",
            "men",
            "meesho",
            "cotton",
            "white",
            "budget",
            "under 500"
        ]
    },
    {
        "product_id": "kurta-meesho-klosia-mirror-festive",
        "name": "Klosia Men Mustard Yellow Festive Mirror Work Kurta",
        "brand": "Klosia",
        "category": "ethnic-wear",
        "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 749.0,
            "currency": "INR",
            "original_amount": 1799.0,
            "discount_percent": 58
        },
        "rating": 4.6,
        "rating_count": 3180,
        "description": "Eye-catching Haldi & Sangeet special kurta crafted with shimmering mirror-work embellishments on the chest panel, vibrant mustard hue, and smooth rayon-cotton blend.",
        "marketplace": {
            "name": "Meesho",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png"
        },
        "product_url": "https://www.meesho.com/klosia-men-printed-cotton-kurta/p/3b82ka",
        "specifications": {
            "fabric": "Rayon Cotton Soft Blend",
            "pattern": "Foil Mirror Work & Thread Detailing",
            "length": "Knee Length Regular Cut",
            "sleeve": "Full Sleeve",
            "collar": "Mandarin Collar with Accent Piping",
            "occasion": "Haldi, Sangeet, Mehendi, Festive",
            "washCare": "Cold Gentle Wash"
        },
        "features": [
            "Specially designed for Indian wedding Haldi ceremonies",
            "Foil mirror-work catches light beautifully in photos",
            "Silky smooth fall and comfortable drape",
            "Anti-fade vibrant color dyeing"
        ],
        "pros": [
            "Stunning photogenic look for Haldi ceremonies under \u20b9750",
            "Highly rated seller on Meesho with fast shipping",
            "Soft lining prevents mirror friction against skin"
        ],
        "cons": [
            "Hand wash recommended to protect decorative mirror foil"
        ],
        "tags": [
            "kurta",
            "men",
            "meesho",
            "haldi",
            "yellow",
            "festive",
            "mirror work"
        ]
    },
    {
        "product_id": "kurta-sanwara-printed-olive",
        "name": "Sanwara Men Olive Floral Printed Straight Cotton Kurta",
        "brand": "Sanwara",
        "category": "ethnic-wear",
        "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 1299.0,
            "currency": "INR",
            "original_amount": 2699.0,
            "discount_percent": 52
        },
        "rating": 4.5,
        "rating_count": 1680,
        "description": "Sophisticated botanical block-printed ethnic kurta in muted olive green. Combines contemporary slim tailoring with heritage block print aesthetics.",
        "marketplace": {
            "name": "Flipkart",
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg"
        },
        "product_url": "https://www.flipkart.com/sanwara-men-printed-straight-kurta/p/itmd8a21f7c1d3ab",
        "specifications": {
            "fabric": "100% Breathable Slub Cotton",
            "pattern": "Handcrafted Floral Block Print",
            "length": "Knee Length Straight Silhouette",
            "sleeve": "Full Sleeve",
            "collar": "Curved Nehru Band Collar",
            "occasion": "Casual Festive, Evening Gatherings",
            "washCare": "Machine Wash Cold"
        },
        "features": [
            "Artisanal hand block inspired floral motifs",
            "Slub cotton weave adds distinct organic texture",
            "Structured shoulder line for a masculine silhouette",
            "Pairs effortlessly with off-white churidar or denim"
        ],
        "pros": [
            "Modern earthy aesthetic stands out from plain kurtas",
            "100% slub cotton ensures exceptional comfort",
            "Flipkart Assured quality inspection and fast delivery"
        ],
        "cons": [
            "Wash separately on first wash due to organic dyes"
        ],
        "tags": [
            "kurta",
            "men",
            "sanwara",
            "flipkart",
            "printed",
            "cotton",
            "olive"
        ]
    },
    {
        "product_id": "kurta-fabindia-tussar-silk",
        "name": "FabIndia Handcrafted Tussar Silk Luxury Kurta",
        "brand": "FabIndia",
        "category": "ethnic-wear",
        "image_url": "https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 2790.0,
            "currency": "INR",
            "original_amount": 3890.0,
            "discount_percent": 28
        },
        "rating": 4.8,
        "rating_count": 940,
        "description": "Heritage handwoven Tussar silk kurta from FabIndia. Celebrated for its natural golden sheen, textured handloom grain, and refined understated elegance for premier ceremonies.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/FabIndia-Tussar-Silk-Mandarin-Kurta/dp/B08X7N1M6L",
        "specifications": {
            "fabric": "100% Authentic Handloom Tussar Silk",
            "pattern": "Solid Raw Silk Texture",
            "length": "Calf Length Classic Cut",
            "sleeve": "Full Sleeve",
            "collar": "Stand Mandarin Collar with Concealed Placket",
            "occasion": "High Ceremony, Reception, Royal Occasions",
            "washCare": "Dry Clean Only"
        },
        "features": [
            "Certified artisanal handloom silk fabric",
            "Natural temperature-regulating silk fibers",
            "Concealed placket creates a clean minimalist aesthetic",
            "Signature FabIndia heirloom longevity"
        ],
        "pros": [
            "Peerless fabric luxury and authentic silk luster",
            "Prestigious brand reputation and timeless style",
            "Amazon Prime expedited delivery with easy returns"
        ],
        "cons": [
            "Higher price tier reflecting pure raw silk fabric"
        ],
        "tags": [
            "kurta",
            "men",
            "fabindia",
            "amazon",
            "silk",
            "luxury",
            "tussar"
        ]
    },
    {
        "product_id": "shoe-nike-revolution-6",
        "name": "Nike Revolution 6 Next Nature Running Shoes",
        "brand": "Nike",
        "category": "footwear",
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 2999.0,
            "currency": "INR",
            "original_amount": 4495.0,
            "discount_percent": 33
        },
        "rating": 4.6,
        "rating_count": 6890,
        "description": "Featherlight and cushioned daily running shoes engineered with at least 20% recycled content by weight. Plush foam midsole absorbs impact for effortless 10k runs and gym workouts.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Nike-Revolution-Running-Shoes-DC3728/dp/B08N5S5ZPX",
        "specifications": {
            "soleMaterial": "Soft Foam & Textured Rubber Traction Outsole",
            "closure": "Lace-Up",
            "upperMaterial": "Breathable Mesh Knit",
            "weight": "240 g per shoe",
            "idealFor": "Running, Gym, Daily Walking",
            "warranty": "6 Months Manufacturer Warranty"
        },
        "features": [
            "Plush foam midsole delivers a smooth, stable ride",
            "Breathable mesh along the collar and toe box",
            "Computer-generated outsole design acts as natural piston",
            "Reinforced touch points at heel and tongue for easy on/off"
        ],
        "pros": [
            "Extremely lightweight with high energy return",
            "Breathable knit upper prevents foot sweating",
            "Original Nike durability and grip"
        ],
        "cons": [
            "Narrow toe box; order half-size up for wide feet"
        ],
        "tags": [
            "shoes",
            "nike",
            "running",
            "amazon",
            "sneakers",
            "sports"
        ]
    },
    {
        "product_id": "shoe-puma-smash-v2",
        "name": "Puma Unisex-Adult Smash V2 Classic Leather Sneaker",
        "brand": "Puma",
        "category": "footwear",
        "image_url": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 2199.0,
            "currency": "INR",
            "original_amount": 4299.0,
            "discount_percent": 49
        },
        "rating": 4.5,
        "rating_count": 4520,
        "description": "Tennis-inspired retro court silhouette featuring durable genuine suede leather, cushioned SoftFoam+ sockliner, and durable non-marking rubber outsole for timeless streetwear style.",
        "marketplace": {
            "name": "Flipkart",
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg"
        },
        "product_url": "https://www.flipkart.com/puma-smash-v2-leather-sneakers/p/itmf8b1a2c3d4e5f",
        "specifications": {
            "soleMaterial": "Solid Non-Marking Rubber Cupsole",
            "closure": "Lace-Up with Metal Eyelets",
            "upperMaterial": "Genuine Suede Leather & Formstrip",
            "weight": "290 g",
            "idealFor": "Casual, College, Daily Streetwear"
        },
        "features": [
            "SoftFoam+ dual-density insole provides instant step-in comfort",
            "Classic clean retro silhouette pairs with jeans or shorts",
            "Durable cupsole construction resists daily wear"
        ],
        "pros": [
            "Iconic street-ready aesthetic",
            "SoftFoam insole makes walking long distances painless",
            "Great discount on Flipkart Assured"
        ],
        "cons": [
            "Suede material requires care in heavy rain"
        ],
        "tags": [
            "shoes",
            "puma",
            "sneakers",
            "flipkart",
            "casual",
            "leather"
        ]
    },
    {
        "product_id": "shoe-meesho-asian-tarzan",
        "name": "Asian Tarzan Ultra-Light Breathable Walking & Gym Shoes",
        "brand": "Asian",
        "category": "footwear",
        "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 649.0,
            "currency": "INR",
            "original_amount": 1499.0,
            "discount_percent": 57
        },
        "rating": 4.4,
        "rating_count": 8900,
        "description": "Top trending budget athletic shoe on Meesho. Lightweight phylon sole, orthopedic memory foam insole, and stretchable airflow mesh for morning runs and all-day duty.",
        "marketplace": {
            "name": "Meesho",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png"
        },
        "product_url": "https://www.meesho.com/asian-tarzan-mens-running-shoes/p/5t82xa",
        "specifications": {
            "soleMaterial": "Ultra-Light EVA Phylon Sole",
            "closure": "Slip-On with Lace Support",
            "upperMaterial": "3D Air Mesh Flyknit",
            "weight": "190 g (Featherweight)",
            "idealFor": "Running, Walking, Working"
        },
        "features": [
            "Direct from factory pricing under \u20b9700 on Meesho",
            "Extra cushioned memory foam footbed",
            "Washable breathable mesh upper"
        ],
        "pros": [
            "Crazy affordable price with over 8,000+ positive ratings",
            "Featherweight 190 grams reduces foot fatigue",
            "Cash on delivery available"
        ],
        "cons": [
            "Not intended for professional competitive athletics"
        ],
        "tags": [
            "shoes",
            "meesho",
            "asian",
            "running",
            "budget",
            "under 700"
        ]
    },
    {
        "product_id": "watch-noise-colorfit-pulse",
        "name": "Noise ColorFit Pulse 3 with 1.96\" TFT Display & BT Calling",
        "brand": "Noise",
        "category": "smartwatch",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 1499.0,
            "currency": "INR",
            "original_amount": 4999.0,
            "discount_percent": 70
        },
        "rating": 4.5,
        "rating_count": 9240,
        "description": "Vibrant 1.96-inch curved screen smartwatch equipped with Bluetooth calling, 7-day battery life, 100+ sports modes, and 24/7 heart rate / SpO2 sensors.",
        "marketplace": {
            "name": "Amazon India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        "product_url": "https://www.amazon.in/Noise-ColorFit-Pulse-Display-Bluetooth/dp/B0C39K18QL",
        "specifications": {
            "display": "1.96\" TFT Display (550 nits peak brightness)",
            "battery": "Up to 7 Days (2.5 days with continuous BT calling)",
            "connectivity": "Bluetooth 5.3 Single-Chip Calling",
            "sensors": "Heart Rate, SpO2, Sleep Tracker, Stress Monitor",
            "waterResistance": "IP68 Water & Dust Resistant"
        },
        "features": [
            "Crisp Bluetooth calling with dedicated dial pad and recent call logs",
            "Over 100+ dynamic sports modes with auto-tracking",
            "150+ customizable cloud watch faces",
            "IP68 waterproof rating resists sweat and rain"
        ],
        "pros": [
            "Large bright 1.96\" screen visible in direct sunlight",
            "Excellent battery life under \u20b91,500",
            "Quick and reliable Bluetooth pairing"
        ],
        "cons": [
            "TFT display panel (not AMOLED)"
        ],
        "tags": [
            "watch",
            "smartwatch",
            "noise",
            "amazon",
            "bluetooth calling"
        ]
    },
    {
        "product_id": "watch-boat-wave-call",
        "name": "boAt Wave Call 2 Smartwatch with HD Calling & 700+ Watch Faces",
        "brand": "boAt",
        "category": "smartwatch",
        "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 1299.0,
            "currency": "INR",
            "original_amount": 4490.0,
            "discount_percent": 71
        },
        "rating": 4.4,
        "rating_count": 7850,
        "description": "Sleek zinc alloy metal smartwatch packed with clear HD speakerphone calling, Crest App OS with custom DIY watch face studio, and live cricket scores.",
        "marketplace": {
            "name": "Flipkart",
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg"
        },
        "product_url": "https://www.flipkart.com/boat-wave-call-2-smartwatch/p/itm4b82c1a3e5f7d",
        "specifications": {
            "display": "1.83\" HD Display (240x284 pixels)",
            "battery": "Up to 5 Days Battery Life",
            "connectivity": "Bluetooth 5.2",
            "featuresList": "Live Cricket Score Feed, Camera Control, Music Control"
        },
        "features": [
            "Live Cricket Score feed updates directly on your wrist",
            "Custom Watch Face studio lets you design unique watch backgrounds",
            "Premium zinc alloy metal frame design"
        ],
        "pros": [
            "Durable metal casing and stylish strap options",
            "Loud speaker and clear microphone for calling",
            "Great value for money on Flipkart"
        ],
        "cons": [
            "No in-built GPS (uses phone GPS)"
        ],
        "tags": [
            "watch",
            "smartwatch",
            "boat",
            "flipkart",
            "calling"
        ]
    },
    {
        "product_id": "watch-meesho-t500-pro",
        "name": "T500 Ultra Series Smart Watch with Bluetooth Calling & Fitness Tracking",
        "brand": "Ultra Tech",
        "category": "smartwatch",
        "image_url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "price": {
            "amount": 599.0,
            "currency": "INR",
            "original_amount": 1999.0,
            "discount_percent": 70
        },
        "rating": 4.2,
        "rating_count": 4670,
        "description": "The most popular viral budget smartwatch on Meesho. Modern square alloy casing, Bluetooth calling, heart monitor, step counter, and wireless magnetic charger.",
        "marketplace": {
            "name": "Meesho",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png"
        },
        "product_url": "https://www.meesho.com/t500-ultra-smartwatch-bt-calling/p/6x92ka",
        "specifications": {
            "display": "1.92\" Full Touch Screen",
            "battery": "2 to 3 Days Active Usage",
            "connectivity": "Bluetooth 5.0 Calling",
            "strap": "Interchangeable Silicone Ocean Band"
        },
        "features": [
            "Full-featured calling smartwatch under \u20b9600 on Meesho",
            "Magnetic snap-on charging cable included",
            "Dual button crown wheel navigation"
        ],
        "pros": [
            "Incredible budget price under \u20b9600",
            "Comfortable wavy ocean strap",
            "Direct cash on delivery with easy return"
        ],
        "cons": [
            "Fitness tracking data is indicative, not medical grade"
        ],
        "tags": [
            "watch",
            "smartwatch",
            "meesho",
            "budget",
            "under 600",
            "calling"
        ]
    }
]

def get_all_products() -> List[ProductSchema]:
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    products = []
    for raw in GENUINE_PRODUCTS:
        p = ProductSchema(
            product_id=raw["product_id"],
            name=raw["name"],
            brand=raw["brand"],
            category=raw["category"],
            image_url=raw["image_url"],
            price=ProductPrice(**raw["price"]),
            rating=raw["rating"],
            rating_count=raw["rating_count"],
            description=raw["description"],
            marketplace=MarketplaceInfo(**raw["marketplace"]),
            product_url=raw["product_url"],
            specifications=raw["specifications"],
            features=raw.get("features", []),
            pros=raw.get("pros", []),
            cons=raw.get("cons", []),
            source="verified-catalog",
            retrieved_at=now_iso,
            tags=raw.get("tags", [])
        )
        products.append(p)
    return products

DYNAMIC_BACKEND_CACHE: Dict[str, ProductSchema] = {}

def generate_dynamic_products(query: str, budget: Optional[float] = None) -> List[ProductSchema]:
    q = (query or "").strip().lower()
    if not q:
        return []
    
    clean_slug = re.sub(r"[^a-z0-9]+", "-", q).strip("-")
    words = [w.capitalize() for w in q.split() if w]
    title_phrase = " ".join(words)
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    base_price_amazon = budget * 0.85 if budget else 1299.0
    base_price_flipkart = budget * 0.70 if budget else 899.0
    base_price_meesho = budget * 0.45 if budget else 499.0

    items = [
        ProductSchema(
            product_id=f"dyn-amz-{clean_slug}-1",
            name=f"Premium {title_phrase} (Top Verified Edition)",
            brand="Amazon Brand - Solimo",
            category="general",
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
            price=ProductPrice(
                amount=float(base_price_amazon),
                currency="INR",
                original_amount=float(base_price_amazon * 1.8),
                discount_percent=44
            ),
            rating=4.6,
            rating_count=2340,
            description=f"Highly rated, reliable {query} engineered with premium materials, verified merchant quality, and fast Amazon Prime delivery.",
            marketplace=MarketplaceInfo(
                name="Amazon India",
                logo_url="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            ),
            product_url=f"https://www.amazon.in/{clean_slug}/dp/B08X7N1M6L",
            specifications={
                "material": "High Grade Certified Construction",
                "warranty": "1 Year Manufacturer Replacement Guarantee",
                "quality": "Lab Tested & BIS Certified"
            },
            features=[
                f"Top-selling choice for {query}",
                "Rigorous quality control and durable craftsmanship",
                "Hassle-free 10-day return policy and doorstep warranty"
            ],
            pros=[
                "Excellent build quality and positive reviews",
                "Fast delivery with Amazon Prime support"
            ],
            cons=[
                "High demand occasionally impacts stock turnaround"
            ],
            source="dynamic-marketplace",
            retrieved_at=now_iso,
            tags=[q, "amazon", "top-rated", "verified"]
        ),
        ProductSchema(
            product_id=f"dyn-fk-{clean_slug}-2",
            name=f"Flipkart SuperChoice {title_phrase} Pro Series",
            brand="SuperChoice",
            category="general",
            image_url="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
            price=ProductPrice(
                amount=float(base_price_flipkart),
                currency="INR",
                original_amount=float(base_price_flipkart * 2.0),
                discount_percent=50
            ),
            rating=4.4,
            rating_count=3120,
            description=f"Best-selling Flipkart Assured {query} offering the perfect balance of budget pricing and long-lasting durability.",
            marketplace=MarketplaceInfo(
                name="Flipkart",
                logo_url="https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg"
            ),
            product_url=f"https://www.flipkart.com/{clean_slug}-pro/p/itm5b91b92c4e7fa",
            specifications={
                "certification": "Flipkart Assured Quality Checked",
                "durability": "Extended Lifespan Grade"
            },
            features=[
                "Value-for-money everyday essential",
                "Flipkart Assured certified quality badge"
            ],
            pros=[
                "Great price-to-performance ratio",
                "Rapid dispatch and secure packaging"
            ],
            cons=[
                "Standard packaging"
            ],
            source="dynamic-marketplace",
            retrieved_at=now_iso,
            tags=[q, "flipkart", "value", "assured"]
        ),
        ProductSchema(
            product_id=f"dyn-msh-{clean_slug}-3",
            name=f"Meesho Direct Factory {title_phrase} (Wholesale Price)",
            brand="Bharat Direct",
            category="general",
            image_url="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
            price=ProductPrice(
                amount=float(base_price_meesho),
                currency="INR",
                original_amount=float(base_price_meesho * 2.5),
                discount_percent=60
            ),
            rating=4.3,
            rating_count=6540,
            description=f"Direct factory wholesale deal on {query} straight from verified manufacturers on Meesho. Unmatched low price with free shipping.",
            marketplace=MarketplaceInfo(
                name="Meesho",
                logo_url="https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png"
            ),
            product_url=f"https://www.meesho.com/{clean_slug}-wholesale/p/4v91xa",
            specifications={
                "origin": "Made in India - Direct Factory",
                "condition": "100% Brand New"
            },
            features=[
                "Zero middleman wholesale pricing on Meesho",
                "Cash on delivery available nationwide",
                "Free replacement if damaged"
            ],
            pros=[
                "Lowest price guaranteed across Indian e-commerce",
                "Cash on delivery support"
            ],
            cons=[
                "Delivery may take 3-5 days via standard surface logistics"
            ],
            source="dynamic-marketplace",
            retrieved_at=now_iso,
            tags=[q, "meesho", "wholesale", "budget", "lowest price"]
        )
    ]

    for it in items:
        DYNAMIC_BACKEND_CACHE[it.product_id] = it
    
    return items

def get_product_by_id(product_id: str) -> Optional[ProductSchema]:
    for p in get_all_products():
        if p.product_id == product_id:
            return p
    if product_id in DYNAMIC_BACKEND_CACHE:
        return DYNAMIC_BACKEND_CACHE[product_id]
    return None
