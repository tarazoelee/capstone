/// <reference types="react" />
import { TypeAttributes } from '../@types/common';
export declare type ModalSize = TypeAttributes.Size | 'full' | number | string;
export declare const useBodyStyles: (ref: React.RefObject<HTMLElement>, options: {
    overflow: boolean;
    drawer: boolean;
    size?: ModalSize | undefined;
    prefix: (...classes: any) => string;
}) => [import("react").CSSProperties | null, (entering?: boolean) => void, () => void];
