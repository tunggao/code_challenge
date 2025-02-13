// Using for loop
var sum_to_n_1 = function(n) {
    var sum = 0;
    for (var i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
  };
  
  
  // Using mathematical formulas
  var sum_to_n_2 = function(n) {
    return (n * (n + 1)) / 2;
  };
  
  
  // Using recursion
  var sum_to_n_3 = function(n) {
    if (n === 0) {
        return 0;
    } else {
        return n + sum_to_n_3(n - 1);
    }
  };