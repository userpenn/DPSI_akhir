const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Complaint = sequelize.define("Complaint", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentNIM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending", // Status awal pengaduan
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: true, // Respons dapat kosong jika belum direspon
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true, // Tanggal respons dapat kosong jika belum direspon
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
});

module.exports = Complaint;
