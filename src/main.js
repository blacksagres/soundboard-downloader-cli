var table = Array.from(Array(10))
    .keys()
    .map(function (m, index) { return ({ m: m, index: index }); });
console.table(table);
