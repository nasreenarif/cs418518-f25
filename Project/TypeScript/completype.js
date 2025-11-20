// ------------------------------
// 1. Typed Arrays
// ------------------------------
var scores = [85, 92, 78];
var fruits = ["Apple", "Banana", "Mango"];
// Pushing correct and incorrect values
scores.push(99); // ✔ allowed
// scores.push("test"); // Type error
// ------------------------------
// 2. Typed Objects
// ------------------------------
var student = {
    name: "Sara",
    age: 22,
    isActive: true,
};
// student.age = "twenty two"; // Type error
// ------------------------------
// 3. Nested Object Types
// ------------------------------
var course = {
    title: "Web Development",
    duration: 12,
    instructor: {
        name: "Nasreen",
        experience: 7,
    },
};
// ------------------------------
// 4. Function with Typed Parameters + Return Type
// ------------------------------
function add(a, b) {
    return a + b;
}
var result = add(10, 20);
console.log("Result:", result);
// add("hi", 10); // Type error
// ------------------------------
// 5. Function Returning an Object
// ------------------------------
function getStudent() {
    return {
        name: "John",
        age: 20,
        enrolled: true,
    };
}
console.log(getStudent());
// ------------------------------
// 6. Array of Objects
// ------------------------------
var users = [
    { id: 1, username: "ali", isAdmin: false },
    { id: 2, username: "sara", isAdmin: true },
];
console.log(users);
