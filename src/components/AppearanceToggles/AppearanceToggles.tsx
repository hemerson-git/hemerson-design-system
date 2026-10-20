import { useAppearance } from "../../appearance/useAppearance";
import { Icon } from "../../internal/Icon";
import { Button, type ButtonProps } from "../Button/Button";

type ToggleProps = Omit<ButtonProps, "onClick" | "children" | "icon" | "iconOnly" | "aria-label" | "aria-pressed">;

export interface ThemeToggleProps extends ToggleProps {
  /** Accessible name while dark. Default "Mudar para o tema claro". */
  lightLabel?: string;
  /** Accessible name while light. Default "Mudar para o tema escuro". */
  darkLabel?: string;
}

/** Switches between the dark theme (the default) and the light one, and remembers the choice. */
export function ThemeToggle({
  lightLabel = "Mudar para o tema claro",
  darkLabel = "Mudar para o tema escuro",
  variant = "ghost",
  ...rest
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useAppearance();
  const label = theme === "dark" ? lightLabel : darkLabel;

  return (
    <Button
      {...rest}
      variant={variant}
      iconOnly
      icon={<Icon name={theme === "dark" ? "sun" : "moon"} />}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    />
  );
}

export interface TransparencyToggleProps extends ToggleProps {
  /** Accessible name. Default "Reduzir transparência"; the pressed state says whether it is on. */
  label?: string;
}

/** Turns every glass surface solid, or back to glass, and remembers the choice. */
export function TransparencyToggle({ label = "Reduzir transparência", variant = "ghost", ...rest }: TransparencyToggleProps) {
  const { transparency, toggleTransparency } = useAppearance();

  return (
    <Button
      {...rest}
      variant={variant}
      iconOnly
      icon={<Icon name="blend" />}
      aria-label={label}
      aria-pressed={transparency === "reduced"}
      title={label}
      onClick={toggleTransparency}
    />
  );
}
