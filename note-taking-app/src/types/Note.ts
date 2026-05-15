
// export type Content ={
//     _id : string;
//     input : string;
// }
export interface Note  {
    _id :string;
    id? :string;
    title :string;
    content : string;
    description? : string;
    category? : string;
    priority? : string;
    input :string;
    notetypes?:string;
    createdAt : string;
}
