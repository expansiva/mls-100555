/// <mls fileReference="_100555_/l2/utils/cssHelperIndexBase.ts" enhancement="_blank" />

export type IMode = 'collapsed' | 'expanded' | 'full';

export interface IHelpers {
    name: string,
    priority: number,
    widget: string,
    tags: string[],
    description: string,
    mode: IMode,
    liked: boolean,
    likedAnimation: boolean,
    showInfo: boolean
}