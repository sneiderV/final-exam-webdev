import { Mongo } from "meteor/mongo";

//conexión a Mongo
export const Comentarios = new Mongo.Collection ( 'comentarios' );
