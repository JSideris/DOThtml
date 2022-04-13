export default function ObservableArray(items: any): void;
/**

(function testing() {

  var x = new ObservableArray(["a", "b", "c", "d"]);

  console.log("original array: %o", x.slice());

  x.addEventListener("itemadded", function(e) {
    console.log("Added %o at index %d.", e.item, e.index);
  });

  x.addEventListener("itemset", function(e) {
    console.log("Set index %d to %o.", e.index, e.item);
  });

  x.addEventListener("itemremoved", function(e) {
    console.log("Removed %o at index %d.", e.item, e.index);
  });
 
  console.log("popping and unshifting...");
  x.unshift(x.pop());

  console.log("updated array: %o", x.slice());

  console.log("reversing array...");
  console.log("updated array: %o", x.reverse().slice());

  console.log("splicing...");
  x.splice(1, 2, "x");
  console.log("setting index 2...");
  x[2] = "foo";

  console.log("setting length to 10...");
  x.length = 10;
  console.log("updated array: %o", x.slice());

  console.log("setting length to 2...");
  x.length = 2;

  console.log("extracting first element via shift()");
  x.shift();

  console.log("updated array: %o", x.slice());

})();

 */ 
