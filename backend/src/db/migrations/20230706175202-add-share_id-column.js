'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('codes', 'share_id', {
			type: Sequelize.STRING,
			allowNull: true,
			unique: true,
		})
	},
	async down(queryInterface) {
		await queryInterface.removeColumn('codes', 'share_id')
	},
}
