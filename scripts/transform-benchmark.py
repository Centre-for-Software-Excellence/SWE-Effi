#!/usr/bin/env python3
"""
Enhanced benchmark data transformation script.
Usage (from repo root):
    python scripts/transform-benchmark.py                    # Process all data (original behavior)
    python scripts/transform-benchmark.py --scaffold agentless --model GPT-4o-mini-2024-07-18  # Process specific combination
    python scripts/transform-benchmark.py --validate-only    # Only validate files
    python scripts/transform-benchmark.py --auto             # Auto process with validation
"""
import argparse
import json
import logging
import shutil
import sys
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple


def setup_logging(verbose: bool = False) -> logging.Logger:
    """Setup logging configuration"""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%H:%M:%S",
    )
    return logging.getLogger(__name__)


class BenchmarkTransformer:
    """Enhanced benchmark data transformer with validation and error handling"""

    def __init__(self, logger: logging.Logger):
        self.logger = logger
        self.SRC = Path("benchmark/results/agent-scaffold-stats")
        self.DEST = Path("website/public/data/benchmark/raw")
        self.DEST_SUMMARY = Path("website/public/data/benchmark/raw/summary")

        # Required fields for validation
        self.REQUIRED_FIELDS = {
            "combined_stats.json": {
                "structure": "nested_instances",  # Each key is an instance with nested fields
                "instance_fields": [
                    "input_tokens",
                    "output_tokens",
                    "cpu_time",
                    "gpu_time",
                    "resolved",
                    "duration",
                    "llm_calls",
                    "measured_gpu_time",
                    "measured_duration",
                ],
            },
            "summary_stats.json": {
                "structure": "flat",  # Flat dictionary with required fields
                "required_fields": [
                    "total_projects",
                    "resolved",
                    "avg_resolved",
                    "total_tokens",
                    "avg_total_tokens",
                    "input_tokens",
                    "avg_input_tokens",
                    "output_tokens",
                    "avg_output_tokens",
                    "llm_calls",
                    "avg_llm_calls",
                    "cpu_time",
                    "avg_cpu_time",
                    "gpu_time",
                    "avg_gpu_time",
                    "duration",
                    "avg_duration",
                    "measured_gpu_time",
                    "avg_measured_gpu_time",
                    "measured_duration",
                    "avg_measured_duration",
                    "precision",
                ],
            },
        }

    def validate_json_file(self, file_path: Path, file_type: str) -> bool:
        """Validate a JSON file has required structure"""
        try:
            if not file_path.exists():
                self.logger.error(f"Missing file: {file_path}")
                return False

            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            validation_config = self.REQUIRED_FIELDS.get(file_type, {})

            if file_type == "combined_stats.json":
                return self._validate_combined_stats(data, file_path, validation_config)
            elif file_type == "summary_stats.json":
                return self._validate_summary_stats(data, file_path, validation_config)

            self.logger.debug(f"{file_path}: Validation passed")
            return True

        except json.JSONDecodeError as e:
            self.logger.error(f"{file_path}: Invalid JSON format - {e}")
            return False
        except Exception as e:
            self.logger.error(f"{file_path}: Validation error - {e}")
            return False

    def _validate_combined_stats(
        self, data: dict, file_path: Path, config: dict
    ) -> bool:
        """Validate combined_stats.json structure"""
        if not isinstance(data, dict) or not data:
            self.logger.error(f"{file_path}: Should be a non-empty dictionary")
            return False

        required_instance_fields = config.get("instance_fields", [])

        # Check each instance
        for instance_id, instance_data in data.items():
            if not isinstance(instance_data, dict):
                self.logger.error(
                    f"{file_path}: Instance '{instance_id}' should be a dictionary"
                )
                return False

            # Check required fields for each instance
            missing_fields = [
                field
                for field in required_instance_fields
                if field not in instance_data
            ]

            if missing_fields:
                self.logger.error(
                    f"{file_path}: Instance '{instance_id}' missing fields: {missing_fields}"
                )
                return False

            # Validate field types
            numeric_fields = [
                "input_tokens",
                "output_tokens",
                "cpu_time",
                "gpu_time",
                "duration",
                "llm_calls",
                "measured_gpu_time",
                "measured_duration",
            ]
            for field in numeric_fields:
                if field in instance_data and not isinstance(
                    instance_data[field], (int, float)
                ):
                    self.logger.error(
                        f"{file_path}: Instance '{instance_id}' field '{field}' should be numeric"
                    )
                    return False

            # Validate boolean field
            if "resolved" in instance_data and not isinstance(
                instance_data["resolved"], bool
            ):
                self.logger.error(
                    f"{file_path}: Instance '{instance_id}' field 'resolved' should be boolean"
                )
                return False

        instance_count = len(data)
        self.logger.debug(
            f"{file_path}: Valid combined stats with {instance_count} instances"
        )
        return True

    def _validate_summary_stats(
        self, data: dict, file_path: Path, config: dict
    ) -> bool:
        """Validate summary_stats.json structure"""
        if not isinstance(data, dict):
            self.logger.error(f"{file_path}: Should be a dictionary")
            return False

        required_fields = config.get("required_fields", [])
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            self.logger.error(f"{file_path}: Missing required fields: {missing_fields}")
            return False

        # Validate numeric fields
        numeric_fields = [
            "total_projects",
            "resolved",
            "avg_resolved",
            "total_tokens",
            "avg_total_tokens",
            "input_tokens",
            "avg_input_tokens",
            "output_tokens",
            "avg_output_tokens",
            "llm_calls",
            "avg_llm_calls",
            "cpu_time",
            "avg_cpu_time",
            "gpu_time",
            "avg_gpu_time",
            "duration",
            "avg_duration",
            "measured_gpu_time",
            "avg_measured_gpu_time",
            "measured_duration",
            "avg_measured_duration",
            "precision",
        ]

        for field in numeric_fields:
            if field in data and not isinstance(data[field], (int, float)):
                self.logger.error(
                    f"{file_path}: Field '{field}' should be numeric, got {type(data[field])}"
                )
                return False

        # Validate ranges for specific fields
        if "avg_resolved" in data and not (0 <= data["avg_resolved"] <= 1):
            self.logger.error(f"{file_path}: 'avg_resolved' should be between 0 and 1")
            return False

        if "precision" in data and not (0 <= data["precision"] <= 1):
            self.logger.error(f"{file_path}: 'precision' should be between 0 and 1")
            return False

        self.logger.debug(
            f"{file_path}: Valid summary stats with {data.get('total_projects', 0)} projects"
        )
        return True

    def find_all_combinations(self) -> List[Tuple[str, str]]:
        """Find all scaffold/model combinations with data"""
        combinations = []

        if not self.SRC.exists():
            self.logger.error(f"Source folder not found: {self.SRC.resolve()}")
            return combinations

        for scaffold_dir in self.SRC.iterdir():
            if not scaffold_dir.is_dir():
                continue

            for model_dir in scaffold_dir.iterdir():
                if not model_dir.is_dir():
                    continue

                # Check if both required files exist
                combined_stats = model_dir / "combined_stats.json"
                summary_stats = model_dir / "summary_stats.json"

                if combined_stats.exists() and summary_stats.exists():
                    combinations.append((scaffold_dir.name, model_dir.name))
                else:
                    missing = []
                    if not combined_stats.exists():
                        missing.append("combined_stats.json")
                    if not summary_stats.exists():
                        missing.append("summary_stats.json")
                    self.logger.warning(
                        f"{scaffold_dir.name}/{model_dir.name}: Missing files: {missing}"
                    )

        return combinations

    def validate_combination(self, scaffold: str, model: str) -> bool:
        """Validate files for a specific scaffold/model combination"""
        base_path = self.SRC / scaffold / model

        files_to_check = [
            (base_path / "combined_stats.json", "combined_stats.json"),
            (base_path / "summary_stats.json", "summary_stats.json"),
        ]

        all_valid = True
        for file_path, file_type in files_to_check:
            if not self.validate_json_file(file_path, file_type):
                all_valid = False

        return all_valid

    def validate_all(self) -> Dict[str, bool]:
        """Validate all combinations and return results"""
        self.logger.info("Starting validation...")
        combinations = self.find_all_combinations()

        if not combinations:
            self.logger.error("No valid combinations found")
            return {}

        results = {}
        valid_count = 0

        for scaffold, model in combinations:
            key = f"{scaffold}/{model}"
            is_valid = self.validate_combination(scaffold, model)
            results[key] = is_valid

            if is_valid:
                valid_count += 1
                self.logger.info(f"{key}: Valid")
            else:
                self.logger.error(f"{key}: Validation failed")

        self.logger.info(
            f"Validation complete: {valid_count}/{len(combinations)} combinations valid"
        )
        return results

    def backup_existing_data(self) -> Optional[Path]:
        """Create backup of existing data"""
        if self.DEST.exists() and any(self.DEST.iterdir()):
            backup_dir = self.DEST.parent / "backup"
            if backup_dir.exists():
                shutil.rmtree(backup_dir)
            shutil.copytree(self.DEST, backup_dir)
            self.logger.info(f"Backup created: {backup_dir}")
            return backup_dir
        return None

    def transform_combination(
        self, scaffold: str, model: str, validate: bool = True
    ) -> bool:
        """Transform data for a specific scaffold/model combination"""
        if validate and not self.validate_combination(scaffold, model):
            self.logger.error(
                f"{scaffold}/{model}: Validation failed, skipping transformation"
            )
            return False

        base_path = self.SRC / scaffold / model

        # Ensure destination directories exist
        self.DEST.mkdir(parents=True, exist_ok=True)
        self.DEST_SUMMARY.mkdir(parents=True, exist_ok=True)

        try:
            # Copy combined_stats.json
            combined_src = base_path / "combined_stats.json"
            combined_dest = self.DEST / f"{scaffold}_{model}.json"
            shutil.copyfile(combined_src, combined_dest)

            # Copy summary_stats.json
            summary_src = base_path / "summary_stats.json"
            summary_dest = self.DEST_SUMMARY / f"{scaffold}_{model}.json"
            shutil.copyfile(summary_src, summary_dest)

            self.logger.info(f"{scaffold}/{model}: Transformed successfully")
            return True

        except Exception as e:
            self.logger.error(f"{scaffold}/{model}: Transform failed - {e}")
            return False

    def transform_all(self, validate: bool = True) -> Dict[str, bool]:
        """Transform all valid combinations (original behavior + validation)"""
        self.logger.info("Starting transformation...")

        if validate:
            validation_results = self.validate_all()
            if not any(validation_results.values()):
                self.logger.error("No valid data to transform")
                return {}

            combinations = [
                (k.split("/")[0], k.split("/")[1])
                for k, v in validation_results.items()
                if v
            ]
        else:
            combinations = self.find_all_combinations()

        if not combinations:
            self.logger.error("No combinations found to process")
            return {}

        # Create backup
        self.backup_existing_data()

        # Ensure destination directories exist
        self.DEST.mkdir(parents=True, exist_ok=True)
        self.DEST_SUMMARY.mkdir(parents=True, exist_ok=True)

        results = {}
        success_count = 0

        for scaffold, model in combinations:
            key = f"{scaffold}/{model}"
            success = self.transform_combination(
                scaffold, model, validate=False
            )  # Already validated if needed
            results[key] = success

            if success:
                success_count += 1

        self.logger.info(
            f"Transformation complete: {success_count}/{len(combinations)} successful"
        )

        if success_count > 0:
            self.logger.info(f"Data copied to: {self.DEST}")
            self.logger.info(f"Summaries copied to: {self.DEST_SUMMARY}")

        return results


def main():
    parser = argparse.ArgumentParser(
        description="Transform benchmark results for website"
    )
    parser.add_argument("--scaffold", help="Process specific scaffold only")
    parser.add_argument(
        "--model", help="Process specific model only (requires --scaffold)"
    )
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Only validate files, do not transform",
    )
    parser.add_argument(
        "--auto",
        action="store_true",
        help="Auto process with validation and error handling",
    )
    parser.add_argument(
        "--no-validate", action="store_true", help="Skip validation (original behavior)"
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true", help="Enable verbose logging"
    )

    args = parser.parse_args()

    # Setup logging
    logger = setup_logging(args.verbose)
    transformer = BenchmarkTransformer(logger)

    try:
        if args.validate_only:
            # Only validate files
            results = transformer.validate_all()
            if not any(results.values()):
                sys.exit(1)
            return

        if args.scaffold and args.model:
            # Process specific combination
            validate = not args.no_validate
            success = transformer.transform_combination(
                args.scaffold, args.model, validate
            )
            if not success:
                sys.exit(1)

        elif args.scaffold:
            logger.error("--model is required when using --scaffold")
            sys.exit(1)

        else:
            # Process all combinations
            validate = args.auto or not args.no_validate
            results = transformer.transform_all(validate)

            if not results or not any(results.values()):
                logger.error("No data was successfully processed")
                sys.exit(1)

    except KeyboardInterrupt:
        logger.info("Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        if args.verbose:
            import traceback

            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
