const { v4: uuidV4 } = require('uuid');

class Band{
    constructor (name = 'no-name') {
        // npm i uuid -> para generar id's de manera automática
        this.id = uuidV4(); //identificador único
        this.name = name;
        this.votes = 0;
    }
}

module.exports = Band;