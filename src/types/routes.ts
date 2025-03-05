export interface RoutesType {
    key: string;
    layout: string;
    component:  JSX.Element;
    path: string;
    secondary?: boolean;
}