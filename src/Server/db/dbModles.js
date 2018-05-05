var models = {
    User:null,
    User_Profile:null,
    isSet: false
};

function createModels(bookshelf) {
    if(models.isSet === false) {
        models.User = bookshelf.Model.extend({
            tableName: 'user',
            user_profile: function() {
                return this.hasOne(models.User_Profile,"id");
            }
        });

        models.User_Profile = bookshelf.Model.extend({
            tableName: 'user_profile',
            user: function() {
                return this.belongsTo(models.User,"id");
            }
        });

        models.isSet = true;
    }

    return models;
}

module.exports = {
    createModels
}