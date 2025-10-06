// The file creates a function that handles records based on ther time property 

function sort_records(records) {

    if (!Array.isArray(records)) {
    throw new Error("Expected an array of records");
  }

  // Sort by ascending TIME string 
  return records.sort((a, b) => {
    const time_a = a.TIME || "";
    const time_b = b.TIME || "";
    return time_a.localeCompare(time_b);
  });

}

module.exports = { sort_records };