import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {Spot} from "./spot.schema";

@Schema()
export class EcoSpot extends Spot {
    //Propriétés spécifiques aux Ecospots ci-dessous

    @Prop({required: true})
    details: string;

    @Prop({required: true})
    tips: string;

    //@Prop()
    //picture: Buffer;

    @Prop({type: {},required: true})
    main_type: {
        id: string;
        name: string;
        color: string;
        //logo: Buffer;
        description: string;
    };

    @Prop({type:[String],required: true})
    other_types: string[];
}

export const EcoSpotSchema = SchemaFactory.createForClass(EcoSpot);


