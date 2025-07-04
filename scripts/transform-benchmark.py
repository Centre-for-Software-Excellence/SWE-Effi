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


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source folder not found: {SRC.resolve()}")
    DEST.mkdir(parents=True, exist_ok=True)

    copied = 0
    for json_file in SRC.glob("*/*-combined_stats.json"):
        scaffold = json_file.parent.name
        # strip the suffix "-combined_stats.json"
        model = json_file.stem.replace("-combined_stats", "")
        out_name = f"{scaffold}_{model}.json"
        shutil.copyfile(json_file, DEST / out_name)
        print("✔", out_name)
        copied += 1

    print(f"\nDone. {copied} files copied to {DEST}")


if __name__ == "__main__":
    main()
