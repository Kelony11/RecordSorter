// Responsible for checking each record and making sure all its properties are valid

function check_record_validity(record, line_index) {
    const optional = ["COLOR", "WEIGHT", "UNITS"];
    const required = ["IDENTIFIER", "TIME"];
    const property_names = new Set([...optional, ...required]);

    const detected_error = [];

    // --- Required property check ---
    required.forEach((item) => {
        if (!record[item]) {
            detected_error.push(`REQUIRED PROPERTY '${item}' IS MISSING NEAR LINE: ${line_index}`);
        }
    });

    // --- Dependency check between WEIGHT and UNITS ---
    if (record.UNITS && !record.WEIGHT) {
        detected_error.push(`WEIGHT IS MISSING NEAR LINE: ${line_index}`);
    }
    if (!record.UNITS && record.WEIGHT) {
        detected_error.push(`UNITS ARE MISSING NEAR LINE: ${line_index}`);
    }

    // --- Detect unknown properties ---
    Object.keys(record).forEach((item) => {
        if (!property_names.has(item)) {
            detected_error.push(`UNKNOWN PROPERTY '${item}' FOUND NEAR LINE: ${line_index}`);
        }
    });

    // --- Validate TIME format ---
    if (record.TIME && !/^\d{8}T\d{6}$/.test(record.TIME)) {
        detected_error.push(`INVALID TIME FORMAT '${record.TIME}' NEAR LINE: ${line_index}`);
    }

    // --- Validate WEIGHT numeric format ---
    if (record.WEIGHT && isNaN(parseFloat(record.WEIGHT))) {
        detected_error.push(`WEIGHT '${record.WEIGHT}' IS NOT A NUMBER NEAR LINE: ${line_index}`);
    }

    // --- Return consistent result structure ---
    return {
        valid: detected_error.length === 0,  // true only if no errors detected
        errors: detected_error,              // main array for error messages
        errList: detected_error              
    };
}

// Export under both names for compatibility with index.js and Jasmine tests
module.exports = {
    check_record_validity,
    validateRecord: check_record_validity
};
