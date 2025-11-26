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
COLORS = ["Black", "White", "Grey", "Red", "Blue", "Green", "Yellow", "Silver", "Orange"]
CONDITIONS = ["Used", "New", "Certified Pre-Owned", "Collector"]

# Définition des modèles avec caractéristiques en ANGLAIS et images fonctionnelles
CAR_DATA = {
    "Ferrari": {
        "models": {
            "488 Pista": {"body": "Coupe", "doors": 2, "fuel": ["Petrol"], "trans": ["Automatic"]},
            "F8 Spider": {"body": "Convertible", "doors": 2, "fuel": ["Petrol"], "trans": ["Automatic"]},
            "SF90 Stradale": {"body": "Supercar", "doors": 2, "fuel": ["Hybrid"], "trans": ["Automatic"]},
            "Purosangue": {"body": "SUV", "doors": 4, "fuel": ["Petrol"], "trans": ["Automatic"]}
        },
        "images": [
            "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80", # Red Ferrari
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80"  # Ferrari rear
        ]
    },
    "Porsche": {
        "models": {
            "911 GT3": {"body": "Coupe", "doors": 2, "fuel": ["Petrol"], "trans": ["Automatic", "Manual"]},
            "Taycan Turbo S": {"body": "Sedan", "doors": 4, "fuel": ["Electric"], "trans": ["Automatic"]},
            "Cayenne Coupe": {"body": "SUV", "doors": 5, "fuel": ["Hybrid", "Petrol"], "trans": ["Automatic"]},
            "Panamera": {"body": "Sedan", "doors": 5, "fuel": ["Hybrid"], "trans": ["Automatic"]}
        },
        "images": [
            "https://images.unsplash.com/photo-1632154939368-1a92207d8af3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", # 911
        ]
    },
    "Lamborghini": {
        "models": {
            "Urus Performante": {"body": "SUV", "doors": 5, "fuel": ["Petrol"], "trans": ["Automatic"]},
            "Huracan Evo": {"body": "Coupe", "doors": 2, "fuel": ["Petrol"], "trans": ["Automatic"]},
            "Revuelto": {"body": "Supercar", "doors": 2, "fuel": ["Hybrid"], "trans": ["Automatic"]}
        },
        "images": [
            "https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", # Urus
            "https://images.unsplash.com/photo-1689310873660-77aefbc74edd?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  # Huracan
        ]
    },
    "Tesla": { 
        "models": {
            "Model S Plaid": {"body": "Sedan", "doors": 5, "fuel": ["Electric"], "trans": ["Automatic"]},
            "Model X": {"body": "SUV", "doors": 5, "fuel": ["Electric"], "trans": ["Automatic"]}
        },
        "images": [
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80", # Model S
            "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80"  # Model X
        ]
    },
    "Rolls-Royce": {
        "models": {
            "Cullinan": {"body": "SUV", "doors": 5, "fuel": ["Petrol"], "trans": ["Automatic"]},
            "Phantom": {"body": "Sedan", "doors": 4, "fuel": ["Petrol"], "trans": ["Automatic"]}
        },
        "images": [
            "https://images.unsplash.com/photo-1632548260498-b7246fa466ea?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" # Rolls Royce
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
    for _ in range(num_rows):
        # 1. Choisir Marque et Modèle
        make = random.choice(list(CAR_DATA.keys()))
        model_name = random.choice(list(CAR_DATA[make]["models"].keys()))
        specs = CAR_DATA[make]["models"][model_name]
        
        # 2. Dériver les attributs cohérents
        year = random.randint(2018, 2024)
        body = specs["body"]
        doors = specs["doors"]
        fuel = random.choice(specs["fuel"])
        transmission = random.choice(specs["trans"])
        
        # 3. Logique Prix & Km
        base_price = 100000
        if make in ["Ferrari", "Rolls-Royce", "Lamborghini"]: base_price = 250000
        price = base_price + random.randint(-20000, 150000)
        
        mileage = random.randint(500, 60000) # Km plus réaliste pour de l'occasion
        
        # Logique pour condition
        if mileage < 1000 and year == 2024:
            condition = "New"
        elif mileage < 5000:
            condition = "Certified Pre-Owned"
        else:
            condition = "Used"
            
        # 4. Esthétique
        color = random.choice(COLORS)
        location = random.choice(LOCATIONS)
        
        title = f"{make} {model_name} {year}"

        # Description in English
        desc_start = ["Stunning", "Immaculate", "Well-maintained", "Beautiful", "Rare"]
        desc = f"{random.choice(desc_start)} {body} in {condition} condition. Finished in {color} with premium leather interior. Full options included. {fuel} engine, {transmission} transmission. Located in {location}."

        # 5. Images (as list for API / JSON)
        images_list = CAR_DATA[make]["images"]
        selected_imgs = images_list if random.random() > 0.6 else [images_list[0]]

        row = {
            "user_id": USER_ID,
            "title": title,
            "description": desc,
            "price": format_price(price),
            "make": make,
            "model": model_name,
            "year": year,
            "mileage": mileage,
            "fuel_type": fuel,
            "transmission": transmission,
            "doors": doors,
            "color": color,
            "body_type": body,
            "condition": condition,
            "images": selected_imgs,
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