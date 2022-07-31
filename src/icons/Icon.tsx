import { CSSProperties, FunctionComponent } from "react";
import { combineClasses } from "../utils/combineClasses";

export type IconProps = {
  className?: string;
  size?: CSSProperties["fontSize"];
  styles?: CSSProperties;
};

type IconPropsInner = IconProps & {
  identifier: string;
};

export const Icon: FunctionComponent<IconPropsInner> = ({
  identifier,
  className,
  size,
  styles,
}) => (
  <i
    className={combineClasses(identifier, className)}
    style={{ fontSize: size, ...styles }}
  />
);
