> [!NOTE]
> Our evaluation script will be released soon!

# SWE-Effi

A comprehensive benchmark evaluation platform for Software Engineering Efficiency across different AI scaffolds and models.

## 📊 Overview

SWE-Effi provides a standardized platform for evaluating and comparing AI-powered software engineering tools across different scaffolds and language models. Our platform aggregates benchmark results and presents them through an interactive web interface.

**🌐 [Visit the Live Platform](https://center-for-software-excellence.github.io/SWE-Effi)**  
**📝 [Submit Your Results](https://center-for-software-excellence.github.io/SWE-Effi/about/submit-your-entry)**

## 📁 Repository Structure

```
SWE-Effi
├── benchmark
│   └── results
│       └── agent-scaffold-stats
│           ├── agentless/
│           │   ├── GPT-4o-mini-2024-07-18/
│           │   │   ├── combined_stats.json
│           │   │   └── summary_stats.json
│           │   └── qwen3-32B/
│           │       ├── combined_stats.json
│           │       └── summary_stats.json
│           ├── agentless-mini/
│           ├── auto-code-rover/
│           ├── openhands/
│           └── swe-agent/
├── scripts/
│   ├── transform-benchmark.py      # data transformation
│   └── update-website.sh           # easy update script
└── website/
    ├── public/
    │   └── data/
    │         └── benchmark/
    │             └── raw/            # benchmark data
    │                 └── summary/    # benchmark data
    └── src/
        └── docs/
            ├── about/
            └── index.tsx
```

## 🚀 Quick Start

### For Contributors

Want to submit your benchmark results? **[Follow our submission guide →](https://center-for-software-excellence.github.io/SWE-Effi/about/submit-your-entry)**

### For Developers & Maintainers

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-org/swe-effi.git
   cd swe-effi
   ```

2. **Process benchmark data:**

   ```bash
   # Process all new benchmark data
   ./scripts/update-website.sh --auto

   # Process specific scaffold/model
   ./scripts/update-website.sh agentless gpt-4

   # Validate files before processing
   ./scripts/update-website.sh --validate-only
   ```

3. **Run the website locally:**
   ```bash
   cd website
   npm install
   npm run dev
   ```

## 🛠 Development Workflow

### Processing New Submissions

When contributors submit benchmark results via PR:

1. **Review the Pull Request** for correctness
2. **Validate locally** (optional):
   ```bash
   git checkout [pr-branch]
   python3 scripts/transform-benchmark.py --validate-only
   ```
3. **Merge the PR**
4. **Update the website:**
   ```bash
   ./scripts/update-website.sh --auto
   ```

### Script Reference

**update-website.sh options:**

- `--auto`: Process all available data automatically
- `--validate-only`: Only validate files, don't transform
- `--verbose`: Show detailed logs
- `--help`: Show help information

**transform-benchmark.py options:**

- `--scaffold NAME --model NAME`: Process specific combination
- `--validate-only`: Only validate file format
- `--auto`: Auto process all data with validation
- `--verbose`: Show detailed logs

## 🔧 Technical Requirements

### Prerequisites

- **Python 3** for data processing
- **Node.js** and **npm** for website

### Environment Setup

```bash
cd website && npm install
```

## 🤝 Contributing

### Submit Benchmark Results Data Flow

```
Contributor Results → PR Submission → Validation → Processing → Website Integration
```

1. **Results Collection**: Contributors submit via GitHub PRs
2. **Validation**: Automated checks ensure data quality
3. **Processing**: Scripts transform data for website consumption
4. **Integration**: Website automatically displays new results

### File Format

Results must include:

- `combined_stats.json`
- `summary_stats.json`

## 📄 License

[Apache License 2.0](./LICENSE)
