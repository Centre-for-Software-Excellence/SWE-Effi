#!/usr/bin/env python3
"""
Copy & rename benchmark result files without touching their content.

Usage (from repo root):
    python scripts/transform_benchmark.py
"""

import shutil
from pathlib import Path

SRC = Path("benchmark/results/agent-scaffold-stats")
DEST = Path("website/public/data/benchmark/raw")
DEST_SUMMARY = Path("website/public/data/benchmark/raw/summary")


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source folder not found: {SRC.resolve()}")
    DEST.mkdir(parents=True, exist_ok=True)
    DEST_SUMMARY.mkdir(parents=True, exist_ok=True)

    copied = 0
    for json_file in SRC.glob("*/*/combined_stats.json"):
        scaffold = json_file.parent.parent.name
        model = json_file.parent.name
        out_name = f"{scaffold}_{model}.json"
        shutil.copyfile(json_file, DEST / out_name)
        print("✔", out_name)
        copied += 1

    print(f"\nDone. {copied} files copied to {DEST}")

    copied = 0
    for json_file in SRC.glob("*/*/summary_stats.json"):
        scaffold = json_file.parent.parent.name
        model = json_file.parent.name
        out_name = f"{scaffold}_{model}.json"
        shutil.copyfile(json_file, DEST_SUMMARY / out_name)
        print("✔", out_name)
        copied += 1
    print(f"\nDone. {copied} summary files copied to {DEST_SUMMARY}")


if __name__ == "__main__":
    main()
