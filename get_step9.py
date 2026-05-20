import os

dir_path = r"C:\Users\BBSUL\.gemini\antigravity\brain\06bf0da4-a976-4ce6-b230-9d37e04227a4"
for root, dirs, files in os.walk(dir_path):
    for f in files:
        full_path = os.path.join(root, f)
        if "get_step9" in f or "step9_full" in f:
            continue
        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as file:
                content = file.read()
                if "confidence_breakdown" in content:
                    print(f"FOUND match in {full_path} (size: {len(content)})")
        except Exception as e:
            pass
