const { port } = require("../../config/index");

const run = (app) => app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});

module.exports = run;
