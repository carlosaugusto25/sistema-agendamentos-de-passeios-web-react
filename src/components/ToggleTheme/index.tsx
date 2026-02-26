import styles from "./toogletheme.module.scss";
import { useTheme } from "../../hooks/useTheme";
import { BsSunFill, BsMoonFill } from "react-icons/bs";

export function ToggleTheme() {
    const { theme, toggleTheme } = useTheme();

    const sliderClass = `${styles.sliderIos} ${theme === "dark" ? styles.dark : styles.light}`;

    return (
        <label className={styles.switchIos}>
            <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
            />

            <span className={sliderClass}>
                <span className={styles.sun}>
                    <BsSunFill />
                </span>

                <span className={styles.moon}>
                    <BsMoonFill />
                </span>
            </span>
        </label>
    );
}
