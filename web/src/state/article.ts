import Source from "./source";

export default interface Article {
    id: number,
    entity: string,
    link: string,
    date: Date,
    source: Source
}