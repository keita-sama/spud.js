import Package from "../package.json";
import BuilderMenu from './MenuBuilder';
import BuilderPagination from "./PaginationBuilder";
import OptionMenu from './options/MenuOption';

export const MenuBuilder = BuilderMenu;
export const PaginationBuilder = BuilderPagination;
export const MenuOption = OptionMenu;
export const version = Package.version;