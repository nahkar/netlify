import { Dispatch, SetStateAction } from "react";
import { IBracket } from "./bracket.interface";
import { TemplateT } from "./template.interface";

export interface IOutletContext {
	templateType: TemplateT | null;
	customNumberOfTeams: number;
	bracketData: IBracket | null;
	setBracketData: Dispatch<SetStateAction<IBracket | null>>;
}