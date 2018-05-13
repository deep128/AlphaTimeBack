var models = {
    User:null,
    User_Profile:null,
    isSet: false
};

function createModels(bookshelf) {
    if(models.isSet === false) {
        models.User = bookshelf.Model.extend({
            tableName: 'user',
            idAttribute: "id",
            user_profile: function() {
                return this.hasOne(models.User_Profile,"id");
            },
            school: function() {
                return this.belongsTo(models.School,"principleid")
            }
        });

        models.User_Profile = bookshelf.Model.extend({
            tableName: 'user_profile',
            idAttribute: "id",
            user: function() {
                return this.belongsTo(models.User,"id");
            },

            School: function() {
                return this.belongsTo(models.School,"id");
            }
        });

        models.School = bookshelf.Model.extend({
            tableName: 'school',
            idAttribute:"id",
            user_profile: function() {
                return this.hasManny(models.User_Profile,"schoolId");
            },
            principle: function() {
                return this.hasOne(models.User,"id")
            }
        });

        models.isSet = true;
    }

    return models;
}

module.exports = {
    createModels
}