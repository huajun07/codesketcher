'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('codes', {
			uid: {
				primaryKey: true,
				type: Sequelize.STRING,
			},
			codename: {
				primaryKey: true,
				type: Sequelize.STRING,
			},
			code: {
				allowNull: false,
				type: Sequelize.TEXT,
			},
			input: {
				type: Sequelize.TEXT,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW'),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW'),
			},
		})
	},
	async down(queryInterface) {
		await queryInterface.dropTable('Codes')
	},
}
