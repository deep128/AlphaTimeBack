var models = {
    User:null,
    isSet: false
};

function createModels(bookshelf) {
    if(models.isSet === false) {
        models.User = bookshelf.Model.extend({
            tableName: 'user'
        });

        models.isSet = true;
    }

    return models;
}

module.exports = {
    createModels
}