import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Generated } from "typeorm";


@Entity()
export default abstract class Model extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint"
    })
    id: number;

    @Column()
    @Generated("uuid")
    uuid: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    constructor(model?:Partial<any>){
        super()
        Object.assign(this,model)
    }

    toJSON(){
        return{...this,id:undefined}
    }

}   