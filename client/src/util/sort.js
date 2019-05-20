// aus: http://cwestblog.com/2013/04/10/javascript-comparing-and-sorting-strings-with-numbers/
const cmpStringsWithNumbers = (a, b) => {
  // Regular expression to separate the digit string from the non-digit strings.
  var reParts = /\d+|\D+/g;

  // Regular expression to test if the string has a digit.
  var reDigit = /\d/;
  
  // Add cmpStringsWithNumbers to the global namespace.  This function takes to
  // strings and compares them, returning -1 if `a` comes before `b`, 0 if `a`
  // and `b` are equal, and 1 if `a` comes after `b`.

  // Get rid of casing issues.
  a = a.toUpperCase();
  b = b.toUpperCase();

  // Separates the strings into substrings that have only digits and those
  // that have no digits.
  var aParts = a.match(reParts);
  var bParts = b.match(reParts);

  // Used to determine if aPart and bPart are digits.
  var isDigitPart;

  // If `a` and `b` are strings with substring parts that match...
  if(aParts && bParts &&
      (isDigitPart = reDigit.test(aParts[0])) == reDigit.test(bParts[0])) {
    // Loop through each substring part to compare the overall strings.
    var len = Math.min(aParts.length, bParts.length);
    for(var i = 0; i < len; i++) {
      var aPart = aParts[i];
      var bPart = bParts[i];

      // If comparing digits, convert them to numbers (assuming base 10).
      if(isDigitPart) {
        aPart = parseInt(aPart, 10);
        bPart = parseInt(bPart, 10);
      }

      // If the substrings aren't equal, return either -1 or 1.
      if(aPart != bPart) {
        return aPart < bPart ? -1 : 1;
      }

      // Toggle the value of isDigitPart since the parts will alternate.
      isDigitPart = !isDigitPart;
    }
  }

  // Use normal comparison.
  return (a >= b) - (a <= b);
};

// aus: https://stackoverflow.com/questions/15478954/sort-array-elements-string-with-numbers-natural-sort
const naturalCompare = (a, b) => {
  var ax = [], bx = [];

  a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
  b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
  
  while(ax.length && bx.length) {
      var an = ax.shift();
      var bn = bx.shift();
      var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
      if(nn) return nn;
  }

  return ax.length - bx.length;
};

module.exports = {
  cmpStringsWithNumbers,
  naturalCompare,
};