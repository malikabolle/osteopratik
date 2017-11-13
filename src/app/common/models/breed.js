"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Breed = (function () {
    function Breed(name, price, $key, $value, $exists) {
        this.name = name;
        this.price = price;
        this.$key = $key;
        this.$value = $value;
        this.$exists = $exists;
    }
    return Breed;
}());
exports.Breed = Breed;
