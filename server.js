const express = require('express'); 
const app = express();
app.use(express.static(__dirname));

const listener = app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port ' + listener.address().port)
});