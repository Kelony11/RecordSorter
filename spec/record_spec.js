// spec/record_spec.js
// Jasmine test suite for record sorting and validation modules (snake_case version)

const { sort_records } = require("../sort_records");
const { check_record_validity } = require("../validator");

describe("record_sorting_and_validation_logic", () => {

  it("should_correctly_sort_records_based_on_time_in_ascending_order", () => {
    const test_records = [
      { IDENTIFIER: "A-2", TIME: "20250927T100000" },
      { IDENTIFIER: "A-1", TIME: "20250927T093000" },
    ];

    const sorted_records = sort_records(test_records);
    expect(sorted_records[0].IDENTIFIER).toBe("A-1");
  });

  it("should_detect_when_required_properties_are_missing", () => {
    const { valid, errors, err_list } = check_record_validity({ IDENTIFIER: "A-1" }, 1);
    expect(valid).toBeFalse();

    const combined_errors = [...(errors || []), ...(err_list || [])];
    const missing_time_error = combined_errors.some((msg) =>
      /REQUIRED PROPERTY 'TIME' IS MISSING/i.test(msg)
    );
    expect(missing_time_error).toBeTrue();
  });

  it("should_flag_records_with_invalid_time_format", () => {
    const { valid, errors, err_list } = check_record_validity(
      { IDENTIFIER: "A-1", TIME: "2025-09-27" },
      1
    );
    expect(valid).toBeFalse();

    const combined_errors = [...(errors || []), ...(err_list || [])];
    expect(combined_errors.length).toBeGreaterThan(0);
  });

  // EXTRA TEST 1: Missing UNITS when WEIGHT exists
  it("should_detect_missing_units_when_weight_is_provided", () => {
    const { valid, errors, err_list } = check_record_validity(
      { IDENTIFIER: "A-1", TIME: "20250927T100000", WEIGHT: "72.5" },
      5
    );
    expect(valid).toBeFalse();

    const all_errors = [...(errors || []), ...(err_list || [])];
    const missing_units_error = all_errors.some((msg) =>
      /UNITS ARE MISSING/i.test(msg)
    );
    expect(missing_units_error).toBeTrue();
  });

  // EXTRA TEST 2: Missing WEIGHT when UNITS exist
  it("should_detect_missing_weight_when_units_are_provided", () => {
    const { valid, errors, err_list } = check_record_validity(
      { IDENTIFIER: "A-2", TIME: "20250927T101000", UNITS: "kilograms" },
      6
    );
    expect(valid).toBeFalse();

    const all_errors = [...(errors || []), ...(err_list || [])];
    const missing_weight_error = all_errors.some((msg) =>
      /WEIGHT IS MISSING/i.test(msg)
    );
    expect(missing_weight_error).toBeTrue();
  });

  // EXTRA TEST 3: Unknown property detection
  it("should_flag_unknown_property_within_record", () => {
    const { valid, errors, err_list } = check_record_validity(
      { IDENTIFIER: "A-3", TIME: "20250927T110000", AGE: "25" },
      7
    );
    expect(valid).toBeFalse();

    const all_errors = [...(errors || []), ...(err_list || [])];
    const unknown_property_error = all_errors.some((msg) =>
      /UNKNOWN PROPERTY 'AGE'/i.test(msg)
    );
    expect(unknown_property_error).toBeTrue();
  });

});
