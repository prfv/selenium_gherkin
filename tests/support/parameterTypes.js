const { defineParameterType } = require("@cucumber/cucumber");

defineParameterType(
    {
        regexp: /should|shouldn't/,
        name: "should",
    }
);

defineParameterType(
    {
        regexp: /create|edit/,
        name: "action",
    }
);
