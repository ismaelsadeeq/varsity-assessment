'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  product.init({
    product_name: DataTypes.STRING,
    product_description: DataTypes.STRING,
    product_varieties: DataTypes.JSON
  }, {
    sequelize,
    paranoid:true,
    modelName: 'product',
  });
  return product;
};