import csv
import re

substances = [
    "Codeine", "Tramadol", "Tapentadol", "Morphine", "Fentanyl", "Buprenorphine", "Methadone",
    "Alprazolam", "Diazepam", "Clonazepam", "Lorazepam", "Nitrazepam", "Midazolam", "Chlordiazepoxide", "Clobazam",
    "Zolpidem", "Zopiclone", "Eszopiclone",
    "Phenobarbital", "Phenobarbitone", "Pentobarbital",
    "Pregabalin", "Gabapentin",
    "Carisoprodol", "Baclofen", "Tizanidine", "Chlorzoxazone",
    "Methylphenidate", "Modafinil", "Pseudoephedrine", "Sibutramine",
    "Ketamine", "Dextromethorphan", "Nitrous Oxide",
    "Promethazine", "Diphenhydramine", "Chlorpheniramine", "Hydroxyzine",
    "Trihexyphenidyl", "Atropine", "Scopolamine",
    "Amitriptyline", "Quetiapine", "Bupropion",
    "Nandrolone", "Testosterone", "Stanozolol", "Clenbuterol",
    "Toluene", "Alkyl Nitrites", "Cannabis", "Bhang"
]

found_drugs = []

try:
    with open('scripts/rate.csv', mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        data = list(reader)
except FileNotFoundError:
    print("rate.csv not found in scripts directory.")
    exit()

for row in data:
    generic_name = row['Generic Name'].lower()
    for s in substances:
        # Match substance name as a word
        if re.search(rf'\b{re.escape(s.lower())}\b', generic_name):
            try:
                mrp = float(row['MRP'])
                # We want ALL compositions containing the salt, so we don't break
                found_drugs.append({
                    "Substance": s,
                    "Full Name": row['Generic Name'],
                    "Pack Size": row['Unit Size'],
                    "MRP": mrp
                })
                # Note: if a drug has multiple salts, it might appear under each. 
                # This seems to be what the user wants ("if all of the composition is a medicine composition contain that salt. Then mention that").
            except:
                continue

# Sort by Substance, then by MRP
sorted_drugs = sorted(found_drugs, key=lambda x: (x['Substance'], x['MRP']))

# Save to the new full list file
output_file = 'scripts/substance_mrp_full_list.txt'
with open(output_file, 'w', encoding='utf-8') as out:
    out.write("Substance MRP Full List (Every Composition Containing the Target Salts)\n")
    out.write("=" * 120 + "\n")
    out.write(f"{'Substance':<15} | {'MRP':<8} | {'Pack Size':<15} | {'Full Name'}\n")
    out.write("-" * 120 + "\n")
    for d in sorted_drugs:
        out.write(f"{d['Substance']:<15} | Rs {d['MRP']:>6.2f} | {d['Pack Size']:<15} | {d['Full Name']}\n")

print(f"Full list generated with {len(found_drugs)} entries.")
print(f"Saved to {output_file}")
