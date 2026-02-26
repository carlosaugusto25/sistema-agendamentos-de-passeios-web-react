import { useContext } from "react";
import { ThemeContext } from "../context/theme";

export function useTheme() {
    return useContext(ThemeContext);
}
