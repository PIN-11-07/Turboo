#!/usr/bin/env python3
import random
import json
import os
import sys
try:
    import requests
except Exception:
    requests = None


# Utilisation de la locale anglaise pour d'autres données si nécessaire


USER_ID = "0bd565a0-ca8b-437b-bd8b-1b10978eab22"  # REMPLACE CECI par ton vrai User ID

# --- 1. CONFIGURATION DES DONNÉES (EN ANGLAIS) ---

# Options correspondant à tes filtres React (traduits)
CONDITIONS = ["Used", "New", "Certified Pre-Owned", "Collector"]

# Définition des modèles avec caractéristiques en ANGLAIS, images et couleurs spécifiques
# Chaque modèle a 2 variantes de couleur pour la diversité
CAR_DATA = {
    "Ferrari": {
        "488 Pista": [
            {
                "color": "Red",
                "original_color": "Rosso Corsa",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 385000, "mileage": 1200, "condition": "Certified Pre-Owned",
                "images": ["https://www.alainclass.com/wp-content/uploads/2019/07/1170-BH4A9636-10-Copy.jpg"],
                "description": "Experience the adrenaline of the track with this Ferrari 488 Pista. Finished in the iconic Rosso Corsa, this track-focused weapon features active aerodynamics and a screaming V8 engine.",
            },
            {
                "color": "Black",
                "original_color": "Nero Daytona",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2022, "price": 365000, "mileage": 3500, "condition": "Used",
                "images": ["https://www.bavariamotors.be/img/cars/dsc01172-3.jpg?q=90&s=ed0847b36e0eb95bcd48deaaefa9bd46"],
                "description": "Stealth and power combine in this Ferrari 488 Pista. The Nero Daytona exterior gives it a menacing presence, perfectly matching its devastating performance capabilities.",
            }
        ],
        "F8 Spider": [
            {
                "color": "Blue",
                "original_color": "Blu Tour de France",
                "body": "Convertible", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 425000, "mileage": 450, "condition": "New",
                "images": ["https://media.carsandbids.com/cdn-cgi/image/width=2080,quality=70/7a0a3c6148108c9c64425dd85e0181fa3cccb652/photos/exterior/rMkmeOYp-C1_C7KY/edit/elypB.jpg?t=175039100088"],
                "description": "Open-top exhilaration awaits in this F8 Spider. The Blu Tour de France paintwork pays homage to the legendary race, shimmering beautifully under the sun.",
            },
            {
                "color": "Gray",
                "original_color": "Argento Nurburgring",
                "body": "Convertible", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 395000, "mileage": 2100, "condition": "Certified Pre-Owned",
                "images": ["https://www.classicdriver.com/sites/default/files/users/95265/cars_images/95265-902014-car-20220420_142210-1.jpg"],
                "description": "Sophistication meets speed. This F8 Spider in Argento Nurburgring offers a sleek, metallic finish that accentuates the car's aerodynamic lines.",
            }
        ],
        "SF90 Stradale": [
            {
                "color": "Yellow",
                "original_color": "Giallo Modena",
                "body": "Supercar", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2024, "price": 625000, "mileage": 320, "condition": "New",
                "images": ["https://tunedimports.nl/wp-content/uploads/SF90-1-4-768x513.jpg"],
                "description": "The future of the Prancing Horse is here with the SF90 Stradale. In Giallo Modena, this hybrid supercar commands attention with its vibrant hue and futuristic design.",
            },
            {
                "color": "White",
                "original_color": "Bianco Avus",
                "body": "Supercar", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2023, "price": 585000, "mileage": 1800, "condition": "Certified Pre-Owned",
                "images": ["https://www.exclusiveautomotivegroup.com/2022-ferrari-sf90-stradale-c-4177/"],
                "description": "Pure and electric. This SF90 Stradale spec'd in Bianco Avus highlights the car's clean lines and high-tech nature, offering blistering performance with style.",
            }
        ]
    },
    "Porsche": {
        "911 GT3": [
            {
                "color": "Yellow",
                "original_color": "Racing Yellow",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Manual",
                "year": 2024, "price": 185000, "mileage": 650, "condition": "New",
                "images": ["https://i.ytimg.com/vi/38tGAhWeOTg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA1ViACQXZme5zp8FVrIehhHuZCqg"],
                "description": "Built for the track, ready for the road. This 911 GT3 in Racing Yellow screams performance, featuring a high-revving naturally aspirated engine.",
            },
            {
                "color": "Silver",
                "original_color": "GT Silver Metallic",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 165000, "mileage": 4200, "condition": "Used",
                "images": ["https://i.ytimg.com/vi/4SvqV9brfOU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBh5bxO1Scn8I1WYBmAq0U-AoqHtw"],
                "description": "A timeless classic. The 911 GT3 in GT Silver Metallic embodies the heritage of Porsche motorsport, offering a sharp and precise driving tool.",
            }
        ],
        "Taycan Turbo S": [
            {
                "color": "Blue",
                "original_color": "Frozen Blue Metallic",
                "body": "Sedan", "doors": 4, "fuel": "Electric", "trans": "Automatic",
                "year": 2024, "price": 195000, "mileage": 280, "condition": "New",
                "images": ["https://www.southeastautoshowroom.com/imagetag/1360/20/l/Used-2021-Porsche-Taycan-(SOLD)-1655125380.jpg"],
                "description": "Electrifying performance. This Taycan Turbo S in Frozen Blue Metallic is a futuristic masterpiece, combining instant torque with a stunning, icy blue finish.",
            },
            {
                "color": "White",
                "original_color": "Carrara White Metallic",
                "body": "Sedan", "doors": 4, "fuel": "Electric", "trans": "Automatic",
                "year": 2023, "price": 175000, "mileage": 5600, "condition": "Used",
                "images": ["https://i.ytimg.com/vi/7oFWtIoMkaA/maxresdefault.jpg"],
                "description": "Clean, efficient, and devastatingly fast. The Taycan Turbo S in Carrara White Metallic offers a luxurious and high-tech driving experience.",
            }
        ],
        "Cayenne Coupe": [
            {
                "color": "Gray",
                "original_color": "Volcano Grey Metallic",
                "body": "SUV", "doors": 5, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2024, "price": 145000, "mileage": 890, "condition": "Certified Pre-Owned",
                "images": ["https://mrsportscars.com/wp-content/uploads/2023/12/Porsche-Macan-S-PDK-2020MY-Volcano-Grey-Metallic-Panoramic-Sunroof-Black-Leather-PASM-21-RS-Spyder-Alloy-Wheels-For-Sale-UK-Specialist-1-940x600.jpg"],
                "description": "Versatility meets sportiness. This Cayenne Coupe in Volcano Grey Metallic provides ample space without compromising on the dynamic Porsche DNA.",
            },
            {
                "color": "Black",
                "original_color": "Mahogany Metallic",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 125000, "mileage": 8200, "condition": "Used",
                "images": ["https://wheelz.me/wp-content/uploads/2019/03/Porsche-Cayenne_Turbo_Coupe-2020jpg-1.jpg"],
                "description": "Luxurious profundity. This Cayenne Coupe, finished in deep Mahogany Metallic, offers a rich and elegant look for the discerning SUV driver.",
            }
        ]
    },
    "Lamborghini": {
        "Urus Performante": [
            {
                "color": "Orange",
                "original_color": "Arancio Borealis",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 285000, "mileage": 520, "condition": "New",
                "images": ["https://revistacar.es/wp-content/uploads/2025/01/198776.png"],
                "description": "Bold and aggressive. The Urus Performante in Arancio Borealis demands attention, combining glowing orange paint with the soul of a supercar.",
            },
            {
                "color": "Black",
                "original_color": "Nero Noctis",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 255000, "mileage": 3800, "condition": "Used",
                "images": ["https://bluesky.cdn.imgeng.in/cogstock-images/6b3abc75-53a4-42b4-84c8-9ea4e096ea30.jpg?imgeng=/w_1200/"],
                "description": "The dark knight of SUVs. This Nero Noctis Urus Performante is sinister, stealthy, and undeniably powerful.",
            }
        ],
        "Huracan Evo": [
            {
                "color": "Green",
                "original_color": "Verde Mantis",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 325000, "mileage": 750, "condition": "Certified Pre-Owned",
                "images": ["https://i.ytimg.com/vi/TUy3l6tRtBc/maxresdefault.jpg"],
                "description": "A venomous striker. The Huracan Evo in Verde Mantis is unmistakable, a bright green warning of the V10 power lurking within.",
            },
            {
                "color": "White",
                "original_color": "Bianco Icarus",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2022, "price": 285000, "mileage": 6500, "condition": "Used",
                "images": ["https://i.ytimg.com/vi/UPr6YKpWbCU/maxresdefault.jpg"],
                "description": "Pure speed. The Bianco Icarus finish on this Huracan Evo gives it a celestial, high-performance look that shines on any road.",
            }
        ],
        "Aventador SVJ": [
            {
                "color": "Red",
                "original_color": "Rosso Mars",
                "body": "Supercar", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 625000, "mileage": 1100, "condition": "Certified Pre-Owned",
                "images": ["https://i.redd.it/lamborghini-aventador-svj-rosso-mars-w-black-decals-v0-fnrmk6jhz7mb1.jpg?width=1920&format=pjpg&auto=webp&s=b5c4692e711f975408461a33585d56354c076234"],
                "description": "The ultimate bull. This Aventador SVJ in Rosso Mars is a fiery expression of peak automotive engineering and Italian passion.",
            },
            {
                "color": "Gray",
                "original_color": "Grigio Telesto",
                "body": "Supercar", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2022, "price": 585000, "mileage": 4200, "condition": "Used",
                "images": ["https://www.chicagomotorcars.com/imagetag/10379/main/l/Used-2019-Lamborghini-Aventador-LP770-4-SVJ-Coupe-Grigio-Telesto-Pearl!-LOADED-with-Carbon-Fiber!-FULL-PPF!-1674774161.jpg"],
                "description": "Battle-ready. finished in Grigio Telesto, this Aventador SVJ looks like a fighter jet for the road, aggressive and ready to launch.",
            }
        ]
    },
    "McLaren": {
        "720S": [
            {
                "color": "Orange",
                "original_color": "Volcano Orange",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 315000, "mileage": 680, "condition": "New",
                "images": ["https://www.duntbarn.com/blobs/Images/Cars/117/bdcb5ec8-b153-42e5-941c-595bbe77d9c1.jpg?width=2000&height=1333"],
                "description": "Eruptive performance. The 720S in Volcano Orange features a deep, pearlescent finish that perfectly complements its organic, aerodynamic shape.",
            },
            {
                "color": "White",
                "original_color": "Silica White",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 285000, "mileage": 3200, "condition": "Used",
                "images": ["https://www.alastairbols.com/cars/mclaren-720s-performance-in-silica-white"],
                "description": "Clinical precision. This Silica White 720S emphasizes the technical perfection and lightweight engineering that McLaren is famous for.",
            }
        ],
        "P1": [
            {
                "color": "Orange",
                "original_color": "McLaren Orange",
                "body": "Supercar", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2021, "price": 1850000, "mileage": 1200, "condition": "Collector",
                "images": ["https://cdn.motor1.com/images/mgl/rGByX/s1/kvc-mclaren-p1-lm-lm04.webp"],
                "description": "A modern legend. The P1 in heritage McLaren Orange connects the brand's racing history with its hybrid future in spectacular fashion.",
            },
            {
                "color": "Black",
                "original_color": "Carbon Black",
                "body": "Supercar", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2020, "price": 1750000, "mileage": 2500, "condition": "Collector",
                "images": ["https://www.gtspiritmedia.com/gtspirit/uploads/2015/10/McLaren-P1-for-sale2-1068x713.jpg"],
                "description": "Raw materiality. This P1 in Carbon Black exposes the sinister, lightweight nature of the hypercar, looking fast even when standing still.",
            }
        ]
    },
    "Tesla": {
        "Model S Plaid": [
            {
                "color": "White",
                "original_color": "Pearl White Multi-Coat",
                "body": "Sedan", "doors": 5, "fuel": "Electric", "trans": "Automatic",
                "year": 2024, "price": 125000, "mileage": 450, "condition": "New",
                "images": ["https://uploads.onlyusedtesla.com/wp-content/uploads/2022/11/15220655/B40312B181D1233D90AEF6D2AF714A-1536x1152.jpg"],
                "description": "The wolf in sheep's clothing. This Model S Plaid in Pearl White Multi-Coat offers everyday usability with record-breaking acceleration.",
            },
            {
                "color": "Blue",
                "original_color": "Deep Blue Metallic",
                "body": "Sedan", "doors": 5, "fuel": "Electric", "trans": "Automatic",
                "year": 2023, "price": 105000, "mileage": 8500, "condition": "Used",
                "images": ["https://detailership.com/portfolio/2021/8/29/2022-tesla-model-s-plaid-blue-metallic"],
                "description": "Electric elegance. The Deep Blue Metallic finish on this Model S Plaid adds a touch of sophistication to the world's fastest production sedan.",
            }
        ],
        "Model X": [
            {
                "color": "Gray",
                "original_color": "Midnight Silver Metallic",
                "body": "SUV", "doors": 5, "fuel": "Electric", "trans": "Automatic",
                "year": 2024, "price": 115000, "mileage": 320, "condition": "New",
                "images": ["https://cdn.shopify.com/s/files/1/1724/5219/t/46/assets/enap-photo-61780bdcb1f5a.jpg?v=1635257310&width=1024"],
                "description": "Future family transport. This Model X in Midnight Silver Metallic features falcon-wing doors and advanced tech in a sleek, understated package.",
            },
            {
                "color": "Black",
                "original_color": "Solid Black",
                "body": "SUV", "doors": 5, "fuel": "Electric", "trans": "Automatic",
                "year": 2023, "price": 95000, "mileage": 12000, "condition": "Used",
                "images": ["https://cdn.shopify.com/s/files/1/1724/5219/t/46/assets/enap-photo-61780c3028514.jpg?v=1635257393&width=500"],
                "description": "Shadow on wheels. The Solid Black Model X provides a commanding presence and seamless electric luxury for the whole family.",
            }
        ]
    },
    "Mercedes-Benz": {
        "AMG GT Black Series": [
            {
                "color": "Black",
                "original_color": "AMG Magno Night Black",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 425000, "mileage": 580, "condition": "New",
                "images": ["https://cf-motors.de/wp-content/uploads/cars_pictures_1/2327126_1-1024x768.jpg"],
                "description": "The darkness before the storm. This AMG GT Black Series in Magno Night Black is a matte-finished monster, optimized for pure track dominance.",
            },
            {
                "color": "Green",
                "original_color": "AMG Green Hell Magno",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 385000, "mileage": 2800, "condition": "Certified Pre-Owned",
                "images": ["https://luxurypulse.com/img/pictures/62f6bdb69a8981ea92.jpeg"],
                "description": "Born in the Green Hell. This AMG GT Black Series sports the iconic Green Hell Magno paint, celebrating its Nürburgring heritage.",
            }
        ],
        "G 63 AMG": [
            {
                "color": "Black",
                "original_color": "Obsidian Black Metallic",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 185000, "mileage": 920, "condition": "Certified Pre-Owned",
                "images": ["https://i.ytimg.com/vi/2dYWrZzRvwk/maxresdefault.jpg"],
                "description": "Timeless brute. The G 63 AMG in Obsidian Black Metallic is the definition of luxury off-road capability, with a presence that cannot be ignored.",
            },
            {
                "color": "White",
                "original_color": "Polar White",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 165000, "mileage": 6200, "condition": "Used",
                "images": ["https://bluesky.cdn.imgeng.in/cogstock-images/97edaa3d-7561-4646-817e-715aacde9a6b.jpg?imgeng=/w_1200/"],
                "description": "Alpine luxury. This G 63 AMG in Polar White stands out with a crisp, clean look that contrasts beautifully with its rugged, boxy design.",
            }
        ]
    },
    "BMW": {
        "M4 Competition": [
            {
                "color": "Yellow",
                "original_color": "Sao Paulo Yellow",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 95000, "mileage": 1200, "condition": "New",
                "images": ["https://i.ytimg.com/vi/9H4d3CxLOHM/maxresdefault.jpg"],
                "description": "Vibrant agility. The M4 Competition in Sao Paulo Yellow is as fast as it looks, featuring a polarizing design and track-ready performance.",
            },
            {
                "color": "Gray",
                "original_color": "Brooklyn Grey Metallic",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 82000, "mileage": 8500, "condition": "Used",
                "images": ["https://i.ytimg.com/vi/mxK2jTjLJ_o/maxresdefault.jpg"],
                "description": "Urban warrior. This M4 Competition in Brooklyn Grey Metallic offers a modern, industrial look that perfectly suits the car's sharp lines.",
            }
        ],
        "i8": [
            {
                "color": "White",
                "original_color": "Crystal White Pearl",
                "body": "Coupe", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2022, "price": 125000, "mileage": 5200, "condition": "Used",
                "images": ["https://64.media.tumblr.com/0d98c32443f1304673f122c12dd6af75/tumblr_pb3jnpGzmK1tvkv5wo1_1280.jpg"],
                "description": "Vision of the future. The i8 in Crystal White Pearl is a sci-fi dream brought to life, with its butterfly doors and advanced hybrid powertrain.",
            },
            {
                "color": "Gray",
                "original_color": "Sophisto Grey Brilliant",
                "body": "Coupe", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2021, "price": 115000, "mileage": 9800, "condition": "Used",
                "images": ["https://i.ytimg.com/vi/ohdjNHkyAJs/maxresdefault.jpg"],
                "description": "Stealth hybrid. This i8 in Sophisto Grey Brilliant effect hides its eco-friendly nature under a dark, sophisticated exterior.",
            }
        ]
    },
    "Aston Martin": {
        "DB11": [
            {
                "color": "Silver",
                "original_color": "Quantum Silver",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 245000, "mileage": 780, "condition": "New",
                "images": ["https://i.ytimg.com/vi/_uAyQI7DkKE/sddefault.jpg"],
                "description": "Bond's choice. The DB11 in Quantum Silver radiates British elegance and undercover power, a true gentleman's express.",
            },
            {
                "color": "Blue",
                "original_color": "Midnight Blue",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 215000, "mileage": 4500, "condition": "Used",
                "images": ["https://cdn.dicklovett.co.uk/uploads/used_stock_image/1_2470721_e.jpg?v=1756714058"],
                "description": "Deep oceanic luxury. This Midnight Blue DB11 combines a grand touring comfort with a rich, classic color that never goes out of style.",
            }
        ],
        "Vantage": [
            {
                "color": "Green",
                "original_color": "Lime Essence",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 185000, "mileage": 520, "condition": "New",
                "images": ["https://www.astonmartin.com/-/media/common/news/6488.png?mw=1920&rev=1c9c5d3cc6534716a86505c71e01abbf&hash=DF5963C8C73B07B31DCE6BA23E0DDBF3"],
                "description": "Shock to the system. The Vantage in Lime Essence is a provocative statement, highlighting the car's predatory stance and agility.",
            },
            {
                "color": "Black",
                "original_color": "Jet Black",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 165000, "mileage": 6800, "condition": "Used",
                "images": ["https://www.astonmartinwashingtondc.com/imagetag/3337/main/f/-1661968810.jpg"],
                "description": "Night hunter. This Vantage in Jet Black is sleek, stealthy, and ready to pounce, embodying the darker side of Aston Martin.",
            }
        ]
    },
    "Bentley": {
        "Continental GT": [
            {
                "color": "Black",
                "original_color": "Beluga Black",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 265000, "mileage": 650, "condition": "New",
                "images": ["https://www.primemotorz.com/imagetag/1477/main/l/Used-2020-Bentley-Continental-GT-W12-2DR-COUPE-AWD-GT-1689107331.jpg"],
                "description": "The pinnacle of grand touring. This Beluga Black Continental GT offers unmatched presence and a finish as deep as the ocean.",
            },
            {
                "color": "White",
                "original_color": "Glacier White",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 235000, "mileage": 3200, "condition": "Certified Pre-Owned",
                "images": ["https://www.bentleypalmyra.com/imagetag/12019/2/l/New-2020-Bentley-Continental-GT-V8-Coupe.jpg"],
                "description": "Cool and collected. The Glacier White paint on this Continental GT emphasizes its muscular lines and imposing stature.",
            }
        ],
        "Bentayga": [
            {
                "color": "Green",
                "original_color": "Verdant Green",
                "body": "SUV", "doors": 5, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2024, "price": 245000, "mileage": 890, "condition": "Certified Pre-Owned",
                "images": ["https://i.ytimg.com/vi/i1IXhoDH2QY/hqdefault.jpg"],
                "description": "British racing heritage meets SUV luxury. This Bentayga in Verdant Green is a regal choice for those who demand the best.",
            },
            {
                "color": "Black",
                "original_color": "Onyx Black",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 215000, "mileage": 5600, "condition": "Used",
                "images": ["https://smgmedia.blob.core.windows.net/images/113814/1024/bentley-bentayga-suv-62351a87d7c7.jpg"],
                "description": "Commanding elegance. The Onyx Black finish on this Bentayga ensures you arrive in style, no matter the destination.",
            }
        ]
    }
}

LOCATIONS = ["Los Angeles", "Miami", "London", "Dubai", "New York", "Monaco", "Berlin", "Tunis"]


def sql_escape(value):
    """Escape single quotes for SQL string literal safety. Accepts None."""
    if value is None:
        return ''
    return str(value).replace("'", "''")


def format_price(value):
    # Ensure two decimal places for SQL and API
    try:
        return float(f"{float(value):.2f}")
    except Exception:
        return float(value)

def generate_rows(num_rows=40):
    """Generate a list of dict rows matching the `listings` table fields."""
    rows = []
    
    # Flatten the variants to pick from them possibly repeating if num_rows > total variants
    # or just iterate through all of them if we want one of each.
    # The user script originally generated 'num_rows' by looping randomly.
    # We will assume we want to generate at least one of each, or fill up to num_rows.
    
    all_variants = []
    for make, models in CAR_DATA.items():
        for model_name, variants in models.items():
            for variant in variants:
                # Add make and model to variant for easier processing
                v_copy = variant.copy()
                v_copy['make'] = make
                v_copy['model'] = model_name
                all_variants.append(v_copy)

    # If we want specifically the defined cars, we can just use them.
    # If num_rows is specified and is different, we can sample.
    # For now, let's just generate all defined variants once, or loop if we need more.
    
    # If the user passed num_rows, we might want to respect it, but with fixed data
    # it might be better to just output all the unique cars defined.
    # However, to keep compatibility with the script's structure:
    
    count = 0
    while count < num_rows:
        for variant in all_variants:
            if count >= num_rows:
                break
            
            location = random.choice(LOCATIONS)
            title = f"{variant['make']} {variant['model']} {variant['year']}"
            
            # Use the specific description provided in the variant
            desc = f"{variant['description']} Located in {location}."

            row = {
                "user_id": USER_ID,
                "title": title,
                "description": desc,
                "price": format_price(variant['price']),
                "make": variant['make'],
                "model": variant['model'],
                "year": variant['year'],
                "mileage": variant['mileage'],
                "fuel_type": variant['fuel'],
                "transmission": variant['trans'],
                "doors": variant['doors'],
                "color": variant['color'],
                "body_type": variant['body'],
                "condition": variant['condition'],
                "images": variant['images'],
                "location": location,
                "is_active": True,
            }
            rows.append(row)
            count += 1

    return rows


def write_sql(rows, out_file=None):
    header = "INSERT INTO public.listings (user_id, title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, body_type, condition, images, location, is_active) VALUES"
    values_list = []
    for r in rows:
        # escape and dump images as JSON string
        images_sql = sql_escape(json.dumps(r["images"], ensure_ascii=False))
        title_sql = sql_escape(r["title"])
        desc_sql = sql_escape(r["description"])
        make_sql = sql_escape(r["make"])
        model_sql = sql_escape(r["model"])
        color_sql = sql_escape(r["color"])
        body_sql = sql_escape(r["body_type"])
        condition_sql = sql_escape(r["condition"])
        location_sql = sql_escape(r["location"])
        fuel_sql = sql_escape(r["fuel_type"])
        trans_sql = sql_escape(r["transmission"])

        row = (
            f"('{r['user_id']}', '{title_sql}', '{desc_sql}', {r['price']}, '{make_sql}', '{model_sql}', {r['year']}, {r['mileage']}, "
            f"'{fuel_sql}', '{trans_sql}', {r['doors']}, '{color_sql}', '{body_sql}', '{condition_sql}', "
            f"'{images_sql}'::jsonb, '{location_sql}', true)"
        )
        values_list.append(row)

    sql = header + "\n" + ",\n".join(values_list) + ";\n"
    if out_file:
        # Ensure parent directory exists
        parent = os.path.dirname(out_file)
        if parent:
            os.makedirs(parent, exist_ok=True)
        with open(out_file, "w", encoding="utf-8") as f:
            f.write(sql)
        print(f"Wrote {len(rows)} rows to {out_file}")
    else:
        print(sql)


def write_jsonl(rows, out_file):
    # Ensure parent directory exists
    parent = os.path.dirname(out_file)
    if parent:
        os.makedirs(parent, exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Wrote {len(rows)} JSON lines to {out_file}")


def insert_via_api(rows, supabase_url=None, supabase_key=None, prefer_return=False):
    if requests is None:
        print("The 'requests' library is required for API insertion. Install with: pip install requests")
        sys.exit(1)

    supabase_url = supabase_url or os.environ.get("SUPABASE_URL") or os.environ.get("EXPO_PUBLIC_SUPABASE_URL")
    supabase_key = supabase_key or os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY") or os.environ.get("EXPO_PUBLIC_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        print("Supabase URL or key not provided. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars or pass --supabase-url/--supabase-key")
        sys.exit(1)

    endpoint = supabase_url.rstrip("/") + "/rest/v1/listings"
    headers = {
        "Authorization": f"Bearer {supabase_key}",
        "apikey": supabase_key,
        "Content-Type": "application/json",
    }
    if prefer_return:
        headers["Prefer"] = "return=representation"

    # POST rows as a JSON array
    resp = requests.post(endpoint, headers=headers, data=json.dumps(rows, ensure_ascii=False))
    if resp.status_code in (200, 201):
        print(f"Inserted {len(rows)} rows. Response status: {resp.status_code}")
        try:
            print(resp.json())
        except Exception:
            pass
    else:
        print(f"Insert failed: {resp.status_code}")
        try:
            print(resp.text)
        except Exception:
            pass

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate SQL INSERTs for luxury car listings")
    parser.add_argument("-n", "--num", type=int, default=40, help="Number of rows to generate")
    parser.add_argument("--sql-out", type=str, help="Write SQL INSERT to this file")
    parser.add_argument("--jsonl-out", type=str, help="Write JSONL (one JSON object per line) to this file")
    parser.add_argument("--api", action="store_true", help="Insert directly into Supabase via REST API")
    parser.add_argument("--supabase-url", type=str, help="Supabase URL (overrides env SUPABASE_URL)")
    parser.add_argument("--supabase-key", type=str, help="Supabase service role key or anon key (overrides env)")
    parser.add_argument("--prefer-return", action="store_true", help="Request returned rows from Supabase (Prefer: return=representation)")

    args = parser.parse_args()

    rows = generate_rows(num_rows=args.num)

    # Outputs
    did_write = False
    if args.sql_out:
        write_sql(rows, out_file=args.sql_out)
        did_write = True

    if args.jsonl_out:
        write_jsonl(rows, out_file=args.jsonl_out)
        did_write = True

    if args.api:
        insert_via_api(rows, supabase_url=args.supabase_url, supabase_key=args.supabase_key, prefer_return=args.prefer_return)
        did_write = True

    # Default: print SQL to stdout if nothing else requested
    if not did_write:
        write_sql(rows, out_file=None)