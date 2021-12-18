import { Schema } from 'mongoose';
const ReactionSchema: Schema = new Schema({
    picture: {
        type: Image,
        required: true
    },
    count: {
        type: Number
    }
});

export default ReactionSchema;
