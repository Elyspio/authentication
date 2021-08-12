import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {UserEntity} from "./user.entity";


export enum Theme {
	Light = "light",
	System = "system",
	Dark = "dark"
}

@Entity("settings")
@Unique(["user"])
export class SettingsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: "enum", enum: Theme, default: Theme.System,})
	theme: Theme;

	@OneToOne(() => UserEntity, user => user.settings)
	@JoinColumn({name: "username"})
	user: UserEntity
}
