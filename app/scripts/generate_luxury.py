#!/usr/bin/env python3
import random
import json
import os
import sys
try:
    import requests
except Exception:
    requests = None
from faker import Faker

# Utilisation de la locale anglaise pour d'autres données si nécessaire
fake = Faker('en_US')

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
                "color": "Rosso Corsa",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 385000, "mileage": 1200, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1597045566677-80db69a4d55a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Nero Daytona",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2022, "price": 365000, "mileage": 3500, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "F8 Spider": [
            {
                "color": "Blu Tour de France",
                "body": "Convertible", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 425000, "mileage": 450, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1632245889029-e406faaa34cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Argento Nurburgring",
                "body": "Convertible", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 395000, "mileage": 2100, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1583121274602-3e2820c698d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "SF90 Stradale": [
            {
                "color": "Giallo Modena",
                "body": "Supercar", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2024, "price": 625000, "mileage": 320, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1627454819213-f77f30768d6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Bianco Avus",
                "body": "Supercar", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2023, "price": 585000, "mileage": 1800, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ]
    },
    "Porsche": {
        "911 GT3": [
            {
                "color": "Racing Yellow",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Manual",
                "year": 2024, "price": 185000, "mileage": 650, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1611821064430-0d41040a12ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "GT Silver Metallic",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 165000, "mileage": 4200, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1592853625601-bb9d239129bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "Taycan Turbo S": [
            {
                "color": "Frozen Blue Metallic",
                "body": "Sedan", "doors": 4, "fuel": "Electric", "trans": "Automatic",
                "year": 2024, "price": 195000, "mileage": 280, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1616422285623-13ff0162193c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Carrara White Metallic",
                "body": "Sedan", "doors": 4, "fuel": "Electric", "trans": "Automatic",
                "year": 2023, "price": 175000, "mileage": 5600, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1619767886558-efdc259cde1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "Cayenne Coupe": [
            {
                "color": "Volcano Grey Metallic",
                "body": "SUV", "doors": 5, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2024, "price": 145000, "mileage": 890, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1662973767425-4b52df3b0521?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Mahogany Metallic",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 125000, "mileage": 8200, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1659942767982-2c02559560a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ]
    },
    "Lamborghini": {
        "Urus Performante": [
            {
                "color": "Arancio Borealis",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 285000, "mileage": 520, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1621996659490-6213b19b4e3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Nero Noctis",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 255000, "mileage": 3800, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1669920677278-34c9012c4d5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "Huracan Evo": [
            {
                "color": "Verde Mantis",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 325000, "mileage": 750, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1597687210387-e455c1e69333?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Bianco Icarus",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2022, "price": 285000, "mileage": 6500, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1544614471-ebc4d32049f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "Aventador SVJ": [
            {
                "color": "Rosso Mars",
                "body": "Supercar", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 625000, "mileage": 1100, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1566473965997-3de9c817e938?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Grigio Telesto",
                "body": "Supercar", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2022, "price": 585000, "mileage": 4200, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1632549723223-286c4e09569e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ]
    },
    "McLaren": {
        "720S": [
            {
                "color": "Volcano Orange",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 315000, "mileage": 680, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1569766524357-94d30c5c3127?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Silica White",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 285000, "mileage": 3200, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "P1": [
            {
                "color": "McLaren Orange",
                "body": "Supercar", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2021, "price": 1850000, "mileage": 1200, "condition": "Collector",
                "images": ["https://images.unsplash.com/photo-1512749491228-caef5a7831d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Carbon Black",
                "body": "Supercar", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2020, "price": 1750000, "mileage": 2500, "condition": "Collector",
                "images": ["https://images.unsplash.com/photo-1583251633115-7a3a0e69bc5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ]
    },
    "Tesla": {
        "Model S Plaid": [
            {
                "color": "Pearl White Multi-Coat",
                "body": "Sedan", "doors": 5, "fuel": "Electric", "trans": "Automatic",
                "year": 2024, "price": 125000, "mileage": 450, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Deep Blue Metallic",
                "body": "Sedan", "doors": 5, "fuel": "Electric", "trans": "Automatic",
                "year": 2023, "price": 105000, "mileage": 8500, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "Model X": [
            {
                "color": "Midnight Silver Metallic",
                "body": "SUV", "doors": 5, "fuel": "Electric", "trans": "Automatic",
                "year": 2024, "price": 115000, "mileage": 320, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1533106958148-dae351206497?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Solid Black",
                "body": "SUV", "doors": 5, "fuel": "Electric", "trans": "Automatic",
                "year": 2023, "price": 95000, "mileage": 12000, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1626847037657-fd3622613ce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ]
    },
    "Mercedes-Benz": {
        "AMG GT Black Series": [
            {
                "color": "AMG Magno Night Black",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 425000, "mileage": 580, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "AMG Green Hell Magno",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 385000, "mileage": 2800, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1620882779353-6a9c336b9c97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "G 63 AMG": [
            {
                "color": "Obsidian Black Metallic",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 185000, "mileage": 920, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1553440637-d22ed8a7a6ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Polar White",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 165000, "mileage": 6200, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ]
    },
    "BMW": {
        "M4 Competition": [
            {
                "color": "Sao Paulo Yellow",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 95000, "mileage": 1200, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Brooklyn Grey Metallic",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 82000, "mileage": 8500, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1618357777093-e847ad31393e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "i8": [
            {
                "color": "Crystal White Pearl",
                "body": "Coupe", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2022, "price": 125000, "mileage": 5200, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1556189250-72ba954e6ed0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Sophisto Grey Brilliant",
                "body": "Coupe", "doors": 2, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2021, "price": 115000, "mileage": 9800, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1594502184342-28efcb0a5748?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ]
    },
    "Aston Martin": {
        "DB11": [
            {
                "color": "Quantum Silver",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 245000, "mileage": 780, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Midnight Blue",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 215000, "mileage": 4500, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "Vantage": [
            {
                "color": "Lime Essence",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 185000, "mileage": 520, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Jet Black",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 165000, "mileage": 6800, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1600712242805-5f78671d243a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ]
    },
    "Bentley": {
        "Continental GT": [
            {
                "color": "Beluga Black",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2024, "price": 265000, "mileage": 650, "condition": "New",
                "images": ["https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Glacier White",
                "body": "Coupe", "doors": 2, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 235000, "mileage": 3200, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1621506821957-1b50ab7787d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            }
        ],
        "Bentayga": [
            {
                "color": "Verdant Green",
                "body": "SUV", "doors": 5, "fuel": "Hybrid", "trans": "Automatic",
                "year": 2024, "price": 245000, "mileage": 890, "condition": "Certified Pre-Owned",
                "images": ["https://images.unsplash.com/photo-1627233267923-a8c983428941?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
            },
            {
                "color": "Onyx Black",
                "body": "SUV", "doors": 5, "fuel": "Petrol", "trans": "Automatic",
                "year": 2023, "price": 215000, "mileage": 5600, "condition": "Used",
                "images": ["https://images.unsplash.com/photo-1623963473121-12798544c038?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
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

def generate_rows():
    """Generate a list of dict rows matching the `listings` table fields."""
    rows = []
    
    for make, models in CAR_DATA.items():
        for model_name, variants in models.items():
            for variant in variants:
                location = random.choice(LOCATIONS)
                title = f"{make} {model_name} {variant['year']}"
                
                # Description in English
                desc_start = ["Stunning", "Immaculate", "Well-maintained", "Beautiful", "Rare"]
                desc = (f"{random.choice(desc_start)} {variant['body']} in {variant['condition']} condition. "
                       f"Finished in {variant['color']} with premium leather interior. Full options included. "
                       f"{variant['fuel']} engine, {variant['trans']} transmission. Located in {location}.")

                row = {
                    "user_id": USER_ID,
                    "title": title,
                    "description": desc,
                    "price": format_price(variant['price']),
                    "make": make,
                    "model": model_name,
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