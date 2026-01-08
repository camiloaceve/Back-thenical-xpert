export class CatBreedDto {
    id: string= '';
    name: string= '' ;
    description: string= '';
    temperament: string= '';
    origin: string= '';
    life_span: string= '';
    weight?: {
        imperial: string;
        metric: string;
    };
    wikipedia_url: string= '';
    adaptability?: number;
    affection_level?: number;
    child_friendly?: number;
    dog_friendly?: number;
    energy_level?: number;
    grooming?: number;
    health_issues?: number;
    intelligence?: number;
    shedding_level?: number;
    social_needs?: number;
    stranger_friendly?: number;
    vocalisation?: number;
}

export class CatImageDto {
    id: string= '';
    url: string= '';
    width: number = 0;
    height: number = 0;
    breeds?: CatBreedDto[];
}

export class BreedSearchQueryDto {
    q?: string= '';
    attach_breed?: number;
    page?: number;
    limit?: number;
}

export class ImagesQueryDto {
    breed_id: string= '';
    limit?: number;
}