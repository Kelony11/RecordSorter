# RecordSorter
**Structured Record Parsing → Validation → Chronological Sorting**

# PROJECT OVERVIEW
RecordSorter is a lightweight, production-ready Node.js CLI tool that reads structured plain-text files containing multiple BEGIN:RECORD … END:RECORD blocks, validates each record’s properties against a defined schema, reports all format or logic errors, and outputs a clean, time-sorted version of the data to a new file.

# KEY FEATURES 🔑
**Structured record parsing.**
- Reads plain-text input where each record begins with BEGIN:RECORD and ends with END:RECORD (case-insensitive).
**Schema-based validation**
- Enforces required properties: IDENTIFIER, TIME.
- Supports optional properties: COLOR, WEIGHT, UNITS.
- Detects duplicate keys, unknown properties, and invalid formats.
**Comprehensive error handling.**
- Reports every issue with precise line numbers and descriptive messages.
- Outputs both valid results (sorted_records.txt) and error feedback to console.


# TECHNICAL STACK 🧱

- Language/Runtime: JavaScript (ESM), Node.js

- Core Modules: fs, path

- Testing: Jasmine 5

- Tooling: VS Code, Git/GitHub


# ROBUSTNESS & EDGE CASES

- Case-insensitive keywords (BEGIN:RECORD, end:record, etc.).

- Tolerates empty lines between and inside records.

- Detects missing dependent properties (UNITS ↔ WEIGHT).


# TESTING STRATEGY 🧪

**Run with npm test.**

**Highlights (Jasmine):**

- Sorting correctness (TIME ascending).

- Invalid TIME format handling.


# PERFORMANCE NOTES 🗒️

- Single-pass file parsing with O(N) complexity per record.
- Memory footprint tied linearly to number of records.


# DATA & PRIVACY ⚙️

- Operates entirely on local text files — no external API calls.

- You may safely include sample input/output for demonstration; exclude sensitive datasets via .gitignore.


# Contributors 
- Kelvin Ihezue

