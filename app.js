const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
// Static image allow
app.use(express.static('asset'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/webapp/index.html');
})

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});
