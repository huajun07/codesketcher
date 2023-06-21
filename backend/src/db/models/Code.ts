import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({
	tableName: 'codes',
	underscored: true,
	timestamps: true,
	paranoid: false,
})
export class Code extends Model {
	@Column({
		type: DataType.STRING,
		primaryKey: true,
	})
	uid!: string

	@Column({
		type: DataType.STRING,
		primaryKey: true,
	})
	codename!: string

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	code!: string

	@Column({
		type: DataType.STRING,
	})
	input?: string
}
