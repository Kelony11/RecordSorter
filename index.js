// Main entry point: reads, validates, and sorts record data from file

/* PROGRAM SUMMARY:
   1. Access a user-provided file containing one or more data records.
   2. Parse and validate each record (delegating checks to validator.js).
   3. Sort the records chronologically by TIME, then write to a new file.
*/

// --- Import modules and helpers ---
const fs = require("fs");              // Node's file system module
const path = require("path");          // Safe cross-platform path handling
const { check_record_validity } = require("./validator");
const { sort_records } = require("./sort_records");

// --- Retrieve user input file path from CLI ---
const user_input = process.argv[2];
if (!user_input) {
    console.error("Usage: node index.js <filename>");
    process.exit(1);
}

try {
    // --- Read file content and prep containers ---
    const file_content = fs.readFileSync(path.resolve(user_input), "utf-8");
    const file_lines = file_content.split(/\r?\n/);

    const record_data = [];         // collection of all parsed records
    const detected_errors = [];     // store all validation or parsing issues
    let r_object = null;            // current record being built
    let line_index = 0;             // line tracker for precise error logs

    // --- Iterate through each line in the file ---
    for (const line of file_lines) {
        line_index++;
        const trimmed_line = line.trim();
        if (trimmed_line === "") continue; // ignore blank lines entirely

        // Handle beginning of a record block
        if (/^begin:record$/i.test(trimmed_line)) {
            if (r_object) {
                detected_errors.push(`Unexpected BEGIN detected at line ${line_index}`);
            }
            r_object = {}; // initialize a fresh record object
            continue;
        }

        // Handle end of record block
        if (/^end:record$/i.test(trimmed_line)) {
            if (!r_object) {
                detected_errors.push(`END keyword without an open record at line ${line_index}`);
                continue;
            }

            // Pass record for validation using helper
            const { valid, errors } = check_record_validity(r_object, line_index);
            if (!valid) detected_errors.push(...errors);

            // Save valid or invalid record (still include it for sorting)
            record_data.push(r_object);
            r_object = null; // reset pointer for next record
            continue;
        }

        // Process properties inside a record
        if (r_object) {
            const parts = trimmed_line.split(":"); // each property follows name:value
            if (parts.length < 2) {
                detected_errors.push(`Invalid property structure near line ${line_index}`);
                continue;
            }

            const key = parts[0].trim().toUpperCase();      // property name (standardized)
            const val = parts.slice(1).join(":").trim();    // property value (supports colons)

            if (r_object[key]) {
                detected_errors.push(`Duplicate key '${key}' at line ${line_index}`);
            }
            r_object[key] = val; // store/update property
        } 
        else {
            // line appears outside BEGIN/END pair
            detected_errors.push(`Orphan line outside record at ${line_index}: "${trimmed_line}"`);
        }
    }

    // --- Enforce global unique IDENTIFIER rule ---
    const hash_map = new Set();
    record_data.forEach((r, idx) => {
        const indentifier = r.IDENTIFIER?.toLowerCase();
        if (!indentifier) return;
        if (hash_map.has(indentifier)) {
            detected_errors.push(
                `Duplicate IDENTIFIER '${r.IDENTIFIER}' found in record #${idx + 1}`
            );
        }
        hash_map.add(indentifier);
    });

    // --- Sort records chronologically and rebuild formatted output ---
    const sorted = sort_records(record_data);
    const output = sorted
        .map((r) => {
            const props = [
                "BEGIN:RECORD",
                `IDENTIFIER: ${r.IDENTIFIER}`,
                `TIME: ${r.TIME}`,
                ...(r.WEIGHT ? [`WEIGHT: ${r.WEIGHT}`] : []),
                ...(r.UNITS ? [`UNITS: ${r.UNITS}`] : []),
                ...(r.COLOR ? [`COLOR: ${r.COLOR}`] : []),
                "END:RECORD",
                ""
            ];
            return props.join("\n");
        })
        .join("\n");

    // --- Write results and report outcome ---
    fs.writeFileSync("sorted_records.txt", output);
    console.log("✅ Sorted records written successfully to sorted_records.txt");

    if (detected_errors.length) {
        console.log("\n⚠️ The following issues were detected:");
        detected_errors.forEach((e) => console.log(" - " + e));
    } else {
        console.log("No errors found — all records valid.");
    }

} catch (err) {
    console.error("❌ Execution error:", err.message);
}
