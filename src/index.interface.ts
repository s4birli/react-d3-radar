export type MainType = {
    type: 'Technology' | 'Process' | 'Data' | 'Asset';
    subCategory: string;
    probability: number;
    impact: number;
    total: number;
    subCategoryIndex?: number;
    radian?: number;
}



export type BubbleData = MainType & {
    radian?: number | string;
    x?: number | string;
    y?: number | string;
    vx?: number | string;
    vy?: number | string;
    t_radians: number | string;
}

export type DimensionsType = {
    width: number,
    height: number,
    margin: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number
    }
}