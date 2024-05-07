/**
 * The code is defining an object called `httpMethods` that contains properties for different HTTP
 * methods. Each property is a key-value pair, where the key is the name of the HTTP method (e.g.,
 * "POST", "GET", "PUT", etc.) and the value is the corresponding string representation of the method.
 * This object can be used to easily reference the HTTP methods in other parts of the code.
 */
const httpMethods = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
};

module.exports = { httpMethods };
